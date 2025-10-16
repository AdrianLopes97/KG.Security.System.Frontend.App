import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import type { GetVulnerabilitiesResponse } from "@/interfaces/vulnerabilities/get-vulnerabilities.response";
import { cn } from "@/lib/utils";
import { VulnerabilitySeverity } from "@/types/enums/vulnerabilities.enums";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

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
    isDisabled?: boolean; // desabilita controles
  };
  readonly isLoading?: boolean; // estado de carregamento externo
}

interface TableMeta {
  onEdit?: (id: string) => void;
}

const columns: ColumnDef<GetVulnerabilitiesResponse>[] = [
  {
    accessorKey: "vulnerability",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Vulnerabilidade</span>,
    cell: ({ row }) => {
      const value = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm leading-tight">{value.ruleId}</span>
          <span className="text-muted-foreground text-xs leading-tight">
            {value.description ? value.description : "-"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "criticality",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Criticidade</span>,
    cell: ({ row }) => {
      const value = row.original;
      const status = value.severity;

      return (
        <Badge
          variant={status === VulnerabilitySeverity.ERROR ? "secondary" : "outline"}
          className={cn(
            "px-2 py-0.5",
            status === VulnerabilitySeverity.ERROR
              ? "bg-green-500/90 text-white hover:bg-green-600"
              : "border-border/70 bg-zinc-500 text-white hover:bg-zinc-600"
          )}
        >
          {status === VulnerabilitySeverity.ERROR ? "Online" : "Offline"}
        </Badge>
      );
    },
    size: 110,
  },
  {
    accessorKey: "foundedAt",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Encontrada em</span>,
    cell: ({ row }) => {
      const value = row.original;

      return (
        <span className="whitespace-nowrap text-sm">
          {value.createdAt ? dayjs(value.createdAt).format("DD/MM/YYYY HH:mm") : "-"}
        </span>
      );
    },
    size: 160,
  },
  {
    accessorKey: "isRecurrent",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Recorrente</span>,
    cell: ({ row }) => {
      const value = row.original;
      const has = value.isRecurrent;
      return (
        <Badge
          variant="outline"
          className={cn(
            "h-6 min-w-6 justify-center tabular-nums",
            has ? "border-border bg-background" : "border-border/60 bg-muted/40 text-muted-foreground"
          )}
        >
          {has ? "Sim" : "Não"}
        </Badge>
      );
    },
    size: 140,
  },
  {
    accessorKey: "foundInScans",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Scans</span>,
    cell: ({ row }) => {
      const value = row.original;
      const has = value.foundInScans > 0;
      return (
        <Badge
          variant="outline"
          className={cn(
            "h-6 min-w-6 justify-center tabular-nums",
            has ? "border-border bg-background" : "border-border/60 bg-muted/40 text-muted-foreground"
          )}
        >
          {value.foundInScans}x
        </Badge>
      );
    },
    size: 140,
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
    />
  );
}
