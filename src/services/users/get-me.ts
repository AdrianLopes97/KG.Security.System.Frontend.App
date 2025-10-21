import type { GetMeResponse } from "@/interfaces/users/get-me.response";
import { api } from "@/lib/api";

export async function getMe(): Promise<GetMeResponse> {
  const { data } = await api.get<GetMeResponse>("/users/me");
  return data;
}
