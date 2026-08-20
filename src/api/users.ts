import { apiClient } from './client';

interface ApiResponse<T> {
  is_success: boolean;
  message: string;
  data: T;
}

export type UserSkinType = '건성' | '지성' | '복합성' | '민감성';

export interface UserProfileData {
  nickname: string;
  height: number | null;
  weight: number | null;
  skin_type: UserSkinType | null;
  marketing_agreed: boolean;
  water_goal_ml: number | null;
}

export interface UpdateUserProfileRequest {
  nickname?: string;
  height?: number;
  weight?: number;
  skin_type?: UserSkinType;
}

interface UpdateUserProfileData {
  water_goal_ml: number;
}

export function getUserProfile() {
  return apiClient.get<ApiResponse<UserProfileData>>('/api/v1/users/profile');
}

export function updateUserProfile(profile: UpdateUserProfileRequest, signal?: AbortSignal) {
  return apiClient.patch<ApiResponse<UpdateUserProfileData>>('/api/v1/users/profile', profile, {
    signal,
  });
}

export function updateMarketingAgreement(marketingAgreed: boolean) {
  return apiClient.patch('/api/v1/users/me/agreements', {
    marketing_agreed: marketingAgreed,
  });
}

export function deleteUserAccount(reason: string) {
  return apiClient.delete('/api/v1/users/me', {
    data: { withdrawal_reason: reason },
  });
}
