import type { UpdateMonitoringRulesPartialRequest } from "../monitoring-rules/update-monitoring-rules.partial.request";

export interface UpdateProjectRequest {
  name: string;
  githubUrl?: string | null;
  systemUrl?: string | null;
  monitoringRules?: UpdateMonitoringRulesPartialRequest | null;
}
