import type { Pagination } from "../pagination";
import type { GetObservabilitiesResponse } from "./get-observabilities.response";

export interface GetObservabilitiesMainTableResponse {
  pagination: Pagination;
  observabilities: GetObservabilitiesResponse[];
  totalCount: number;
  errorLogs: number;
  alertLogs: number;
  infoLogs: number;
}
