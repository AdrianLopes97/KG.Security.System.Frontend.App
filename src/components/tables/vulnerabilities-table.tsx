import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import type { GetVulnerabilitiesResponse } from "@/interfaces/vulnerabilities/get-vulnerabilities.response";
import { cn } from "@/lib/utils";
import { VulnerabilitySeverity } from "@/types/enums/vulnerabilities.enums";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CircleAlert } from "lucide-react";

interface VulnerabilitiesTableProps {
  readonly data: GetVulnerabilitiesResponse[];
  /** Page size usado apenas em modo client (quando não há serverPagination) */
  readonly pageSize?: number;
  readonly onEdit?: (id: string) => void;
  /**
   * Ativa paginação controlada vinda do backend. `data` deve conter apenas os registros da página corrente.
   * pageIndex é zero-based.
   */
  readonly serverPagination?: {
    pageIndex: number;
    pageCount: number;
    totalCount?: number;
    hasMore?: boolean;
    onPageChange: (pageIndex: number) => void;
    isDisabled?: boolean;
  };
  readonly isLoading?: boolean;
}

interface TableMeta {
  onEdit?: (id: string) => void;
}

const severityStyles: Record<string, { label: string; className: string }> = {
  error: { label: "Erro", className: "bg-red-600 text-white hover:bg-red-600" },
  warning: { label: "Alerta", className: "bg-orange-500 text-white hover:bg-orange-600" },
  note: { label: "Anotação", className: "bg-neutral-500 text-white hover:bg-neutral-600" },
};

function getSeverityStyle(sev?: VulnerabilitySeverity) {
  const key = String(sev ?? "").toLowerCase();
  return (
    severityStyles[key] ?? { label: String(sev ?? "-"), className: "border-border/70 bg-muted/40 text-foreground" }
  );
}

const columns: ColumnDef<GetVulnerabilitiesResponse>[] = [
  {
    accessorKey: "vulnerability",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Vulnerabilidade</span>,
    size: 560,
    cell: ({ row }) => {
      const value = row.original;

      let iconColor = "text-neutral-500";
      if (value.severity === VulnerabilitySeverity.ERROR) {
        iconColor = "text-red-500";
      } else if (value.severity === VulnerabilitySeverity.WARNING) {
        iconColor = "text-amber-500";
      }

      return (
        <div className="flex items-start gap-2">
          <CircleAlert className={`mt-0.5 size-4 ${iconColor} shrink-0`} />
          <div className="flex flex-col">
            <div className="flex min-w-0 flex-col">
              <span className="whitespace-normal break-all font-medium text-sm leading-tight">{value.ruleId}</span>
              <span className="whitespace-normal break-words text-muted-foreground text-xs leading-snug">
                {value.description ? value.description : "-"}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "level",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Nivel</span>,
    cell: ({ row }) => {
      const v = row.original;
      const s = getSeverityStyle(v.severity);

      return (
        <Badge variant="secondary" className={cn("rounded-full px-2 py-0.5 text-xs", s.className)}>
          {s.label}
        </Badge>
      );
    },
    size: 120,
  },
  {
    accessorKey: "foundedAt",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Encontrada em</span>,
    cell: ({ row }) => {
      const v = row.original;
      return (
        <span className="whitespace-nowrap text-sm">
          {v.createdAt ? dayjs(v.createdAt).format("DD/MM/YYYY, HH:mm") : "-"}
        </span>
      );
    },
    size: 170,
  },
  {
    accessorKey: "isRecurrent",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Recorrente</span>,
    cell: ({ row }) => {
      const v = row.original;
      const has = v.isRecurrent;
      return (
        <Badge
          variant="secondary"
          className={cn(
            "rounded-full px-2 py-0.5 text-xs",
            has ? "bg-red-600 text-white hover:bg-red-600" : "bg-muted/40 text-foreground/60"
          )}
        >
          {has ? "Sim" : "Não"}
        </Badge>
      );
    },
    size: 120,
  },
  {
    accessorKey: "foundInScans",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Scans</span>,
    cell: ({ row }) => {
      const v = row.original;
      return (
        <Badge variant="outline" className="rounded-full border-border/70 bg-background px-2 py-0.5 text-xs">
          {v.foundInScans}x
        </Badge>
      );
    },
    size: 110,
  },
];

export function VulnerabilitiesTable({
  data,
  pageSize = 10,
  onEdit,
  serverPagination,
  isLoading,
}: VulnerabilitiesTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={serverPagination ? undefined : pageSize}
      serverPagination={serverPagination}
      isLoading={isLoading}
      title="Vulnerabilidades"
      description="Lista de todas as vulnerabilidades"
      renderEmpty={<span>Nenhuma vulnerabilidade encontrada.</span>}
      tableMeta={{ onEdit }}
      tableClassName="min-w-[1040px]"
    />
  );
}
