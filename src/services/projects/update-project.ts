import type { CreateProjectRequest } from "@/interfaces/projects/create-project.request";
import { api } from "@/lib/api";

export async function updateProject(id: string, payload: CreateProjectRequest): Promise<boolean> {
  const { data } = await api.put<boolean>(`/project/${id}`, payload);
  return data;
}
