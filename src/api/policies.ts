import { apiClient } from './client';

export type PolicyType = 'TERMS' | 'PRIVACY';

export interface Policy {
  type: PolicyType;
  title: string;
  version: string;
  content: string;
}

interface PolicyListResponse {
  is_success: boolean;
  message: string;
  data: Policy[];
}

export function getPolicies(type: PolicyType, signal?: AbortSignal) {
  return apiClient.get<PolicyListResponse>('/api/v1/policies', {
    params: { type },
    signal,
  });
}
