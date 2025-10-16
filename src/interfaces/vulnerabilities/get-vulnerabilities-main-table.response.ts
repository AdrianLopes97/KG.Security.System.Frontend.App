import type { Pagination } from "../pagination";
import type { GetVulnerabilitiesResponse } from "./get-vulnerabilities.response";

export interface GetVulnerabilitiesMainTableResponse {
  pagination: Pagination;
  vulnerabilities: GetVulnerabilitiesResponse[];
  totalCount: number;
  pendingScans: number;
  successfulScans: number;
  failedScans: number;
}
