export interface UpdateMonitoringRulesPartialRequest {
  id: string;
  checkIntervalSeconds: number;
  timeoutThresholdSeconds: number;
  isActive: boolean;
  slackWebhookUrl?: string | null;
}
