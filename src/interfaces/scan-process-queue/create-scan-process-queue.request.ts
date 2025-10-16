import type { ScanType } from "@/types/enums/scan-type.enums";

export interface CreateScanProcessQueueRequest {
  projectId: string;
  scanType: ScanType;
}
