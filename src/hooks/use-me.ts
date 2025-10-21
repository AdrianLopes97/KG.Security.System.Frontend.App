import { getMe } from "@/services/users/get-me";
import { useQuery } from "@tanstack/react-query";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
    staleTime: 5 * 60 * 1000,
  });
}
