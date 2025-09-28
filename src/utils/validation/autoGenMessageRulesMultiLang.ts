import {messagesVi,messagesEn} from './messagesDefault'
import type { RuleSchema, TranslateMessageMap, CustomMessageRules, MessageFieldRules } from './dataType';


function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function autoGenMessageRulesMultiLang(
  schema: RuleSchema,
  translateMessages: Partial<TranslateMessageMap> = messagesEn// ← tên mới nè
): CustomMessageRules {
  const messages: CustomMessageRules = {};

  for (const [field, props] of Object.entries(schema)) {
    const label = capitalize(field);
    const ruleMessages: Partial<MessageFieldRules> = {};

    if (props.required)
      ruleMessages.required = translateMessages.required?.replace('{label}', label);

    if (props.format)
      ruleMessages.format = translateMessages.format
        ?.replace('{label}', label)
        .replace('{format}', props.format);

    if (props.type)
      ruleMessages.type = translateMessages.type
        ?.replace('{label}', label)
        .replace('{type}', props.type);

    if (props.min !== undefined)
      ruleMessages.min = translateMessages.min
        ?.replace('{label}', label)
        .replace('{min}', String(props.min));

    if (props.max !== undefined)
      ruleMessages.max = translateMessages.max
        ?.replace('{label}', label)
        .replace('{max}', String(props.max));
    if (props.minLength !== undefined)
      ruleMessages.minLength = translateMessages.minLength
        ?.replace('{label}', label)
        .replace('{minLength}', String(props.minLength));
    if (props.maxLength !== undefined)
      ruleMessages.maxLength = translateMessages.maxLength
        ?.replace('{label}', label)
        .replace('{maxLength}', String(props.maxLength));
    if (props.enum)
      ruleMessages.enum = translateMessages.enum
        ?.replace('{label}', label)
        .replace('{values}', props.enum.join(', '));

    if (props.regex)
      ruleMessages.regex = translateMessages.regex?.replace('{label}', label);

    if (props.hasUpperCase)
      ruleMessages.hasUpperCase = translateMessages.hasUpperCase?.replace('{label}', label);

    if (props.hasLowerCase)
      ruleMessages.hasLowerCase = translateMessages.hasLowerCase?.replace('{label}', label);

    if (props.hasNumber)
      ruleMessages.hasNumber = translateMessages.hasNumber?.replace('{label}', label);

    if (props.hasSpecialChar)
      ruleMessages.hasSpecialChar = translateMessages.hasSpecialChar?.replace('{label}', label);

    if (props.noCheckXSS !== true)
      ruleMessages.noCheckXSS = translateMessages.noCheckXSS?.replace('{label}', label);

    if (props.custom)
      ruleMessages.custom = translateMessages.custom?.replace('{label}', label);

    messages[field] = ruleMessages;
  }

  return messages;
}