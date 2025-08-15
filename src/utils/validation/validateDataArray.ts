// 🔁 Array-level validation
import { validateField } from './validateField'
import { autoGenMessageRulesMultiLang } from './autoGenMessageRulesMultiLang';
import type { RuleSchema, TranslateMessageMap, CustomMessageRules, ValidationResult, } from './dataType';


export function validateDataArray<T extends Record<string, any>>(
  data: T[],
  schema: RuleSchema,
  translateMessages?: Partial<TranslateMessageMap>,// ← tên mới nè
): {
  status: boolean;
  results: ValidationResult<T>[];
} {
  const customMessages: CustomMessageRules = autoGenMessageRulesMultiLang(schema, translateMessages)
  // dùng try catch phòng trường hợp data không đúng kiểu
  try {
    const results = data.map((item, index): ValidationResult<T> => {
      const errors: Record<string, string> = {};
      let valid = true;

      for (const key in schema) {
        const fieldSchema = schema[key];
        const messages = customMessages[key] || {};
        const value = item[key as keyof T];

        const isRequired = fieldSchema.required === true;
        const hasValue = !(value === undefined || value === null || value === '');

        if (isRequired || hasValue) {
          const fieldErrors = validateField(value, fieldSchema, messages);
          if (fieldErrors.length > 0) {
            valid = false;
            errors[key] = formatErrorMessage(fieldErrors.join(', '));
          }
        }
      }

      return {
        index,
        valid,
        errors,
      };
    });

    const status = results.every(r => r.valid);
    return { status, results };
  } catch (error) {
    // Nếu có lỗi (ví dụ data không phải mảng), trả về kết quả không hợp lệ
    return { status: false, results: [] };
  }
}


function formatErrorMessage(message: string): string {
  if (!message) return '';
  const capitalized = message.charAt(0).toUpperCase() + message.slice(1);
  return capitalized.endsWith('.') ? capitalized : capitalized + '.';
}