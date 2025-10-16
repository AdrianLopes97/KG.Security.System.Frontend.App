import { getProjectsList } from "@/services/projects/get-projects-list";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useProjectsList() {
  return useQuery({
    queryKey: ["get-list"],
    queryFn: () => getProjectsList(),
    placeholderData: keepPreviousData,
  });
}
