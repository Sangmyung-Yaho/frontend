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

export interface SkinAnalysisDetailResponse extends SkinAnalysisResponse {
  is_baseline: boolean;
  previous_skin_analysis_id: number | null;
  redness_change_status: 'IMPROVED' | 'WORSENED' | 'UNCHANGED' | null;
  trouble_change_status: 'IMPROVED' | 'WORSENED' | 'UNCHANGED' | null;
}

export interface SkinComparisonResponse {
  skin_comparison_id: number | null;
  current_skin_analysis_id: number;
  previous_skin_analysis_id: number | null;
  redness_change: 'INCREASED' | 'STABLE' | 'DECREASED' | null;
  trouble_change: 'INCREASED' | 'STABLE' | 'DECREASED' | null;
  compared_at: string | null;
}

export type RecommendationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface RecommendedIngredient {
  name: string;
  reason: string;
}

export interface RecommendedProduct {
  brand: string;
  name: string;
  matchedIngredient: string;
  reason: string;
  productUrl: string;
}

export interface IngredientRecommendationResponse {
  status: RecommendationStatus;
  ingredients: RecommendedIngredient[];
}

export interface ProductRecommendationResponse {
  status: RecommendationStatus;
  products: RecommendedProduct[];
}

export interface SkinAnalysisHistoryItem {
  date: string;
  redness_level: SkinAnalysisLevel;
  trouble_level: SkinAnalysisLevel;
}

export interface SkinAnalysisLevelPoint {
  redness_level: SkinAnalysisLevel;
  trouble_level: SkinAnalysisLevel;
}

export interface SkinAnalysisHistoryResponse {
  period_days: number;
  latest: SkinAnalysisLevelPoint | null;
  average: SkinAnalysisLevelPoint | null;
  history: SkinAnalysisHistoryItem[];
  baseline: SkinAnalysisLevelPoint | null;
}

interface ApiResponse<T> {
  is_success: boolean;
  message: string;
  data: T;
}

function unwrapApiResponse<T>(response: ApiResponse<T> | T): T {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
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

export async function getSkinAnalysisHistory(period = 28) {
  const { data } = await apiClient.get<ApiResponse<SkinAnalysisHistoryResponse>>(
    '/api/v1/skin-analyses/history',
    { params: { period } },
  );
  return data.data;
}

export async function getSkinAnalysisDetail(skinAnalysisId: number) {
  const { data } = await apiClient.get<
    ApiResponse<SkinAnalysisDetailResponse> | SkinAnalysisDetailResponse
  >(`/api/v1/skin-analyses/${skinAnalysisId}`);
  return unwrapApiResponse(data);
}

export async function getRecommendedIngredients(skinAnalysisId: number) {
  const { data } = await apiClient.get<
    ApiResponse<IngredientRecommendationResponse> | IngredientRecommendationResponse
  >(`/api/v1/skin-analyses/${skinAnalysisId}/ingredients`);
  return unwrapApiResponse(data);
}

export async function getRecommendedProducts(skinAnalysisId: number) {
  const { data } = await apiClient.get<
    ApiResponse<ProductRecommendationResponse> | ProductRecommendationResponse
  >(`/api/v1/skin-analyses/${skinAnalysisId}/products`);
  return unwrapApiResponse(data);
}

export async function compareSkinAnalyses(
  currentSkinAnalysisId: number,
  previousSkinAnalysisId: number | null,
) {
  const { data } = await apiClient.post<
    ApiResponse<SkinComparisonResponse> | SkinComparisonResponse
  >(
    '/api/v1/skin-comparisons',
    {
      current_skin_analysis_id: currentSkinAnalysisId,
      previous_skin_analysis_id: previousSkinAnalysisId,
    },
    { timeout: 90_000 },
  );
  return unwrapApiResponse(data);
}
