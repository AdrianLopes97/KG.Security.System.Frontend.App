import type { CreateMonitoringRulesPartialRequest } from "../monitoring-rules/create-monitoring-rules.partial.request";

export interface CreateProjectRequest {
  name: string;
  githubUrl?: string | null;
  systemUrl?: string | null;
  monitoringRules?: CreateMonitoringRulesPartialRequest | null;
}
