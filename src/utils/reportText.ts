export function formatReportText(text: string) {
  return text.replace(/,\s*/g, ',\n').replace(/[^\S\n]+(?=주요 위험 요인)/g, '\n');
}
