// Enum for scan types
export const ScanType = {
  STATIC: "STATIC",
  DYNAMIC: "DYNAMIC",
} as const;

export type ScanType = (typeof ScanType)[keyof typeof ScanType];
