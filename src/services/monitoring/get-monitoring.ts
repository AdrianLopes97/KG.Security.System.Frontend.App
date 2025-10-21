import type { GetMonitoringCountersResponse } from "@/interfaces/monitoring/get-monitoring-counters.response";
import { api } from "@/lib/api";

export interface GetMonitoringParams {
  projectId: string;
}

export async function getMonitoring({ projectId }: GetMonitoringParams): Promise<GetMonitoringCountersResponse> {
  const { data } = await api.get<GetMonitoringCountersResponse>("/monitoring", {
    params: { projectId },
  });
  return data;
}
