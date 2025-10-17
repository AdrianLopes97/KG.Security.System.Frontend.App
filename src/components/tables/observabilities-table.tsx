import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import type { GetObservabilitiesResponse } from "@/interfaces/observabilities/get-observabilities.response";
import { cn } from "@/lib/utils";
import type { ObservabilityLevels } from "@/types/enums/observabilities-levels.enums";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CircleX, Info, TriangleAlert } from "lucide-react";

interface ObservabilitiesTableProps {
  readonly data: GetObservabilitiesResponse[];
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

const levelStyles: Record<string, { label: string; className: string }> = {
  error: { label: "Erro", className: "bg-red-600 text-white hover:bg-red-600" },
  warning: { label: "Alerta", className: "bg-amber-500 text-white hover:bg-amber-600" },
  info: { label: "Info", className: "bg-neutral-300 text-white hover:bg-neutral-500" },
};

function getLevelStyle(lvl?: ObservabilityLevels) {
  const key = String(lvl ?? "").toLowerCase();
  return levelStyles[key] ?? { label: String(lvl ?? "-"), className: "border-border/70 bg-muted/40 text-foreground" };
}

function getLevelIcon(lvl?: ObservabilityLevels) {
  const key = String(lvl ?? "").toLowerCase();
  if (key === "error") return { Icon: CircleX, className: "text-red-600" };
  if (key === "warning") return { Icon: TriangleAlert, className: "text-amber-600" };
  if (key === "info") return { Icon: Info, className: "text-blue-600" };
  return { Icon: Info, className: "text-muted-foreground" };
}

const columns: ColumnDef<GetObservabilitiesResponse>[] = [
  {
    accessorKey: "level",
    header: () => <span className="font-medium text-xs tracking-wide">Nivel</span>,
    cell: ({ row }) => {
      const v = row.original;
      const s = getLevelStyle(v.level);
      const i = getLevelIcon(v.level);

      return (
        <div className="flex items-center gap-2">
          <i.Icon className={cn("size-4", i.className)} aria-hidden />
          <Badge variant="secondary" className={cn("rounded-full px-2 py-0.5 text-xs", s.className)}>
            {s.label}
          </Badge>
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "message",
    header: () => <span className="font-medium text-xs tracking-wide">Mensagem</span>,
    size: 250,
    cell: ({ row }) => {
      const value = row.original;

      return (
        <div className="flex items-start gap-2">
          <div className="flex flex-col">
            <div className="flex min-w-0 flex-col">
              <span className="whitespace-normal break-words text-xs leading-snug">{value.name}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: () => <span className="font-medium text-xs tracking-wide">Timestamp</span>,
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
    accessorKey: "details",
    header: () => <span className="font-medium text-xs tracking-wide">Detalhes</span>,
    size: 560,
    cell: ({ row }) => {
      const value = row.original;

      return (
        <div className="flex items-start gap-2">
          <div className="flex flex-col">
            <div className="flex min-w-0 flex-col">
              <span className="whitespace-normal break-words text-xs leading-snug">{value.description}</span>
            </div>
          </div>
        </div>
      );
    },
  },
];

export function ObservabilitiesTable({
  data,
  pageSize = 10,
  onEdit,
  serverPagination,
  isLoading,
}: ObservabilitiesTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={serverPagination ? undefined : pageSize}
      serverPagination={serverPagination}
      isLoading={isLoading}
      title="Logs de Observabilidade"
      description="Lista de logs de observabilidade do sistema."
      renderEmpty={<span>Nenhum log encontrado.</span>}
      tableMeta={{ onEdit }}
      tableClassName="min-w-[1040px]"
    />
  );
}
