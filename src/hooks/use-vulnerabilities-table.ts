import { getVulnerabilities } from "@/services/vulnerabilities/get-vulnerabilities";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useVulnerabilitiesTable(projectId: string, page: number, limit: number) {
  return useQuery({
    queryKey: ["get-vulnerabilities", projectId, page, limit],
    queryFn: () => getVulnerabilities({ projectId, page, limit }),
    enabled: Boolean(projectId),
    placeholderData: keepPreviousData,
  });
}
