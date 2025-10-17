import { getObservabilities } from "@/services/observabilities/get-observabilities";
import type { FilterPeriods } from "@/types/enums/filter-periods.enum";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useObservabilityTable(projectId: string, filterPeriod: FilterPeriods, page: number, limit: number) {
  return useQuery({
    queryKey: ["get-observabilities", projectId, filterPeriod, page, limit],
    queryFn: () => getObservabilities({ projectId, filterPeriod, page, limit }),
    enabled: Boolean(projectId),
    placeholderData: keepPreviousData,
  });
}
