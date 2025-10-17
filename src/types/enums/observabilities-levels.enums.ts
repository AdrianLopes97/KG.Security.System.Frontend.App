// Enum for observability levels
export const ObservabilityLevels = {
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
} as const;

export type ObservabilityLevels = (typeof ObservabilityLevels)[keyof typeof ObservabilityLevels];
