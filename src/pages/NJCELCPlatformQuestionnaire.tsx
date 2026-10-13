import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";



/* ------------------------------------------------------------------ */
/* Data model                                                          */
/* ------------------------------------------------------------------ */

type Answers = Record<string, string | string[]>;

const STORAGE_KEY = "njcelc-questionnaire-draft-v1";
const SENT_KEY = "njcelc-questionnaire-sent-v1";

interface SentRecord {
  name: string;
  role: string;
  sentAt: string;
  answered: number;
  answers: Answers;
}

const PARTS = [
  "About you",
  "Your courses today",
  "Features you rely on",
  "Credits and certificates",
  "Interactive video and AI",
  "Learners and access",
  "Reporting",
  "The website",
  "Anything else",
];

/* Question registry: id -> { label, part } used for export + counting */
const QUESTION_LABELS: Record<string, { label: string; part: number }> = {
  name: { label: "Your name", part: 1 },
  role: { label: "Your role at NJCELC", part: 1 },
  work_areas: { label: "Which of these are part of your work?", part: 1 },
  course_count: { label: "Roughly how many courses are live in LearnUpon?", part: 2 },
  retired_courses: {
    label: "Are any courses out of date or unused, so they could be retired instead of moved?",
    part: 2,
  },
  course_contents: { label: "What do your courses contain?", part: 2 },
  course_contents_other: { label: "Other course content (describe)", part: 2 },
  scorm_tool: { label: "If you use SCORM packages, which tool made them?", part: 2 },
  original_files: {
    label: "Do you still have the original files for your courses saved outside LearnUpon?",
    part: 2,
  },
  original_files_location: { label: "Where are those original files kept?", part: 2 },
  purchased_courses: {
    label: "Do you use any courses bought through LearnUpon from another provider, such as Go1 or OpenSesame?",
    part: 2,
  },
  build_process: {
    label: "Walk us through how you build a new course today, from first idea to published.",
    part: 2,
  },
  features_keep: { label: "Which of these do you use and need to keep?", part: 3 },
  features_other: { label: "Other features (describe)", part: 3 },
  frustrations: { label: "What frustrates you most about LearnUpon?", part: 3 },
  wishlist: { label: "What do you wish it did that it doesn't?", part: 3 },
  ce_credits: {
    label: "Do any courses award continuing education credits or hours recognized by an outside organization?",
    part: 4,
  },
  ce_orgs: { label: "Which organizations, and what do they require?", part: 4 },
  course_rules: { label: "Do any courses need these rules?", part: 4 },
  certificates: { label: "What appears on your certificates, and who designs them?", part: 4 },
  records_retention: { label: "How long must completion records be kept?", part: 4 },
  interactive_video: { label: "Which interactive video experience do you want?", part: 5 },
  interactive_video_course: {
    label: "Which course or topic would benefit most from interactive video?",
    part: 5,
  },
  ai_help: { label: "Where would AI help you most when building courses?", part: 5 },
  ai_help_other: { label: "Other AI help (describe)", part: 5 },
  ai_expectation: { label: "What would you expect from AI-drafted content?", part: 5 },
  ai_material: { label: "What material would you give it to work from?", part: 5 },
  ai_users: { label: "Who would use these tools?", part: 5 },
  who_takes: { label: "Who is allowed to take courses?", part: 6 },
  membership_list: { label: "Where is your membership list kept?", part: 6 },
  enrollment: { label: "How do learners get into a course?", part: 6 },
  learner_groups: {
    label: "Do different groups of learners need to see different courses?",
    part: 6,
  },
  devices: { label: "How do most learners take courses?", part: 6 },
  languages: { label: "Do you need courses in languages other than English?", part: 6 },
  records_carryover: {
    label: "How important is carrying over learners' records from LearnUpon?",
    part: 6,
  },
  reports: { label: "Which reports do you run regularly, and who receives them?", part: 7 },
  funder_reports: {
    label: "Do you report training numbers to funders or government agencies? What do they ask for?",
    part: 7,
  },
  site_sections: { label: "Which parts of the website do you update?", part: 8 },
  site_sections_other: { label: "Other website sections (describe)", part: 8 },
  update_frequency: { label: "How often do you update the website?", part: 8 },
  wp_editor: { label: "In WordPress, how did you edit pages?", part: 8 },
  site_tasks: { label: "List the website tasks you do most often.", part: 8 },
  approval: { label: "Does content need someone's approval before it goes live?", part: 8 },
  editor_count: { label: "How many people edit the website?", part: 8 },
  anything_else: { label: "Anything else we should know?", part: 9 },
};

