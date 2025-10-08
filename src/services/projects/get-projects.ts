import type { GetProjectsMainTableResponse } from "@/interfaces/projects/get-projects-main-table.response";
import { api } from "@/lib/api";

export interface GetProjectsParams {
  page: number;
  limit: number;
}

export async function getProjects({ page, limit }: GetProjectsParams): Promise<GetProjectsMainTableResponse> {
  const { data } = await api.get<GetProjectsMainTableResponse>("/project", {
    params: { page, limit },
  });
  return data;
}
