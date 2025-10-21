import { getMonitoring } from "@/services/monitoring/get-monitoring";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useMonitoringCounters(projectId: string) {
  return useQuery({
    queryKey: ["get-monitoring", projectId],
    queryFn: () => getMonitoring({ projectId }),
    enabled: Boolean(projectId),
    placeholderData: keepPreviousData,
  });
}
