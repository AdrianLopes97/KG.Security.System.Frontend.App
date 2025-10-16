import type { GetVulnerabilitiesMainTableResponse } from "@/interfaces/vulnerabilities/get-vulnerabilities-main-table.response";
import { api } from "@/lib/api";

export interface GetVulnerabilitiesParams {
  projectId: string;
  page: number;
  limit: number;
}

export async function getVulnerabilities({
  projectId,
  page,
  limit,
}: GetVulnerabilitiesParams): Promise<GetVulnerabilitiesMainTableResponse> {
  const { data } = await api.get<GetVulnerabilitiesMainTableResponse>("/vulnerabilities", {
    params: { projectId, page, limit },
  });
  return data;
}
