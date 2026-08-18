import { apiClient } from './client';

export type OnboardingSkinType = '건성' | '지성' | '복합성' | '민감성';

export interface OnboardingStatusResponse {
  user: {
    id: number;
    nickname: string;
    provider: string;
    createdAt: string;
    onboarded: boolean;
  };
}

interface UpdateProfileRequest {
  height?: number;
  weight?: number;
  skin_type?: OnboardingSkinType;
}

interface UpdateProfileResponse {
  is_success: boolean;
  message: string;
  data: {
    water_goal_ml: number;
  };
}

export function getOnboardingStatus() {
  return apiClient.get<OnboardingStatusResponse>('/api/v1/onboarding/status');
}

export function saveRequiredAgreements(termsAgreed: boolean, privacyAgreed: boolean) {
  return apiClient.post('/api/v1/onboarding/agreements', {
    terms_agreed: termsAgreed,
    privacy_agreed: privacyAgreed,
  });
}

export function updateMarketingAgreement(marketingAgreed: boolean) {
  return apiClient.patch('/api/v1/users/me/agreements', {
    marketing_agreed: marketingAgreed,
  });
}

export function updateOnboardingProfile(profile: UpdateProfileRequest, signal?: AbortSignal) {
  return apiClient.patch<UpdateProfileResponse>('/api/v1/users/profile', profile, { signal });
}

export function savePhotoGuideAgreement(photoGuideAgreed: boolean) {
  return apiClient.post('/api/v1/onboarding/photo-guide-agreement', {
    photo_guide_agreed: photoGuideAgreed,
  });
}

export function saveSkinCarePauseReason(skinCarePauseReason: string) {
  return apiClient.post('/api/v1/onboarding/pause-reason', {
    skin_care_pause_reason: skinCarePauseReason,
  });
}

export function completeOnboarding() {
  return apiClient.post<OnboardingStatusResponse>('/api/v1/onboarding/complete');
}
