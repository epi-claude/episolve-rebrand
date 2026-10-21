// Question bank for the Contractor Operations Discovery questionnaire.
export type QType = "text" | "email" | "tel" | "url" | "number" | "textarea" | "radio" | "checkbox" | "select" | "scale" | "heading";
export type Answers = Record<string, string | string[]>;
export type Q = {
  id?: string; label: string; type: QType; options?: string[]; required?: boolean; comment?: boolean; pair?: boolean;
  other?: boolean; max?: number; help?: string; placeholder?: string; low?: string; high?: string; showIf?: (a: Answers) => boolean;
};
export type Section = { id: string; title: string; short: string; intro: string; questions: Q[] };
const mk = (a: Partial<Q>, b: Partial<Q>) => ({ ...a, ...b }) as Q;
export function notNoService(a: Answers) { return !String(a.has_service || "").startsWith("None"); }

const PAIN: Partial<Q> = { type: 'scale', low: 'Working fine', high: 'Major problem' };

export const SECTIONS: Section[] = [
  {
    id: 'about', title: 'About You & Your Company', short: 'About You', intro: 'Who we will be speaking with, and the kind of work your company does.',
    questions: [
      { type: 'heading', label: 'Contact' },
      { id: 'full_name', label: 'Full name', type: 'text', required: true, comment: false, pair: true },
      { id: 'title', label: 'Role / title', type: 'text', comment: false, pair: true },
      { id: 'company', label: 'Company name', type: 'text', required: true, comment: false, pair: true },
      { id: 'email', label: 'Email address', type: 'email', required: true, comment: false, pair: true },
      { id: 'contact_pref', label: 'Preferred way to follow up', type: 'radio', options: ['Email', 'Phone call', 'Video call', 'In person', 'No preference'], comment: false },
      { id: 'availability', label: 'Best times for a follow-up conversation', type: 'checkbox', options: ['Early morning (before 9)', 'Morning (9–12)', 'Midday (12–2)', 'Afternoon (2–5)', 'After 5 pm'], help: 'In your local time.' },
      { type: 'heading', label: 'Your company' },
      { id: 'trades', label: 'Which trades do you self-perform?', type: 'checkbox', other: true, options: ['HVAC / sheet metal', 'Plumbing / piping', 'Process / industrial piping', 'Controls / BAS', 'Fire protection', 'Refrigeration', 'Service & maintenance'] },
      { id: 'work_mix', label: 'What types of work do you do?', type: 'checkbox', other: true, options: ['New construction', 'Tenant fit-outs / interiors', 'Renovation / retrofit', 'Design-build / design-assist', 'Recurring service & maintenance', 'Emergency / on-call service'] },
      { id: 'customers', label: 'Who are your customers?', type: 'checkbox', other: true, options: ['General contractors / CMs', 'Building owners (direct)', 'Public / government agencies', 'Property managers / facilities teams', 'Institutional (schools, healthcare)'] }
    ]
  },
  {
    id: 'systems', title: 'Systems, Job Setup & Budgets', short: 'Systems & Setup', intro: 'The software and records your business runs on, and how jobs are set up.',
    questions: [
      { type: 'heading', label: 'Systems today' },
      { id: 'accounting', label: 'Which accounting system do you use?', type: 'radio', other: true, options: ['QuickBooks Online', 'QuickBooks Desktop / Enterprise', 'Sage 100 Contractor', 'Sage 300 CRE', 'Foundation', 'Viewpoint (Vista / Spectrum)'] },
      { id: 'accounting_stay', label: 'Does that accounting system need to stay in place?', type: 'radio', options: ['Yes, it must stay', 'We\'d prefer to keep it', 'Open to change', 'Not sure'] },
      { id: 'payroll', label: 'How is payroll processed?', type: 'radio', other: true, options: ['Inside our accounting system', 'ADP', 'Paychex', 'Gusto', 'Outside bookkeeper / CPA'] },
      { id: 'tools', label: 'Which other tools are in daily use?', type: 'checkbox', other: true, options: ['Excel / Google Sheets', 'Procore', 'ServiceTitan', 'BuildOps', 'Estimating software (QuoteSoft, Trimble, FastEST, etc.)', 'Scheduling (MS Project, etc.)', 'Dropbox / SharePoint / shared drive', 'Paper forms & clipboards'] },
      { id: 'records', label: 'Where do operational and cost records live today?', type: 'checkbox', other: true, options: ['Paper timecards, clipboards and job folders', 'Disconnected spreadsheets (budgets, PO logs, trackers)', 'Local office server / shared network drive', 'Accounting software only', 'Individual PMs\' email and laptops'] },
      { type: 'heading', label: 'Job setup & budgets' },
      { id: 'job_numbers', label: 'How are job numbers assigned?', type: 'radio', options: ['Consistent company-wide scheme', 'Accounting assigns them', 'Varies by person', 'No formal scheme'] },
      { id: 'cost_codes', label: 'How are cost codes used?', type: 'radio', options: ['Standardized across all jobs', 'Partly standardized', 'Built per job', 'We don\'t really use cost codes'] },
      { id: 'overhead', label: 'Which non-job costs do you track separately?', type: 'checkbox', other: true, options: ['Shop time', 'PTO / holidays', 'Training', 'Warehouse / fabrication', 'Vehicles / fleet', 'We don\'t track these separately'] },
      mk({ id: 'pain_setup', label: 'Overall, how painful is job setup and budgeting today?' }, PAIN)
    ]
  },
  {
    id: 'purchasing', title: 'Purchasing & Vendor Bills', short: 'Purchasing', intro: 'How committed costs show up against the budget, and how vendor bills are checked before payment.',
    questions: [
      { type: 'heading', label: 'Purchasing & committed costs' },
      { id: 'committed', label: 'When a PO is issued, when do you see its effect against the budget?', type: 'radio', options: ['Immediately', 'When the vendor bill arrives', 'At month-end close', 'Not really'] },
      { id: 'overrun_story', label: 'Can you describe a recent material overrun that was caught too late?', type: 'textarea' },
      mk({ id: 'pain_purchasing', label: 'Overall, how painful is purchasing and cost control today?' }, PAIN),
      { type: 'heading', label: 'Vendor bills & payables' },
      { id: 'bill_volume', label: 'Vendor bills received per month (approx.)', type: 'radio', options: ['Under 50', '50 – 150', '150 – 400', '400+'] },
      { id: 'bill_entry', label: 'Who enters vendor bills?', type: 'radio', other: true, options: ['In-house accounting staff', 'Part-time bookkeeper', 'Outsourced bookkeeping / CPA'] },
      { id: 'matching', label: 'How are bills checked before payment?', type: 'radio', options: ['Matched to PO and receiving slip', 'Matched to PO only', 'PM reviews and approves', 'Paid as received'] },
      { id: 'ap_issues', label: 'Which issues have you run into?', type: 'checkbox', other: true, options: ['Duplicate payments', 'Prices that differ from the quote / PO', 'Missing receiving documents', 'Bills posted to the wrong job', 'Slow approvals causing late fees', 'Vendor credits not applied'] },
      mk({ id: 'pain_ap', label: 'Overall, how painful is AP and bill matching today?' }, PAIN)
    ]
  },
  {
    id: 'field', title: 'Field Labor & Job Health', short: 'Labor & Jobs', intro: 'How labor cost is captured, and how early you find out a job is in trouble.',
    questions: [
      { type: 'heading', label: 'Field labor & daily reports' },
      { id: 'time_capture', label: 'How is field time captured today?', type: 'checkbox', other: true, options: ['Paper timecards', 'Spreadsheets', 'Texts, photos or calls to the office', 'Payroll app / time clock', 'Construction software app'] },
      { id: 'labor_cost', label: 'How is labor cost calculated on job reports?', type: 'radio', options: ['Actual wages plus burden (taxes, insurance, fringes)', 'Wages only', 'A blended / flat rate', 'Not sure'] },
      { id: 'rate_changes', label: 'When wage rates change (union increases, raises), what happens to past job costs?', type: 'radio', options: ['Past periods keep the old rates', 'History gets recalculated at the new rate', 'Handled manually', 'Not sure'] },
      { id: 'daily_reports', label: 'Are daily reports / site logs kept?', type: 'radio', options: ['Yes, consistently and filed', 'Sometimes', 'Verbal updates only', 'No'] },
      mk({ id: 'pain_labor', label: 'Overall, how painful is labor tracking today?' }, PAIN),
      { type: 'heading', label: 'Job health & forecasting' },
      { id: 'when_know', label: 'Typically, when do you learn that a job is losing money?', type: 'radio', options: ['Early (first quarter of the job)', 'Around the midpoint', 'Near the end', 'After closeout'] },
      { id: 'fade_story', label: 'Tell us about a recent job where margin faded. When did you notice, and what would have helped you catch it sooner?', type: 'textarea' },
      { id: 'one_number', label: 'If you received one early-warning number per job each week, what would you want it to be?', type: 'textarea', placeholder: 'e.g. hours used vs. hours earned, committed cost vs. budget' },
      mk({ id: 'pain_forecast', label: 'Overall, how much does limited job visibility hurt you today?' }, PAIN)
    ]
  },
  {
    id: 'changes', title: 'Change Orders & Billing', short: 'Changes & Billing', intro: 'How extra work is tracked and how you bill your customers.',
    questions: [
      { type: 'heading', label: 'Change orders & T&M' },
      { id: 'co_log', label: 'Where are change orders tracked?', type: 'radio', options: ['A central company log', 'Each PM\'s own spreadsheet', 'Emails and folders', 'Not tracked'] },
      { id: 'co_updates', label: 'When a change order is approved, what gets updated?', type: 'checkbox', options: ['Job budget', 'Contract value', 'Schedule of values / billing', 'Forecast', 'Field crew is informed', 'Done inconsistently'] },
      { id: 'co_disputes', label: 'Any recent change-order disputes or write-offs worth discussing?', type: 'textarea' },
      mk({ id: 'pain_changes', label: 'Overall, how painful is change management today?' }, PAIN),
      { type: 'heading', label: 'Billing & retainage' },
      { id: 'billing_types', label: 'Which billing methods do you use?', type: 'checkbox', other: true, options: ['AIA G702 / G703 pay applications', 'Lump-sum progress billing', 'Unit-price billing', 'T&M billing', 'Service / work-order invoices', 'GC portals (Textura, GCPay, Procore Pay)'] },
      { id: 'payapp_tool', label: 'Where are pay applications built?', type: 'radio', other: true, options: ['Accounting system', 'Excel templates', 'GC / owner portal', 'AIA software'] },
      { id: 'retainage', label: 'How is retainage tracked?', type: 'radio', options: ['Per job, automatically', 'In a spreadsheet', 'We know it roughly', 'It\'s a struggle'] },
      mk({ id: 'pain_billing', label: 'Overall, how painful is progress billing today?' }, PAIN)
    ]
  },
  {
    id: 'service', title: 'Service, Equipment & Reporting', short: 'Service & Reports', intro: 'Recurring service work, equipment data after closeout, and what leadership sees.',
    questions: [
      { type: 'heading', label: 'Service & equipment' },
      { id: 'has_service', label: 'How significant is service / maintenance work for you?', type: 'radio', options: ['A significant part of the business', 'Small or occasional', 'Not today, but we want to grow it', 'None (skip the service questions)'] },
      { id: 'dispatch', label: 'How are technicians dispatched?', type: 'radio', other: true, options: ['Service software (ServiceTitan, BuildOps, etc.)', 'Calendar / whiteboard', 'Phone and text'], showIf: notNoService },
      { id: 'wo_invoice', label: 'Time from completed work order to invoice', type: 'radio', options: ['Same day', 'Within a week', '1 – 4 weeks', 'Longer'], showIf: notNoService },
      { id: 'equipment', label: 'What do you record about equipment you install?', type: 'checkbox', options: ['Make / model / serial', 'Warranty dates', 'Startup / commissioning data', 'Service history', 'Not tracked systematically'], showIf: notNoService },
      { id: 'handoff_value', label: 'How valuable would it be if closed-out projects fed installed-equipment and warranty data straight into a service pipeline?', type: 'scale', low: 'Not valuable', high: 'Very valuable', showIf: notNoService },
      { type: 'heading', label: 'Reporting & visibility' },
      { id: 'reports', label: 'Which reports do you rely on today?', type: 'checkbox', other: true, options: ['Job cost detail', 'Budget vs. actual', 'Committed cost', 'WIP / over-under billing', 'Labor hours by job', 'Backlog', 'Cash flow / AR aging', 'Custom spreadsheets', 'Very little'] },
      { id: 'report_who', label: 'Who needs regular visibility into job financials?', type: 'checkbox', options: ['Owners / executives', 'Project managers', 'Foremen', 'Accounting', 'Estimators', 'Bank / bonding / CPA'] },
      { id: 'monday', label: 'What would you want on your desk every Monday morning?', type: 'textarea' }
    ]
  },
  {
    id: 'priorities', title: 'Priorities, Goals & Next Steps', short: 'Priorities', intro: 'What matters most to you, so our follow-up conversation is spent on the right problems.',
    questions: [
      { id: 'headache', label: 'What is your single biggest operational headache today?', type: 'textarea' },
      { id: 'top_areas', label: 'Which areas would you most like to discuss on our follow-up call?', type: 'checkbox', max: 4, help: 'Pick up to four.', options: ['Committed costs & purchase orders', 'Mobile field timecards & daily reports', 'Vendor bill matching (PO / receipt / bill)', 'Change orders & T&M tracking', 'AIA progress billing & retainage', 'Early-warning job forecasting', 'Service work orders & invoicing', 'Integration with our accounting system', 'Reporting for owners & PMs'] },
      { id: 'trigger', label: 'What\'s prompting you to look at this now?', type: 'checkbox', other: true, options: ['Growth is outpacing our processes', 'Margins fading on jobs', 'A key person retiring or leaving', 'Bonding / lender / CPA requirements', 'Payroll or audit problems', 'Customer requirements', 'Just exploring'] },
      { id: 'success', label: 'What would success look like 12 months from now?', type: 'textarea' },
      { id: 'timeline', label: 'When would you like to have improvements in place?', type: 'radio', options: ['As soon as possible (0 – 3 months)', '3 – 6 months', '6 – 12 months', 'No set timeline'] },
      { id: 'concerns', label: 'What concerns you most about changing how you work?', type: 'checkbox', other: true, options: ['Migrating existing data', 'Getting the field to adopt it', 'Disrupting accounting', 'Cost', 'Time to implement', 'Training staff', 'Data security'] },
      { id: 'anything_else', label: 'Anything else we should know before we talk?', type: 'textarea' }
    ]
  }
];



