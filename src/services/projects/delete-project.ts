import { api } from "@/lib/api";

export async function deleteProject(id: string): Promise<boolean> {
  const { data } = await api.delete<boolean>(`/project/${id}`);
  return data;
}
