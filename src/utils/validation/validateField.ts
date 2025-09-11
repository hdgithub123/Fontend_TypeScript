// validators.ts ✅ Full validation system
// validators.ts ✅ Full validation system
import type { SchemaField, MessageFieldRules } from './dataType';


/**
 * Validate string value against specified format
 * @param value - The value to validate
 * @param format - Format to validate against (email, url, date, etc.)
 * @returns boolean - True if valid, false if invalid
 */
function validateFormat(value: unknown, format?: string): boolean {
  // Return true if no format specified
  if (!format) return true;

  // Check if value is a string
  if (typeof value !== 'string') return false;

  // Format validation patterns
  const formatValidators: Record<string, RegExp> = {
    // Email format (more comprehensive than basic check)
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    // URL format (supports http/https/ftp)
    url: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,

    // ISO date format (YYYY-MM-DD)
    date: /^\d{4}-\d{2}-\d{2}$/,
    // ISO date time format (YYYY-MM-DDTHH:mm:ss)
    datetime: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    //datetime:/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, //-- chua dung duoc

    // JSON format (basic check)
    json: /^[\{\[].*[}\]]$/,

    // UUID format
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

    // Hexadecimal color code
    hexColor: /^#([a-f0-9]{6}|[a-f0-9]{3})$/i,

    // Credit card (basic format check)
    creditCard: /^[0-9]{13,16}$/,

    // Phone number (international format)
    phone: /^\+?[0-9\s\-\(\)]{10,}$/,

    // IP address (v4 or v6)
    ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i,

    // Base64 encoded string
    base64: /^[A-Za-z0-9+/]+={0,2}$/,

    // JWT token format
    jwt: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/
  };

  // Get validator for the specified format
  const validator = formatValidators[format.toLowerCase()];

  // Return false for unknown formats (or could throw error)
  if (!validator) return false;

  // Test the value against the validator
  return validator.test(value.trim());
}



// 🛡️ Helper: XSS detection
function containsXSS(value: string): boolean {
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'style', 'link'];
  const pattern = new RegExp(`<\\s*(${dangerousTags.join('|')})[^>]*>`, 'gi');
  return pattern.test(value);
}

// ✅ Core: Field-level validation

export function validateField(
  value: any,
  schema: SchemaField,
  messages: Partial<MessageFieldRules> = {}
): string[] {
  const errors: string[] = [];
  const type = schema.type;

  // 🔒 Required check
  if (schema.required && (value === undefined || value === null || value === '')) {
    errors.push(messages.required || 'This field is required.');
    return errors;
  }

  // ⛔ Skip further checks if value is null/undefined
  if (value === undefined || value === null) return errors;

  // ✅ Type check
  const typeValid =
    (type === 'array' && Array.isArray(value)) ||
    (type === 'object' && typeof value === 'object' && !Array.isArray(value)) ||
    (type === 'boolean' && (typeof value === 'boolean' || value === 0 || value === 1)) ||
    (type === 'number' && typeof value === 'number') ||
    (type === 'string' && typeof value === 'string');

  if (!typeValid) {
    errors.push(messages.type || `Expected type ${type}.`);
    return errors;
  }

  // 🧠 Boolean validation
  if (type === 'boolean') {
    const boolVal = value === true || value === 'true' || value === 1 || value === '1';
    const falseVal = value === false || value === 'false' || value === 0 || value === '0';

    if (!boolVal && !falseVal) {
      errors.push(messages.type || 'Invalid boolean value.');
    }

    if (schema.enum && !schema.enum.includes(value)) {
      errors.push(messages.enum || `Must be one of: ${schema.enum.join(', ')}.`);
    }
  }

  // 🔢 Number validation
  if (type === 'number') {
    if (isNaN(value)) {
      errors.push(messages.type || 'Invalid number.');
    }

    if (schema.min !== undefined && value < schema.min) {
      errors.push(messages.min || `Minimum value is ${schema.min}.`);
    }

    if (schema.max !== undefined && value > schema.max) {
      errors.push(messages.max || `Maximum value is ${schema.max}.`);
    }

    if (schema.enum && !schema.enum.includes(value)) {
      errors.push(messages.enum || `Must be one of: ${schema.enum.join(', ')}.`);
    }
  }

  // 🔤 String validation
  if (type === 'string') {
    const strVal = value.trim?.() ?? value;

    if (schema.noCheckXSS !== true && containsXSS(strVal)) {
      errors.push(messages.noCheckXSS || 'Possible XSS content detected.');
    }

    if (schema.format && !validateFormat(strVal, schema.format)) {
      errors.push(messages.format || `Invalid ${schema.format} format.`);
    }

    if (schema.minLength !== undefined && strVal.length < schema.minLength) {
      errors.push(messages.minLength || `Minimum length is ${schema.minLength}.`);
    }

    if (schema.maxLength !== undefined && strVal.length > schema.maxLength) {
      errors.push(messages.maxLength || `Maximum length is ${schema.maxLength}.`);
    }

    if (schema.enum && !schema.enum.includes(strVal)) {
      errors.push(messages.enum || `Must be one of: ${schema.enum.join(', ')}.`);
    }

    if (schema.regex && !new RegExp(schema.regex).test(strVal)) {
      errors.push(messages.regex || 'Pattern mismatch.');
    }

    if (schema.hasUpperCase && !/[A-Z]/.test(strVal)) {
      errors.push(messages.hasUpperCase || 'At least one uppercase letter required.');
    }

    if (schema.hasLowerCase && !/[a-z]/.test(strVal)) {
      errors.push(messages.hasLowerCase || 'At least one lowercase letter required.');
    }

    if (schema.hasNumber && !/[0-9]/.test(strVal)) {
      errors.push(messages.hasNumber || 'At least one digit required.');
    }

    if (schema.hasSpecialChar && !/[^\w\s]/.test(strVal)) {
      errors.push(messages.hasSpecialChar || 'At least one special character required.');
    }
  }

  // 🧩 Custom validation
  if (schema.custom && typeof schema.custom === 'function') {
    const customValid = schema.custom(value);
    if (!customValid) {
      errors.push(messages.custom || 'Custom validation failed.');
    }
  }

  return errors;
}


