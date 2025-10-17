export const FilterPeriods = {
  allDays: "allDays",
  last7Days: "last7Days",
  last30Days: "last30Days",
  last90Days: "last90Days",
} as const;

export type FilterPeriods = (typeof FilterPeriods)[keyof typeof FilterPeriods];
