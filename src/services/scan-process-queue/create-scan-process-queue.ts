import type { CreateScanProcessQueueRequest } from "@/interfaces/scan-process-queue/create-scan-process-queue.request";
import { api } from "@/lib/api";

export async function createScanProcessQueue(payload: CreateScanProcessQueueRequest): Promise<boolean> {
  const { data } = await api.post<boolean>("/scan-process-queue", payload);
  return data;
}
