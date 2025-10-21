import type { UpTimeStatus } from "@/types/enums/up-time-status.enum";

export interface GetMonitoringCountersResponse {
  systemStatus: UpTimeStatus;
  totalHeartbeats: number;
  currentUptime: string;
  sentAlertsCount: number;
  uptimePercentage: number;
  downtimeInTime: string;
  totalTimeMonitored: string;
  monitoringRules: {
    checkIntervalSeconds: number;
    timeoutThresholdSeconds: number;
    alertsConfigured: number;
  } | null;
}
