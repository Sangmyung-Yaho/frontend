export function formatReportText(text: string) {
  return text.replace(/([.!?])\s+/g, '$1\n').replace(/피부\s+변화/g, '피부\u00a0변화');
}
