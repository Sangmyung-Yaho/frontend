import {
  requestSkinAnalysis,
  uploadSkinImage,
  type SkinImageResponse,
  type SkinAnalysisResponse,
} from '../api/skinAnalysis';
import { prepareImageForUpload } from '../utils/imageFile';

export const ANALYSIS_ESTIMATED_DURATION_MS = 15_000;

const pendingUploadRequests = new WeakMap<Blob, Promise<SkinImageResponse>>();
const pendingAnalysisRequests = new WeakMap<Blob, Promise<SkinAnalysisResponse>>();
const pendingAnalysisRequestsByImageId = new Map<number, Promise<SkinAnalysisResponse>>();

export function uploadSkinPhoto(imageBlob: Blob | null) {
  if (!imageBlob) {
    return Promise.reject(new Error('분석할 사진이 없습니다.'));
  }

  const pendingRequest = pendingUploadRequests.get(imageBlob);
  if (pendingRequest) return pendingRequest;

  const request = prepareImageForUpload(imageBlob)
    .then((preparedImage) => uploadSkinImage(preparedImage))
    .catch((error: unknown) => {
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
    .then(({ skin_image_id: skinImageId }) => analyzeUploadedSkinImage(skinImageId))
    .catch((error: unknown) => {
      pendingAnalysisRequests.delete(imageBlob);
      throw error;
    });

  pendingAnalysisRequests.set(imageBlob, request);
  return request;
}

export function analyzeUploadedSkinImage(skinImageId: number) {
  const pendingRequest = pendingAnalysisRequestsByImageId.get(skinImageId);
  if (pendingRequest) return pendingRequest;

  const request = requestSkinAnalysis(skinImageId).catch((error: unknown) => {
    pendingAnalysisRequestsByImageId.delete(skinImageId);
    throw error;
  });

  pendingAnalysisRequestsByImageId.set(skinImageId, request);
  return request;
}
