import type { GetProjectListResponse } from "@/interfaces/projects/get-project-list.response";
import { api } from "@/lib/api";

export async function getProjectsList(): Promise<GetProjectListResponse[]> {
  const { data } = await api.get<GetProjectListResponse[]>("/project/list");
  return data;
}
