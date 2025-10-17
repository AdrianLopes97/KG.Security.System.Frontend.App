import type { GetObservabilitiesMainTableResponse } from "@/interfaces/observabilities/get-observabilities-main-table.response";
import { api } from "@/lib/api";
import type { FilterPeriods } from "@/types/enums/filter-periods.enum";

export interface GetObservabilitiesParams {
  filterPeriod: FilterPeriods;
  projectId: string;
  page: number;
  limit: number;
}

export async function getObservabilities({
  projectId,
  filterPeriod,
  page,
  limit,
}: GetObservabilitiesParams): Promise<GetObservabilitiesMainTableResponse> {
  const { data } = await api.get<GetObservabilitiesMainTableResponse>("/observabilities", {
    params: { projectId, filterPeriod, page, limit },
  });
  return data;
}
