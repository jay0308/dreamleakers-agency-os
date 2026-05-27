// ============================================
// SHARED AGENT UTILITIES
// ============================================

/**
 * Extracts clean JSON from LLM responses that may be
 * wrapped in markdown code blocks.
 * Handles: ```json...```, ```...```, or raw JSON
 */
export const extractJSON = (text: string): string => {
  // Case 1 — wrapped in ```json ... ```
  const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch) return jsonBlockMatch[1].trim();

  // Case 2 — wrapped in ``` ... ```
  const codeBlockMatch = text.match(/```\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  // Case 3 — already clean JSON
  return text.trim();
};

/**
 * Safely parses JSON with a fallback error message
 */
export const safeParseJSON = <T>(text: string): T => {
  const cleaned = extractJSON(text);
  return JSON.parse(cleaned) as T;
};