// Enum for vulnerability severity
export const VulnerabilitySeverity = {
  ERROR: "error",
  NOTE: "note",
  WARNING: "warning",
} as const;

export type VulnerabilitySeverity = (typeof VulnerabilitySeverity)[keyof typeof VulnerabilitySeverity];
