// 🔁 Array-level validation
import {validateDataArray} from './validateDataArray'
import type { RuleSchema, TranslateMessageMap, ValidationResult } from './dataType';


export function validateTablesDataArray<T extends Record<string, any>>(
  tables: Record<string, T[]>,
  schemasPerTable: Record<string, RuleSchema>,
  translateMessages: Partial<TranslateMessageMap> // 🆕 đầu vào: thông điệp ngôn ngữ
): {
  status: boolean;
  results: Record<string, ValidationResult<T>[]>;
} {
  const results: Record<string, ValidationResult<T>[]> = {};
  let allValid = true;

  for (const tableName in tables) {
    const data = tables[tableName];
    const schema = schemasPerTable[tableName];
    const tableResults = validateDataArray(data, schema, translateMessages);
    results[tableName] = tableResults.results;

    if (!tableResults.status) {
      allValid = false;
    }
  }

  return { status: allValid, results };
}
