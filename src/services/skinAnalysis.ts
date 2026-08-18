import {
  requestSkinAnalysis,
  uploadSkinImage,
  type SkinImageResponse,
  type SkinAnalysisResponse,
} from '../api/skinAnalysis';

export const ANALYSIS_ESTIMATED_DURATION_MS = 15_000;

const pendingUploadRequests = new WeakMap<Blob, Promise<SkinImageResponse>>();
const pendingAnalysisRequests = new WeakMap<Blob, Promise<SkinAnalysisResponse>>();

export function uploadSkinPhoto(imageBlob: Blob | null) {
  if (!imageBlob) {
    return Promise.reject(new Error('분석할 사진이 없습니다.'));
  }

  const pendingRequest = pendingUploadRequests.get(imageBlob);
  if (pendingRequest) return pendingRequest;

  const request = uploadSkinImage(imageBlob).catch((error: unknown) => {
    pendingUploadRequests.delete(imageBlob);
    throw error;
  });

  pendingUploadRequests.set(imageBlob, request);
  return request;
}

export function analyzeSkinPhoto(imageBlob: Blob | null) {
  if (!imageBlob) {
    return Promise.reject(new Error('분석할 피부 사진이 없습니다.'));
  }

  const pendingRequest = pendingAnalysisRequests.get(imageBlob);
  if (pendingRequest) return pendingRequest;

  const request = uploadSkinPhoto(imageBlob)
    .then(({ skin_image_id: skinImageId }) => requestSkinAnalysis(skinImageId))
    .catch((error: unknown) => {
      pendingAnalysisRequests.delete(imageBlob);
      throw error;
    });

  pendingAnalysisRequests.set(imageBlob, request);
  return request;
}
