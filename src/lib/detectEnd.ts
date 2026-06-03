export function detectInterviewEnd(text: string): {
  isComplete: boolean;
  internalDoc: string | null;
  cleanText: string;
} {
  const isComplete = text.includes('[INTERVIEW_COMPLETE]');
  if (!isComplete) return { isComplete: false, internalDoc: null, cleanText: text };

  const docMatch = text.match(/\[INTERNAL_DOC_START\]([\s\S]*?)\[INTERNAL_DOC_END\]/);
  const rawDoc = docMatch ? docMatch[1].trim() : null;

  let internalDoc: string | null = null;
  if (rawDoc) {
    try {
      const parsed = JSON.parse(rawDoc);
      internalDoc = typeof parsed.internalDocument === 'string'
        ? parsed.internalDocument
        : JSON.stringify(parsed, null, 2);
    } catch {
      internalDoc = rawDoc;
    }
  }

  const cleanText = text
    .replace('[INTERVIEW_COMPLETE]', '')
    .replace(/\[INTERNAL_DOC_START\][\s\S]*?\[INTERNAL_DOC_END\]/, '')
    .replace(/\[CHECKLIST:\d+\]/g, '')
    .trim();

  return { isComplete: true, internalDoc, cleanText };
}

export function extractChecklistUpdates(text: string): number[] {
  const matches = [...text.matchAll(/\[CHECKLIST:(\d+)\]/g)];
  return matches.map((m) => parseInt(m[1], 10));
}

export function stripInternalContent(text: string): string {
  return text
    .replace('[INTERVIEW_COMPLETE]', '')
    .replace(/\[INTERNAL_DOC_START\][\s\S]*?\[INTERNAL_DOC_END\]/, '')
    .replace(/\[CHECKLIST:\d+\]/g, '')
    .trim();
}

export function stripForDisplay(text: string): string {
  let cleaned = text.replace(/\[CHECKLIST:\d+\]/g, '');
  cleaned = cleaned.replace(/\[INTERVIEW_COMPLETE\]/g, '');
  // Hide internal doc block even if it's currently streaming (incomplete)
  cleaned = cleaned.replace(/\[INTERNAL_DOC_START\][\s\S]*?(?:\[INTERNAL_DOC_END\]|$)/, '');
  // Hide internal indicators
  cleaned = cleaned.replace(/\(?BDD scenarios start being collected\)?/gi, '');
  cleaned = cleaned.replace(/\(?More roles identified\)?/gi, '');
  cleaned = cleaned.replace(/\(?All checklist items now covered, including decision goals and BDD scenarios\)?/gi, '');
  return cleaned;
}
