import { apiClient } from './client';

export type SkinAnalysisLevel = 'SAFE' | 'CAUTION' | 'DANGER';

export interface SkinImageResponse {
  skin_image_id: number;
  image_url: string;
  created_at: string;
}

export interface SkinAnalysisResponse {
  skin_analysis_id: number;
  skin_image_id: number;
  redness: SkinAnalysisLevel;
  trouble: SkinAnalysisLevel;
  skin_level: SkinAnalysisLevel;
  analyzed_at: string;
}

interface ApiResponse<T> {
  is_success: boolean;
  message: string;
  data: T;
}

export async function uploadSkinImage(imageBlob: Blob) {
  const formData = new FormData();
  const fileName = imageBlob instanceof File ? imageBlob.name : 'skin-photo.jpg';
  formData.append('image', imageBlob, fileName);

  const { data } = await apiClient.post<SkinImageResponse>('/api/v1/skin-images', formData, {
    headers: { 'Content-Type': undefined },
    timeout: 30_000,
  });

  return data;
}

export async function requestSkinAnalysis(skinImageId: number) {
  const { data } = await apiClient.post<ApiResponse<SkinAnalysisResponse>>(
    '/api/v1/skin-analyses',
    { skin_image_id: skinImageId },
    { timeout: 90_000 },
  );

  return data.data;
}
