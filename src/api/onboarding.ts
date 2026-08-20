import { apiClient } from './client';
import type { UserSkinType } from './users';

export type OnboardingSkinType = UserSkinType;

export interface OnboardingStatusResponse {
  user: {
    id: number;
    nickname: string;
    provider: string;
    createdAt: string;
    onboarded: boolean;
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
