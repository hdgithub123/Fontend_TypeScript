/**
 * `TranslateMessageMap` defines a mapping of default error message templates
 * used during field validation in `validateDataArray`.
 *
 * 🧩 Each template string can contain placeholders wrapped in curly braces `{}`.
 * These placeholders will be replaced with actual values from the corresponding
 * field definitions at runtime.
 *
 * 🔄 Common placeholders:
 * - `{label}`: The display name of the field (`fieldDefinitions.label`)
 * - `{type}`: Expected data type (e.g. "string", "number")
 * - `{format}`: Specific format requirement (e.g. "email", "dateTime")
 * - `{min}` / `{max}`: Minimum or maximum value/length
 * - `{values}`: Allowed values (typically joined into a readable string)
 *
 * 🎨 Example usage:
 * ```ts
 * type: "{label} must be of type {type}.",
 * format: "{label} must match the {format} format.",
 * min: "{label} must be at least {min}.",
 * max: "{label} must not exceed {max}.",
 * enum: "{label} must be one of the following: {values}.",
 * ```
 *
 * 🧠 Tip:
 * You can integrate with i18n frameworks to localize these messages across languages.
 */
export type TranslateMessageMap = {
  required: string;        // e.g. "{label} is required."
  format: string;          // e.g. "{label} must match the {format} format."
  type: string;            // e.g. "{label} must be of type {type}."
  min: string;             // e.g. "{label} must be at least {min}."
  max: string;             // e.g. "{label} must not exceed {max}."
  enum: string;            // e.g. "{label} must be one of the following: {values}."
  regex: string;           // e.g. "{label} does not match the required pattern."
  hasUpperCase: string;    // e.g. "{label} must include at least one uppercase letter."
  hasLowerCase: string;    // e.g. "{label} must include at least one lowercase letter."
  hasNumber: string;       // e.g. "{label} must include at least one number."
  hasSpecialChar: string;  // e.g. "{label} must include at least one special character."
  noCheckXSS: string;      // e.g. "{label} contains unsafe content."
  custom: string;          // e.g. "{label} is invalid according to custom rules."
};



export type RuleSchema = Record<string, SchemaField>;

export interface SchemaField {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  format?: 'email' | 'url' | 'date' |'datetime' | 'json' | 'uuid'| 'hexColor'|'creditCard'|'phone'|'ip'|'base64'|'jwt';
  min?: number;
  max?: number;
  enum?: string[];
  regex?: string;
  hasUpperCase?: boolean;
  hasLowerCase?: boolean;
  hasNumber?: boolean;
  hasSpecialChar?: boolean;
  noCheckXSS?: boolean;
  custom?: (value: any) => boolean;
}


export type CustomMessageRules = Record<string, Partial<MessageFieldRules>>;

export interface MessageFieldRules {
  required: string;
  type: string;
  format: string;
  min: string;
  max: string;
  enum: string;
  regex: string;
  hasUpperCase: string;
  hasLowerCase: string;
  hasNumber: string;
  hasSpecialChar: string;
  noCheckXSS: string;
  custom: string;
}

export interface ValidationResult<T> {
  index: number;
  valid: boolean;
  errors: Record<string, string>;
}