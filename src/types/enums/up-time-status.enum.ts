export const UpTimeStatus = {
  UP: "UP",
  DOWN: "DOWN",
  UNKNOWN: "UNKNOWN",
} as const;

export type UpTimeStatus = (typeof UpTimeStatus)[keyof typeof UpTimeStatus];
