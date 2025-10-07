import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

export interface ProjectRow {
  id: string;
  name: string;
  url: string;
  status: "online" | "offline";
  uptime: string;
  vulnerabilities: number;
  lastScan: string;
  logs24h: number;
}

interface ProjectsTableProps {
  readonly data: ProjectRow[];
  readonly pageSize?: number;
  readonly onEdit?: (id: string) => void;
}

interface TableMeta {
  onEdit?: (id: string) => void;
}

const columns: ColumnDef<ProjectRow>[] = [
  {
    accessorKey: "name",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Projeto</span>,
    cell: ({ row }) => {
      const value = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-sm leading-tight">{value.name}</span>
          <span className="text-muted-foreground text-xs leading-tight">{value.url}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Status</span>,
    cell: ({ getValue }) => {
      const status = getValue<ProjectRow["status"]>();
      const isOnline = status === "online";
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
    cell: ({ getValue }) => <span className="text-sm tabular-nums">{getValue<string>()}</span>,
    size: 90,
  },
  {
    accessorKey: "vulnerabilities",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Vulnerabilidades</span>,
    cell: ({ getValue }) => {
      const val = getValue<number>();
      const has = val > 0;
      return (
        <Badge
          variant="outline"
          className={cn(
            "h-6 min-w-6 justify-center tabular-nums",
            has ? "border-border bg-background" : "border-border/60 bg-muted/40 text-muted-foreground"
          )}
        >
          {val}
        </Badge>
      );
    },
    size: 140,
  },
  {
    accessorKey: "lastScan",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Último Scan</span>,
    cell: ({ getValue }) => <span className="whitespace-nowrap text-sm">{getValue<string>()}</span>,
    size: 160,
  },
  {
    accessorKey: "logs24h",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Logs (24h)</span>,
    cell: ({ getValue }) => <span className="text-sm tabular-nums">{getValue<string | number>()}</span>,
    size: 110,
  },
  {
    id: "actions",
    header: () => <span className="font-medium text-xs uppercase tracking-wide">Ações</span>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as TableMeta | undefined;
      const onEdit = meta?.onEdit;
      return (
        <Button
          type="button"
          onClick={() => onEdit?.(row.original.id)}
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

export function ProjectsTable({ data, pageSize = 10, onEdit }: ProjectsTableProps) {
  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={pageSize}
      title="Projetos"
      description="Lista de todos os projetos de monitoramento"
      renderEmpty={<span>Nenhum projeto encontrado.</span>}
      tableMeta={{ onEdit }}
    />
  );
}
