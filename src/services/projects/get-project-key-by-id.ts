import { api } from "@/lib/api";

export async function getProjectKeyById(id: string): Promise<string> {
  const { data } = await api.get<string>(`/project/key/${id}`);
  return data;
}
