export type FieldType = "text" | "textarea" | "date" | "number" | "email" | "radio" | "checkbox" | "select";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  type: FieldType;
  options?: FieldOption[];
  placeholder?: string;
}

export interface FormQuestion {
  title: string;
  fields: FormField[];
}

export interface FormSection {
  title: string;
  questions: FormQuestion[];
}

export type FormKey = "owner_management" | "office_accounting" | "field_technician";

export interface FormSchema {
  key: FormKey;
  title: string;
  subtitle: string;
  sections: FormSection[];
}

export type FormValues = Record<string, string | number | string[] | null>;