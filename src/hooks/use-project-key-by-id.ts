import { getProjectKeyById } from "@/services/projects/get-project-key-by-id";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useProjectKeyById(id: string) {
  return useQuery({
    queryKey: ["get-project-key-by-id", id],
    queryFn: () => getProjectKeyById(id),
    placeholderData: keepPreviousData,
  });
}
