import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil } from "lucide-react";

// NOTE: Reusing existing design primitives; no new base UI primitives created per instructions.

export interface ProjectRow {
  id: string;
  name: string;
  url: string;
  status: "online" | "offline";
  uptime: string; // formatted percentage (e.g. '99,3%')
  vulnerabilities: number;
  lastScan: string; // already formatted date/time
  logs24h: string | number; // e.g. '1.523'
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
  const table = useReactTable<ProjectRow>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize },
    },
    meta: { onEdit },
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-background">
      <div className="p-4 pb-2">
        <h2 className="font-semibold text-base leading-tight">Projetos</h2>
        <p className="text-muted-foreground text-sm">Lista de todos os projetos de monitoramento</p>
      </div>
      <Separator className="my-0" />
      <Table>
        <TableHeader className="bg-neutral-50/40">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="border-border/60 border-b hover:bg-transparent">
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() ? header.getSize() : undefined }}
                  className="px-4 py-3 font-medium text-[11px] text-black"
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={cn("border-border/50 border-b text-sm", row.getIsSelected() && "bg-muted")}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground text-sm">
                Nenhum projeto encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="px-4 py-4">
        <Pagination className="justify-end">
          <PaginationContent className="justify-end">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  table.previousPage();
                }}
                aria-disabled={!table.getCanPreviousPage()}
                data-disabled={!table.getCanPreviousPage() || undefined}
                className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {(() => {
              const pageCount = table.getPageCount();
              const current = table.getState().pagination.pageIndex; // zero-based
              const maxButtons = 5; // window size
              const pages: number[] = [];
              if (pageCount <= maxButtons) {
                for (let i = 0; i < pageCount; i++) pages.push(i);
              } else {
                const half = Math.floor(maxButtons / 2);
                let start = Math.max(0, current - half);
                let end = start + maxButtons - 1;
                if (end >= pageCount) {
                  end = pageCount - 1;
                  start = end - maxButtons + 1;
                }
                for (let i = start; i <= end; i++) pages.push(i);
              }
              return (
                <>
                  {pages[0] > 0 && (
                    <>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            table.setPageIndex(0);
                          }}
                          isActive={current === 0}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {pages[0] > 1 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}
                  {pages.map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href="#"
                        isActive={p === current}
                        onClick={(e) => {
                          e.preventDefault();
                          table.setPageIndex(p);
                        }}
                      >
                        {p + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {pages[pages.length - 1] < pageCount - 1 && (
                    <>
                      {pages[pages.length - 1] < pageCount - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          isActive={current === pageCount - 1}
                          onClick={(e) => {
                            e.preventDefault();
                            table.setPageIndex(pageCount - 1);
                          }}
                        >
                          {pageCount}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.nextPage();
                      }}
                      aria-disabled={!table.getCanNextPage()}
                      data-disabled={!table.getCanNextPage() || undefined}
                      className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </>
              );
            })()}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
