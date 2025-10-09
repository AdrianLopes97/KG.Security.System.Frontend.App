import type { GetProjectByIdResponse } from "@/interfaces/projects/get-project-by-id.response";
import { api } from "@/lib/api";

export async function getProjectById(id: string): Promise<GetProjectByIdResponse> {
  const { data } = await api.get<GetProjectByIdResponse>(`/project/${id}`);
  return data;
}
