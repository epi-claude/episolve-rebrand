// Question bank for the Operations Discovery questionnaire (M. Cary, Inc. & M. Cary Markings).
export type QType = "text" | "email" | "tel" | "url" | "number" | "textarea" | "radio" | "checkbox" | "select" | "scale" | "matrix" | "heading";
export type Answers = Record<string, string | string[]>;
export type Q = {
  id?: string; label: string; type: QType; options?: string[]; required?: boolean; comment?: boolean; pair?: boolean; tier?: 1 | 2 | 3;
  other?: boolean; max?: number; help?: string; placeholder?: string; low?: string; high?: string; rows?: string[]; showIf?: (a: Answers) => boolean;
};
export type Section = { id: string; title: string; short: string; intro: string; questions: Q[] };
// Matrix rows are stored as separate answer keys: `${id}__${rowIndex}`.
export const matrixKey = (id: string, i: number) => `${id}__${i}`;

const SCOPE_GC = 'M. Cary, Inc. only (pre-construction, GC, construction management)';
const SCOPE_MK = 'M. Cary Markings only (parking area maintenance)';
const SCOPE_SHARED = 'Both companies, with a shared back office';
const SCOPE_SEPARATE = 'Both companies, run separately';

export const SECTIONS: Section[] = [
  {
    id: 'about', title: 'About You & Your Companies', short: 'About You', intro: 'Who we will be speaking with, and which parts of the business to cover.',
    questions: [
      { id: 'full_name', tier: 1, label: 'Full name', type: 'text', required: true, comment: false, pair: true },
      { id: 'company', tier: 1, label: 'Company name', type: 'text', required: true, comment: false, pair: true },
      { id: 'email', tier: 1, label: 'Email address', type: 'email', required: true, comment: false, pair: true },
      { id: 'title', tier: 3, label: 'Role / title', type: 'text', comment: false, pair: true },
      { id: 'scope', tier: 1, label: 'Which parts of the business should this conversation cover?', type: 'radio', options: [SCOPE_GC, SCOPE_MK, SCOPE_SHARED, SCOPE_SEPARATE] },
      { id: 'customers', tier: 2, label: 'Who hires you most often?', type: 'checkbox', other: true, options: ['National retail & restaurant brands', 'Franchisees', 'Shopping center owners & landlords', 'Schools, universities & municipalities', 'GCs & paving contractors (Markings)', 'Property owners & managers (Markings)'] },
      { id: 'active_jobs', tier: 2, label: 'How many construction projects are typically running at once?', type: 'radio', options: ['1 – 5', '6 – 15', '16 – 30', '30+'] },
      { id: 'availability', tier: 3, label: 'Best times for a follow-up conversation', type: 'checkbox', options: ['Morning (9–12)', 'Midday (12–2)', 'Afternoon (2–5)'], help: 'In your local time. Use the comments if you prefer phone, video or in person.' }
    ]
  },
  {
    id: 'precon', title: 'Bidding & Subcontractor Buyout', short: 'Bidding & Subs', intro: 'How work is priced, bid out by trade, and handed to the project team.',
    questions: [
      { id: 'sub_bidding', tier: 1, label: 'How do you invite, compare and choose subcontractor bids for each trade?', type: 'radio', other: true, options: ['A bid platform end to end (e.g., BuildingConnected)', 'Email from our own list, leveled in a standard spreadsheet', 'Phone and email, compared by the estimator\'s judgment', 'Varies by estimator / PM'] },
      { id: 'handoff', tier: 1, label: 'When a job is awarded, how does the estimate become the working budget and buyout plan?', type: 'radio', options: ['Carried straight into our project / accounting system', 'Re-keyed by hand into another system', 'The PM rebuilds it in a spreadsheet', 'There isn\'t a formal handoff'] },
      { id: 'bid_volume', tier: 2, label: 'Roughly how many projects do you bid or price each month?', type: 'radio', options: ['Fewer than 5', '5 – 15', '15 – 30', 'More than 30'] },
      { id: 'long_lead', tier: 2, label: 'How are long-lead and hard-to-source materials and finishes tracked?', type: 'radio', options: ['A procurement log shared by the team', 'Each PM\'s own notes or email', 'Project management software', 'Not tracked formally'] }
    ]
  },
  {
    id: 'projects', title: 'Running Projects & Controlling Cost', short: 'Projects & Costs', intro: 'How the office, superintendents, subcontractors and client stay in sync, and how cost and change are controlled.',
    questions: [
      { type: 'heading', label: 'Coordination' },
      { id: 'field_updates', tier: 1, label: 'How do field updates reach the office and the client?', type: 'radio', options: ['Digital daily logs with photos, shared with the client', 'Digital logs for the office, separate updates to the client', 'Emails, texts and phone calls', 'No regular reporting'] },
      { id: 'pm_tool', tier: 2, label: 'What do PMs use to run projects?', type: 'radio', other: true, options: ['Procore', 'Buildertrend', 'Smartsheet / MS Project', 'Excel, email and shared folders'] },
      { id: 'documents', tier: 2, label: 'Which of these are tracked in one shared place (not in individual inboxes)?', type: 'checkbox', options: ['RFIs', 'Submittals & shop drawings', 'Drawings & revisions', 'Permits & inspections', 'Punch lists', 'Closeout documents', 'None of these'] },
      { type: 'heading', label: 'Cost & change control' },
      { id: 'committed', tier: 1, label: 'Once a subcontract or PO is issued, when do you see it against the budget?', type: 'radio', options: ['Immediately', 'When the first invoice arrives', 'At month-end', 'Not really'] },
      { id: 'co_lag', tier: 1, label: 'How long from extra work performed to an approved, billable change order?', type: 'radio', options: ['Under a week', '1 – 4 weeks', '1 – 3 months', 'Some never get billed'], help: 'Use the comments to tell us where change orders are logged and how client and sub changes are matched.' },
      { id: 'sub_pay_checks', tier: 1, label: 'Before a subcontractor is paid, what gets checked, and how?', type: 'checkbox', other: true, options: ['Current insurance certificate', 'Lien waiver received', 'Work verified against schedule of values / % complete', 'PM approval', 'Tracked in software with reminders', 'Tracked in a spreadsheet', 'Inconsistent'] },
      { id: 'fade_story', tier: 2, label: 'Tell us about a recent project where margin slipped. When did you notice, and what would have caught it sooner?', type: 'textarea' }
    ]
  },
  {
    id: 'billing', title: 'Billing & Accounting', short: 'Billing', intro: 'How you bill clients, get paid, and keep the books.',
    questions: [
      { id: 'accounting', tier: 1, label: 'Which accounting system do you use?', type: 'radio', other: true, options: ['QuickBooks Online', 'QuickBooks Desktop / Enterprise', 'Sage 100 Contractor', 'Sage 300 CRE', 'Foundation', 'Viewpoint (Vista / Spectrum)'], help: 'If the two companies use different systems, please note both in the comments.' },
      { id: 'accounting_stay', tier: 1, label: 'Does that accounting system need to stay in place?', type: 'radio', options: ['Yes, it must stay', 'We\'d prefer to keep it', 'Open to change', 'Not sure'] },
      { id: 'billing_types', tier: 1, label: 'How do you bill your clients?', type: 'checkbox', other: true, options: ['AIA G702 / G703 pay applications', 'Client portals (Textura, GCPay, Procore Pay, etc.)', 'Lump-sum progress invoices', 'Time & materials', 'Fixed price per job (common for Markings)'] },
      { id: 'payment_delays', tier: 2, label: 'What most often slows down getting paid?', type: 'checkbox', other: true, options: ['Missing lien waivers or paperwork', 'Client portal requirements', 'Disputed change orders', 'Retainage release', 'Punch list / closeout not finished', 'Invoices going out late on our end'] }
    ]
  },
  {
    id: 'priorities', title: 'Priorities & Next Steps', short: 'Priorities', intro: 'Where it hurts most, and what you want out of our follow-up conversation.',
    questions: [
      { id: 'pain', tier: 1, label: 'How painful is each area today?', type: 'matrix', low: 'Working fine', high: 'Major problem', rows: ['Bidding & subcontractor buyout', 'Field reporting & project documents', 'Budgets, commitments & change orders', 'Subcontractor compliance & payments', 'Billing & getting paid', 'Reporting & visibility for leadership'], help: 'Rate the ones that apply. The highest-rated areas set the agenda for our call.' },
      { id: 'headache', tier: 1, label: 'What is your single biggest operational headache today?', type: 'textarea' },
      { id: 'success', tier: 2, label: 'What\'s prompting you to look at this now, and what would success look like 12 months from now?', type: 'textarea' },
      { id: 'timeline', tier: 2, label: 'When would you like to have improvements in place?', type: 'radio', options: ['As soon as possible (0 – 3 months)', '3 – 6 months', '6 – 12 months', 'No set timeline'] },
      { id: 'tools', tier: 2, label: 'Which other systems hold data that would need to connect?', type: 'checkbox', other: true, options: ['Excel / Google Sheets', 'Microsoft 365 / Outlook / Teams', 'Google Workspace', 'Dropbox / SharePoint / shared server', 'Procore', 'A CRM (HubSpot, Salesforce, etc.)'] },
      { id: 'monday', tier: 2, label: 'What would you want to see every Monday morning that you can\'t easily get today?', type: 'textarea' },
      { id: 'concerns', tier: 3, label: 'What concerns you most about changing how you work?', type: 'checkbox', other: true, options: ['Migrating existing data', 'Getting superintendents and crews to adopt it', 'Disrupting accounting', 'Cost', 'Time to implement', 'Training staff'] },
      { id: 'anything_else', tier: 3, label: 'Anything else we should know before we talk?', type: 'textarea' }
    ]
  }
];
