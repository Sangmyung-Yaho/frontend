import {
  requestSkinAnalysis,
  uploadSkinImage,
  type SkinAnalysisResponse,
} from '../api/skinAnalysis';

export const ANALYSIS_ESTIMATED_DURATION_MS = 15_000;

const pendingAnalysisRequests = new WeakMap<Blob, Promise<SkinAnalysisResponse>>();

export function analyzeSkinPhoto(imageBlob: Blob | null) {
  if (!imageBlob) {
    return Promise.reject(new Error('분석할 피부 사진이 없습니다.'));
  }

  const pendingRequest = pendingAnalysisRequests.get(imageBlob);
  if (pendingRequest) return pendingRequest;

  const request = uploadSkinImage(imageBlob)
    .then(({ skin_image_id: skinImageId }) => requestSkinAnalysis(skinImageId))
    .catch((error: unknown) => {
      pendingAnalysisRequests.delete(imageBlob);
      throw error;
    });

  pendingAnalysisRequests.set(imageBlob, request);
  return request;
}
