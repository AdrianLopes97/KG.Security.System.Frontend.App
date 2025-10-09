import { getProjectById } from "@/services/projects/get-project-by-id";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useProjectById(id: string) {
  return useQuery({
    queryKey: ["get-project-by-id", id],
    queryFn: () => getProjectById(id),
    placeholderData: keepPreviousData,
  });
}
