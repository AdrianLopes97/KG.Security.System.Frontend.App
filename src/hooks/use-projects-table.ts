import { getProjects } from "@/services/projects/get-projects";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useProjectsTable(page: number, limit: number) {
  return useQuery({
    queryKey: ["get-projects", page, limit],
    queryFn: () => getProjects({ page, limit }),
    placeholderData: keepPreviousData,
  });
}
