export const ANALYSIS_ESTIMATED_DURATION_MS = 3000;

export async function analyzeSkinPhoto(imageBlob: Blob | null) {
  await new Promise((resolve) => window.setTimeout(resolve, ANALYSIS_ESTIMATED_DURATION_MS));

  if (!imageBlob) {
    throw new Error('분석할 피부 사진이 없습니다.');
  }

  // 백엔드 연동 시 이 부분을 피부 분석 API 요청으로 교체합니다.
  return { success: true } as const;
}
