import { apiClient } from './client';

export type SkinLevel = 'SAFE' | 'CAUTION' | 'DANGER';
export type CauseFactor = 'SLEEP' | 'STRESS' | 'WATER_INTAKE';
export type ChangeStatus = 'IMPROVED' | 'WORSENED' | 'UNCHANGED';
export type SignalDirection = 'INCREASED' | 'STABLE' | 'DECREASED';

interface ApiResponse<T> {
  is_success: boolean;
  message: string;
  data: T;
}

export interface ReportListItem {
  report_id: number;
  report_date: string;
  skin_level: SkinLevel;
  summary: string;
}

export interface ReportPrimaryCause {
  factor: CauseFactor;
  name: string;
  current_value: number;
  unit: string;
  description: string;
  baseline_value: number;
  difference: number;
  baseline_type: 'PERSONAL_AVERAGE' | 'RECOMMENDED';
}

export interface ReportSkinChangeItem {
  previous_score: number | null;
  current_score: number;
  change: number | null;
  status: ChangeStatus | null;
}

export interface ReportDetail {
  report_id: number;
  report_date: string;
  skin_change: {
    redness: ReportSkinChangeItem;
    trouble: ReportSkinChangeItem;
  };
  has_previous_analysis: boolean;
  primary_causes: ReportPrimaryCause[];
  summary: string;
}

export interface ReportWarning {
  level: 'HIGH';
  factors: CauseFactor[];
  factor_values: Array<{
    factor: CauseFactor;
    current_value: number;
    unit: string;
  }>;
  title: string;
  headline: string;
  message: string;
}

export interface ReportSkinSignalItem {
  direction: SignalDirection;
  message: string;
}

export interface ReportInteraction {
  factors: CauseFactor[];
  message: string;
}

function unwrapApiResponse<T>(response: ApiResponse<T> | T): T {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  return response as T;
}

export async function getReports() {
  const { data } =
    await apiClient.get<ApiResponse<{ reports: ReportListItem[] }>>('/api/v1/reports');
  return unwrapApiResponse(data).reports;
}

export async function getReport(reportId: number) {
  const { data } = await apiClient.get<ApiResponse<ReportDetail> | ReportDetail>(
    `/api/v1/reports/${reportId}`,
  );
  return unwrapApiResponse(data);
}

export async function getLatestReportWarnings() {
  const { data } = await apiClient.get<ApiResponse<{ warnings: ReportWarning[] }>>(
    '/api/v1/reports/causes/latest/warnings',
  );
  return unwrapApiResponse(data).warnings;
}

export async function getLatestReportSkinSignal() {
  const { data } = await apiClient.get<
    ApiResponse<{ redness: ReportSkinSignalItem; trouble: ReportSkinSignalItem }>
  >('/api/v1/reports/causes/latest/skin-signal');
  return unwrapApiResponse(data);
}

export async function getLatestReportInteractions() {
  const { data } = await apiClient.get<ApiResponse<{ interactions: ReportInteraction[] }>>(
    '/api/v1/reports/causes/latest/interactions',
  );
  return unwrapApiResponse(data).interactions;
}
