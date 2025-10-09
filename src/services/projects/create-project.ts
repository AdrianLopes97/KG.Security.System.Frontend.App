import type { CreateProjectRequest } from "@/interfaces/projects/create-project.request";
import { api } from "@/lib/api";

export async function createProject(payload: CreateProjectRequest): Promise<boolean> {
  const { data } = await api.post<boolean>("/project", payload);
  return data;
}
