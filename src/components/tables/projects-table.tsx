import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GetProjectsResponse } from "@/interfaces/projects/get-projects.response";
import { cn } from "@/lib/utils";
import { UpTimeStatus } from "@/types/enums/up-time-status.enum";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Pencil } from "lucide-react";

interface ProjectsTableProps {
  readonly data: GetProjectsResponse[];
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

const columns: ColumnDef<GetProjectsResponse>[] = [
  {
    accessorKey: "name",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Projeto</span>,
    cell: ({ row }) => {
      const value = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm leading-tight">{value.name}</span>
          <span className="text-muted-foreground text-xs leading-tight">{value.systemUrl ? value.systemUrl : "-"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Status</span>,
    cell: ({ row }) => {
      const value = row.original;
      const status = value.upTimeStatus;
      const isOnline = status === UpTimeStatus.UP;
      return (
        <Badge
          variant={isOnline ? "secondary" : "outline"}
          className={cn(
            "px-2 py-0.5",
            isOnline
              ? "bg-green-500/90 text-white hover:bg-green-600"
              : "border-border/70 bg-zinc-500 text-white hover:bg-zinc-600"
          )}
        >
          {isOnline ? "Online" : "Offline"}
        </Badge>
      );
    },
    size: 110,
  },
  {
    accessorKey: "uptime",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Uptime</span>,
    cell: ({ row }) => {
      const value = row.original;
      return <span className="text-sm tabular-nums">{value.uptimePercentage ? value.uptimePercentage : "-"}</span>;
    },
    size: 90,
  },
  {
    accessorKey: "vulnerabilities",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Vulnerabilidades</span>,
    cell: ({ row }) => {
      const value = row.original;
      const has = value.totalVulnerabilities > 0;
      return (
        <Badge
          variant="outline"
          className={cn(
            "h-6 min-w-6 justify-center tabular-nums",
            has ? "border-border bg-background" : "border-border/60 bg-muted/40 text-muted-foreground"
          )}
        >
          {value.totalVulnerabilities}
        </Badge>
      );
    },
    size: 140,
  },
  {
    accessorKey: "lastScan",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Último Scan</span>,
    cell: ({ row }) => {
      const value = row.original;

      return (
        <span className="whitespace-nowrap text-sm">
          {value.lastScanAt ? dayjs(value.lastScanAt).format("DD/MM/YYYY HH:mm") : "-"}
        </span>
      );
    },
    size: 160,
  },
  {
    accessorKey: "logs24h",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Logs (24h)</span>,
    cell: ({ row }) => {
      const value = row.original;
      return <span className="text-sm tabular-nums">{value.logsCount}</span>;
    },
    size: 110,
  },
  {
    id: "actions",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Ações</span>,
    cell: ({ row, table }) => {
      const value = row.original;
      const meta = table.options.meta as TableMeta | undefined;
      const onEdit = meta?.onEdit;
      return (
        <Button
          type="button"
          onClick={() => onEdit?.(value.id)}
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 font-medium text-primary text-xs hover:underline"
        >
          Editar <Pencil aria-hidden className="size-3.5" />
        </Button>
      );
    },
    size: 90,
  },
];

export function ProjectsTable({ data, pageSize = 10, onEdit, serverPagination, isLoading }: ProjectsTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={serverPagination ? undefined : pageSize}
      serverPagination={serverPagination}
      isLoading={isLoading}
      title="Projetos"
      description="Lista de todos os projetos"
      renderEmpty={<span>Nenhum projeto encontrado.</span>}
      tableMeta={{ onEdit }}
    />
  );
}
