export function detectInterviewEnd(text: string): {
  isComplete: boolean;
  externalDoc: string | null;
  internalDoc: string | null;
  cleanText: string;
} {
  const isComplete = text.includes('[INTERVIEW_COMPLETE]');

  const externalMatch = text.match(/\[EXTERNAL_DOC_START\]([\s\S]*?)\[EXTERNAL_DOC_END\]/);
  const internalMatch = text.match(/\[INTERNAL_DOC_START\]([\s\S]*?)\[INTERNAL_DOC_END\]/);

  const externalDoc = externalMatch ? externalMatch[1].trim() : null;
  const internalDoc = internalMatch ? internalMatch[1].trim() : null;

  // Always strip all signal blocks and tags from visible text
  const base = isComplete ? text.split('[INTERVIEW_COMPLETE]')[0] : text;
  const cleanText = base
    .replace(/\[EXTERNAL_DOC_START\][\s\S]*?\[EXTERNAL_DOC_END\]/g, '')
    .replace(/\[INTERNAL_DOC_START\][\s\S]*?\[INTERNAL_DOC_END\]/g, '')
    .replace(/\[CHECKLIST:\d+\]/g, '')
    .trim();

  return { isComplete, externalDoc, internalDoc, cleanText };
}

export function extractChecklistUpdates(text: string): number[] {
  const matches = [...text.matchAll(/\[CHECKLIST:(\d+)\]/g)];
  return matches.map(m => parseInt(m[1]));
}

export function stripForDisplay(text: string): string {
  // Strip complete blocks first
  let result = text
    .replace(/\[EXTERNAL_DOC_START\][\s\S]*?\[EXTERNAL_DOC_END\]/g, '')
    .replace(/\[INTERNAL_DOC_START\][\s\S]*?\[INTERNAL_DOC_END\]/g, '')
    .replace(/\[CHECKLIST:\d+\]/g, '');

  // Truncate at any incomplete signal block still streaming in
  result = result
    .split('[INTERVIEW_COMPLETE]')[0]
    .split('[EXTERNAL_DOC_START]')[0]
    .split('[INTERNAL_DOC_START]')[0];

  return result.trim();
}