/* ------------------------------------------------------------------ */
/* Small form primitives                                               */
/* ------------------------------------------------------------------ */

function Field({
  label,
  hint,
  children,
  highlight,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight
          ? "border-[#F2A900] bg-[#FDF6E7]"
          : "border-slate-200 bg-white"
      }`}
    >
      <label className="block text-base font-semibold text-slate-900">{label}</label>
      {hint && <p className="mt-1 text-sm text-slate-600">{hint}</p>}
      {highlight && (
        <p className="mt-2 inline-block rounded-full bg-[#F2A900] px-2.5 py-0.5 text-xs font-bold tracking-wide text-slate-900 uppercase">
          Most important question
        </p>
      )}
      <div className="mt-3">{children}</div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#005EA8] focus:ring-2 focus:ring-[#005EA8]/20 focus:outline-none";

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      className={inputCls}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function TextArea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      className={inputCls}
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Checkboxes({
  options,
  values,
  onChange,
}: {
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt]);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
            values.includes(opt)
              ? "border-[#005EA8] bg-[#005EA8]/5 text-slate-900"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          }`}
        >
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-[#005EA8]"
            checked={values.includes(opt)}
            onChange={() => toggle(opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function Radios({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
            value === opt
              ? "border-[#005EA8] bg-[#005EA8]/5 text-slate-900"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
          }`}
        >
          <input
            type="radio"
            name={name}
            className="mt-0.5 h-4 w-4 accent-[#005EA8]"
            checked={value === opt}
            onChange={() => onChange(opt)}
          />
          <span>{opt}</span>
        </label>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function QuestionnairePage() {
  useEffect(() => {
    document.title = "NJCELC Platform Questionnaire — Help plan the new learning platform";
    const m = document.createElement("meta"); m.name = "robots"; m.content = "noindex, nofollow"; document.head.appendChild(m);
    return () => { m.remove(); };
  }, []);
  const [answers, setAnswers] = useState<Answers>({});
  const [sent, setSent] = useState<SentRecord[]>([]);
  const [activePart, setActivePart] = useState(1);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [justSent, setJustSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const hydrated = useRef(false);

  // Load draft + sent records on mount (client only)
  useEffect(() => {
    try {
      const draft = window.localStorage.getItem(STORAGE_KEY);
      if (draft) setAnswers(JSON.parse(draft));
      const sentRaw = window.localStorage.getItem(SENT_KEY);
      if (sentRaw) setSent(JSON.parse(sentRaw));
    } catch {
      /* ignore corrupt storage */
    }
    hydrated.current = true;
  }, []);

  // Autosave on every change
  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    setSavedAt(new Date().toLocaleTimeString());
  }, [answers]);

  const get = (id: string) => (answers[id] as string) ?? "";
  const getArr = (id: string) => (answers[id] as string[]) ?? [];
  const set = (id: string, v: string | string[]) =>
    setAnswers((a) => ({ ...a, [id]: v }));

  const answeredCount = useMemo(
    () =>
      Object.keys(QUESTION_LABELS).filter((id) => {
        const v = answers[id];
        return Array.isArray(v) ? v.length > 0 : typeof v === "string" && v.trim() !== "";
      }).length,
    [answers],
  );
  const totalQuestions = Object.keys(QUESTION_LABELS).length;
  const progress = Math.round((answeredCount / totalQuestions) * 100);

  const toPlainText = (a: Answers) => {
    const lines: string[] = [
      "NJCELC PLATFORM QUESTIONNAIRE",
      `Exported ${new Date().toLocaleString()}`,
      "",
    ];
    for (let part = 1; part <= 9; part++) {
      lines.push(`--- Part ${part} of 9: ${PARTS[part - 1]} ---`);
      for (const [id, meta] of Object.entries(QUESTION_LABELS)) {
        if (meta.part !== part) continue;
        const v = a[id];
        const val = Array.isArray(v) ? v.join("; ") : (v ?? "");
        lines.push(`${meta.label}\n${val.trim() || "(no answer)"}\n`);
      }
    }
    return lines.join("\n");
  };

  const handleSend = async () => {
    const { error } = await supabase.from("njcelc_questionnaire_responses").insert({
      respondent_name: get("name") || null,
      organization: get("role") || null,
      answers,
    });
    if (error) {
      alert("Sorry, your answers could not be sent. Please try again or use Download.");
      return;
    }
    const record: SentRecord = {
      name: get("name") || "(no name given)",
      role: get("role") || "(no role given)",
      sentAt: new Date().toLocaleString(),
      answered: answeredCount,
      answers,
    };
    const next = [...sent, record];
    setSent(next);
    window.localStorage.setItem(SENT_KEY, JSON.stringify(next));
    setJustSent(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleDownload = () => {
    const blob = new Blob([toPlainText(answers)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "njcelc-questionnaire-answers.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(toPlainText(answers));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const scrollToPart = (part: number) => {
    setActivePart(part);
    document.getElementById(`part-${part}`)?.scrollIntoView({ behavior: "smooth" });
  };

  const PartShell = ({
    part,
    title,
    intro,
    children,
  }: {
    part: number;
    title: string;
    intro?: string;
    children: React.ReactNode;
  }) => (
    <section id={`part-${part}`} className="scroll-mt-24">
      <div className="mb-4 border-b border-slate-200 pb-3">
        <p className="text-xs font-bold tracking-widest text-[#005EA8] uppercase">
          Part {part} of 9
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900">{title}</h2>
        {intro && <p className="mt-1 text-sm text-slate-600">{intro}</p>}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-xs font-bold tracking-widest text-[#00A6D6] uppercase">
            Moving off LearnUpon · New website
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Help us plan the new learning platform and website
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            epiSolve is moving your courses off LearnUpon and rebuilding njcelc.com with
            an editor your staff can use. Your answers decide what we build first and how
            courses move over. Answer the sections that match your work and skip the rest.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-[#27AE60]/10 px-3 py-1 font-medium text-[#1e7a46]">
              ✓ Saves as you type
            </span>
            <span className="rounded-full bg-[#27AE60]/10 px-3 py-1 font-medium text-[#1e7a46]">
              ✓ Come back any time to finish
            </span>
            <span className="rounded-full bg-[#27AE60]/10 px-3 py-1 font-medium text-[#1e7a46]">
              ✓ About 20 minutes for the whole form
            </span>
          </div>
        </div>
      </header>

      {/* Sticky progress + part nav */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#005EA8] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="shrink-0 text-xs font-medium text-slate-500">
              {answeredCount} of {totalQuestions} answered
              {savedAt ? ` · saved ${savedAt}` : ""}
            </p>
          </div>
          <nav className="mt-2 flex gap-1 overflow-x-auto pb-1">
            {PARTS.map((p, i) => (
              <button
                key={p}
                onClick={() => scrollToPart(i + 1)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${
                  activePart === i + 1
                    ? "bg-[#005EA8] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {i + 1}. {p}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="mx-auto max-w-3xl space-y-12 px-4 py-10">
        {/* PART 1 */}
        <PartShell
          part={1}
          title="About you"
          intro="Answer the parts that apply to you and skip the rest. Others on your team will cover their own areas."
        >
          <Field label="Your name">
            <TextInput value={get("name")} onChange={(v) => set("name", v)} />
          </Field>
          <Field label="Your role at NJCELC">
            <TextInput value={get("role")} onChange={(v) => set("role", v)} />
          </Field>
          <Field label="Which of these are part of your work?">
            <Checkboxes
              options={[
                "Creating or updating courses",
                "Updating the website",
                "Leadership and approvals",
                "Managing learners and enrollments",
                "Reporting to funders or agencies",
              ]}
              values={getArr("work_areas")}
              onChange={(v) => set("work_areas", v)}
            />
          </Field>
        </PartShell>

        {/* PART 2 */}
        <PartShell
          part={2}
          title="Your courses today"
          intro="What exists in LearnUpon now, and where the original files live."
        >
          <Field label="Roughly how many courses are live in LearnUpon?">
            <TextInput value={get("course_count")} onChange={(v) => set("course_count", v)} />
          </Field>
          <Field label="Are any courses out of date or unused, so they could be retired instead of moved?">
            <TextArea
              value={get("retired_courses")}
              onChange={(v) => set("retired_courses", v)}
            />
          </Field>
          <Field label="What do your courses contain?">
            <Checkboxes
              options={[
                "Videos uploaded into LearnUpon",
                "Videos linked from YouTube or Vimeo",
                "Slides or PDFs",
                "Text and images built in LearnUpon's own editor",
                "SCORM packages made in another tool",
                "Quizzes or exams",
                "Assignments learners upload",
                "Live sessions or webinars",
                "Surveys or evaluations",
              ]}
              values={getArr("course_contents")}
              onChange={(v) => set("course_contents", v)}
            />
            <div className="mt-2">
              <TextInput
                value={get("course_contents_other")}
                onChange={(v) => set("course_contents_other", v)}
                placeholder="Other (describe)"
              />
            </div>
          </Field>
          <Field
            label="If you use SCORM packages, which tool made them?"
            hint="For example Articulate Rise or Storyline, Adobe Captivate, iSpring."
          >
            <TextInput value={get("scorm_tool")} onChange={(v) => set("scorm_tool", v)} />
          </Field>
          <Field
            label="Do you still have the original files for your courses saved outside LearnUpon?"
            hint="Original videos, slide decks and authoring tool project files. This matters most: files uploaded to LearnUpon, especially SCORM packages, can't be downloaded again, so courses without originals may need to be rebuilt."
            highlight
          >
            <Radios
              name="original_files"
              options={[
                "Yes, for all courses",
                "Yes, for most courses",
                "For some courses",
                "No, most courses were built inside LearnUpon",
                "Not sure",
              ]}
              value={get("original_files")}
              onChange={(v) => set("original_files", v)}
            />
          </Field>
          <Field
            label="Where are those original files kept?"
            hint="A shared drive, Google Drive, SharePoint, a vendor, someone's computer."
          >
            <TextInput
              value={get("original_files_location")}
              onChange={(v) => set("original_files_location", v)}
            />
          </Field>
          <Field
            label="Do you use any courses bought through LearnUpon from another provider, such as Go1 or OpenSesame?"
            hint="Purchased courses usually can't move to a new platform."
          >
            <Radios
              name="purchased_courses"
              options={["Yes", "No", "Not sure"]}
              value={get("purchased_courses")}
              onChange={(v) => set("purchased_courses", v)}
            />
          </Field>
          <Field label="Walk us through how you build a new course today, from first idea to published.">
            <TextArea
              value={get("build_process")}
              onChange={(v) => set("build_process", v)}
              rows={5}
            />
          </Field>
        </PartShell>

        {/* PART 3 */}
        <PartShell
          part={3}
          title="Features you rely on"
          intro="The new platform needs to cover what you actually use."
        >
          <Field label="Which of these do you use and need to keep?">
            <Checkboxes
              options={[
                "Course catalog where learners sign themselves up",
                "Learning paths (a set of courses taken in order)",
                "Prerequisites",
                "Certificates on completion",
                "Due dates and reminder emails",
                "Exams drawn from question pools",
                "Groups or cohorts of learners",
                "Reports for managers or staff",
                "Live session scheduling and attendance",
                "Surveys and course evaluations",
                "Mobile app",
                "Badges or points",
              ]}
              values={getArr("features_keep")}
              onChange={(v) => set("features_keep", v)}
            />
            <div className="mt-2">
              <TextInput
                value={get("features_other")}
                onChange={(v) => set("features_other", v)}
                placeholder="Other (describe)"
              />
            </div>
          </Field>
          <Field label="What frustrates you most about LearnUpon?">
            <TextArea value={get("frustrations")} onChange={(v) => set("frustrations", v)} />
          </Field>
          <Field label="What do you wish it did that it doesn't?">
            <TextArea value={get("wishlist")} onChange={(v) => set("wishlist", v)} />
          </Field>
        </PartShell>

        {/* PART 4 */}
        <PartShell
          part={4}
          title="Credits and certificates"
          intro="Anything an outside body checks has to carry over exactly."
        >
          <Field label="Do any courses award continuing education credits or hours recognized by an outside organization?">
            <Radios
              name="ce_credits"
              options={["Yes", "No", "Not sure"]}
              value={get("ce_credits")}
              onChange={(v) => set("ce_credits", v)}
            />
          </Field>
          <Field
            label="Which organizations, and what do they require?"
            hint="For example BPI, NABCEP or a state licensing board. Include anything they audit: attendance, time spent, passing score."
          >
            <TextArea value={get("ce_orgs")} onChange={(v) => set("ce_orgs", v)} />
          </Field>
          <Field label="Do any courses need these rules?">
            <Checkboxes
              options={[
                "A minimum passing score",
                "Lessons completed in a set order",
                "A minimum time spent",
                "A record of every attempt",
                "None of these",
              ]}
              values={getArr("course_rules")}
              onChange={(v) => set("course_rules", v)}
            />
          </Field>
          <Field label="What appears on your certificates, and who designs them?">
            <TextArea value={get("certificates")} onChange={(v) => set("certificates", v)} />
          </Field>
          <Field label="How long must completion records be kept?">
            <TextInput
              value={get("records_retention")}
              onChange={(v) => set("records_retention", v)}
            />
          </Field>
        </PartShell>

        {/* PART 5 */}
        <PartShell
          part={5}
          title="Interactive video and AI"
          intro="Two things the new platform should do better than LearnUpon."
        >
          <Field label="Which interactive video experience do you want?">
            <Radios
              name="interactive_video"
              options={[
                "Video pauses and the learner must answer to continue",
                "The learner's answer changes what they see next",
                "Both",
                "Not needed",
              ]}
              value={get("interactive_video")}
              onChange={(v) => set("interactive_video", v)}
            />
          </Field>
          <Field label="Which course or topic would benefit most from interactive video?">
            <TextInput
              value={get("interactive_video_course")}
              onChange={(v) => set("interactive_video_course", v)}
            />
          </Field>
          <Field label="Where would AI help you most when building courses?">
            <Checkboxes
              options={[
                "Draft a course outline from a document",
                "Write lesson text",
                "Create quiz questions from lesson content",
                "Create quiz questions from a video transcript",
                "Summarize long source material",
                "Translate a course",
                "Answer learners' questions about the course",
                "Not interested",
              ]}
              values={getArr("ai_help")}
              onChange={(v) => set("ai_help", v)}
            />
            <div className="mt-2">
              <TextInput
                value={get("ai_help_other")}
                onChange={(v) => set("ai_help_other", v)}
                placeholder="Other (describe)"
              />
            </div>
          </Field>
          <Field label="What would you expect from AI-drafted content?">
            <Radios
              name="ai_expectation"
              options={[
                "A rough first draft I rewrite",
                "A solid draft I edit lightly",
                "Near-final content",
                "Not sure yet",
              ]}
              value={get("ai_expectation")}
              onChange={(v) => set("ai_expectation", v)}
            />
          </Field>
          <Field
            label="What material would you give it to work from?"
            hint="Manuals, program guidelines, slide decks, recorded trainings. Note the file types."
          >
            <TextArea value={get("ai_material")} onChange={(v) => set("ai_material", v)} />
          </Field>
          <Field label="Who would use these tools?">
            <TextInput value={get("ai_users")} onChange={(v) => set("ai_users", v)} />
          </Field>
        </PartShell>

        {/* PART 6 */}
        <PartShell
          part={6}
          title="Learners and access"
          intro="Who takes courses and how they get in."
        >
          <Field label="Who is allowed to take courses?">
            <Radios
              name="who_takes"
              options={[
                "Anyone who signs up",
                "Only current members",
                "It varies by course",
                "Not sure",
              ]}
              value={get("who_takes")}
              onChange={(v) => set("who_takes", v)}
            />
          </Field>
          <Field
            label="Where is your membership list kept?"
            hint="A database or CRM (name it), a spreadsheet, another system."
          >
            <TextInput
              value={get("membership_list")}
              onChange={(v) => set("membership_list", v)}
            />
          </Field>
          <Field label="How do learners get into a course?">
            <Checkboxes
              options={[
                "They sign up from the catalog",
                "Staff enroll them",
                "They're enrolled automatically",
                "They use an invite link",
              ]}
              values={getArr("enrollment")}
              onChange={(v) => set("enrollment", v)}
            />
          </Field>
          <Field
            label="Do different groups of learners need to see different courses?"
            hint="For example contractors, utility staff, municipal staff, students."
          >
            <TextArea
              value={get("learner_groups")}
              onChange={(v) => set("learner_groups", v)}
              rows={3}
            />
          </Field>
          <Field label="How do most learners take courses?">
            <Radios
              name="devices"
              options={["Mostly on computers", "Mostly on phones", "A mix", "Not sure"]}
              value={get("devices")}
              onChange={(v) => set("devices", v)}
            />
          </Field>
          <Field label="Do you need courses in languages other than English?">
            <TextInput value={get("languages")} onChange={(v) => set("languages", v)} />
          </Field>
          <Field label="How important is carrying over learners' records from LearnUpon?">
            <Radios
              name="records_carryover"
              options={[
                "Essential, including courses in progress",
                "Completed courses only",
                "Nice to have",
                "Not needed",
              ]}
              value={get("records_carryover")}
              onChange={(v) => set("records_carryover", v)}
            />
          </Field>
        </PartShell>

        {/* PART 7 */}
        <PartShell
          part={7}
          title="Reporting"
          intro="The numbers you need to get out of the system."
        >
          <Field label="Which reports do you run regularly, and who receives them?">
            <TextArea value={get("reports")} onChange={(v) => set("reports", v)} />
          </Field>
          <Field label="Do you report training numbers to funders or government agencies? What do they ask for?">
            <TextArea
              value={get("funder_reports")}
              onChange={(v) => set("funder_reports", v)}
            />
          </Field>
        </PartShell>

        {/* PART 8 */}
        <PartShell
          part={8}
          title="The website"
          intro="For staff who update njcelc.com. The new site gets an editor like WordPress."
        >
          <Field label="Which parts of the website do you update?">
            <Checkboxes
              options={[
                "News or blog posts",
                "Events",
                "Resources and downloads",
                "Program pages",
                "Staff, board or partner listings",
                "Home page",
                "Menus and footer",
              ]}
              values={getArr("site_sections")}
              onChange={(v) => set("site_sections", v)}
            />
            <div className="mt-2">
              <TextInput
                value={get("site_sections_other")}
                onChange={(v) => set("site_sections_other", v)}
                placeholder="Other (describe)"
              />
            </div>
          </Field>
          <Field label="How often do you update the website?">
            <Radios
              name="update_frequency"
              options={["Daily", "Weekly", "Monthly", "Rarely"]}
              value={get("update_frequency")}
              onChange={(v) => set("update_frequency", v)}
            />
          </Field>
          <Field label="In WordPress, how did you edit pages?">
            <Radios
              name="wp_editor"
              options={[
                "Elementor (drag-and-drop page builder)",
                "The block editor",
                "The classic editor",
                "Not sure",
              ]}
              value={get("wp_editor")}
              onChange={(v) => set("wp_editor", v)}
            />
          </Field>
          <Field
            label="List the website tasks you do most often."
            hint="For example: post a news item with a photo, add an event, swap a PDF, change a menu link. We'll use this list to test the new editor with you."
          >
            <TextArea value={get("site_tasks")} onChange={(v) => set("site_tasks", v)} />
          </Field>
          <Field label="Does content need someone's approval before it goes live?">
            <Radios
              name="approval"
              options={["Yes, always", "Sometimes", "No"]}
              value={get("approval")}
              onChange={(v) => set("approval", v)}
            />
          </Field>
          <Field label="How many people edit the website?">
            <TextInput
              value={get("editor_count")}
              onChange={(v) => set("editor_count", v)}
            />
          </Field>
        </PartShell>

        {/* PART 9 */}
        <PartShell part={9} title="Anything else">
          <Field label="Anything else we should know?">
            <TextArea
              value={get("anything_else")}
              onChange={(v) => set("anything_else", v)}
              rows={5}
            />
          </Field>
        </PartShell>

        {/* Send your answers */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Send your answers</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Your answers save automatically. When you're done, send them so epiSolve knows
            you've finished. You can still change them afterward.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleSend}
              className="rounded-lg bg-[#005EA8] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#004b86]"
            >
              Send my answers
            </button>
            <button
              onClick={handleDownload}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Download a copy
            </button>
            <button
              onClick={handleCopy}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              {copied ? "Copied!" : "Copy my answers as text"}
            </button>
          </div>
          {justSent && (
            <p className="mt-3 rounded-lg bg-[#27AE60]/10 px-4 py-2.5 text-sm font-medium text-[#1e7a46]">
              ✓ Thanks — your answers have been recorded below. You can keep editing and
              send again any time.
            </p>
          )}
        </section>

        {/* Responses so far */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900">Responses so far</h2>
            <p className="text-xs text-slate-500">Only you see this panel.</p>
          </div>
          {sent.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Nothing sent yet. When you press “Send my answers”, your submission appears
              here.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase">
                    <th className="py-2 pr-4 font-semibold">Name</th>
                    <th className="py-2 pr-4 font-semibold">Role</th>
                    <th className="py-2 pr-4 font-semibold">Status</th>
                    <th className="py-2 pr-4 font-semibold">Answered</th>
                    <th className="py-2 font-semibold">Last change</th>
                  </tr>
                </thead>
                <tbody>
                  {sent.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-2.5 pr-4 font-medium text-slate-900">{r.name}</td>
                      <td className="py-2.5 pr-4 text-slate-600">{r.role}</td>
                      <td className="py-2.5 pr-4">
                        <span className="rounded-full bg-[#27AE60]/10 px-2 py-0.5 text-xs font-semibold text-[#1e7a46]">
                          Sent
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-slate-600">
                        {r.answered} of {totalQuestions}
                      </td>
                      <td className="py-2.5 text-slate-600">{r.sentAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="pb-6 text-center text-xs text-slate-400">
          New Jersey Clean Energy Learning Center · Platform planning questionnaire by
          epiSolve
        </footer>
      </main>
    </div>
  );
}
