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
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type TableOptions,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pageSize?: number;
  className?: string;
  title?: string;
  description?: string;
  getRowId?: TableOptions<TData>["getRowId"];
  renderEmpty?: React.ReactNode | ((info: { columns: number }) => React.ReactNode);
  paginationWindow?: number; // how many numbered buttons to show (default 5)
  tableMeta?: TableOptions<TData>["meta"]; // pass-through meta for column cells
  isLoading?: boolean; // show skeleton rows
  loadingRows?: number; // how many skeleton rows (default 5)
  /**
   * Quando presente, ativa modo de paginação controlada pelo backend.
   * A tabela assume que `data` já contém apenas os registros da página corrente.
   * `pageIndex` é zero-based (0 = primeira página).
   */
  serverPagination?: {
    pageIndex: number;
    pageCount: number; // total de páginas informado pelo backend
    totalCount?: number; // total geral de registros (opcional)
    hasMore?: boolean; // se o backend expõe flag incremental
    onPageChange: (pageIndex: number) => void; // callback para solicitar nova página
    pageSize?: number; // page size efetivo retornado/usado pelo backend (opcional, sobrepõe prop pageSize)
    isDisabled?: boolean; // desabilita controles (tipicamente enquanto faz fetch)
  };
}

export function DataTable<TData>({
  columns,
  data,
  pageSize = 10,
  className,
  title,
  description,
  getRowId,
  renderEmpty,
  paginationWindow = 5,
  tableMeta,
  isLoading = false,
  loadingRows = 5,
  serverPagination,
}: Readonly<DataTableProps<TData>>) {
  // Modo client (default) usa paginação interna do TanStack.
  // Modo server ignora getPaginationRowModel e considera que `data` já é a página atual.
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(serverPagination
      ? {}
      : {
          getPaginationRowModel: getPaginationRowModel(),
          initialState: { pagination: { pageIndex: 0, pageSize } },
        }),
    getRowId,
    meta: tableMeta,
  });

  const headerGroups = table.getHeaderGroups();
  // Em server mode não aplicamos slicing adicional; usamos as linhas como vieram.
  const rows = table.getRowModel().rows;
  const controlled = !!serverPagination;
  const current = controlled ? serverPagination.pageIndex : table.getState().pagination.pageIndex;
  const pageCount = controlled ? serverPagination.pageCount : table.getPageCount();
  const paginationDisabled = isLoading || serverPagination?.isDisabled;

  function buildPageWindow(): number[] {
    const maxButtons = paginationWindow;
    if (pageCount <= maxButtons) return Array.from({ length: pageCount }, (_, i) => i);
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(0, current - half);
    let end = start + maxButtons - 1;
    if (end >= pageCount) {
      end = pageCount - 1;
      start = end - maxButtons + 1;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  const pageWindow = buildPageWindow();

  function prevDisabled() {
    return controlled ? current === 0 : !table.getCanPreviousPage();
  }
  function nextDisabled() {
    return controlled ? current === pageCount - 1 : !table.getCanNextPage();
  }
  const prevClass = prevDisabled() ? "pointer-events-none opacity-50" : undefined;
  const nextClass = nextDisabled() ? "pointer-events-none opacity-50" : undefined;

  return (
    <div className={cn("rounded-xl border border-border/70 bg-background", className)}>
      {(title || description) && (
        <div className="p-4 pb-2">
          {title && <h2 className="font-semibold text-base leading-tight">{title}</h2>}
          {description && <p className="text-muted-foreground text-sm">{description}</p>}
        </div>
      )}
      <Separator className="my-0" />
      <Table>
        <TableHeader className="bg-muted/40">
          {headerGroups.map((hg) => (
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
          {isLoading
            ? Array.from({ length: loadingRows }).map((_, i) => {
                const rowKey = `skeleton-row-${i}`;
                return (
                  <TableRow key={rowKey} data-loading-row className="border-border/50 border-b text-sm">
                    {columns.map((col, ci) => {
                      const colKey =
                        (typeof col.id === "string" && col.id) ||
                        (typeof col.header === "string" && col.header) ||
                        `col-${ci}`;
                      return (
                        <TableCell key={`${rowKey}-${colKey}`} className="px-4 py-3">
                          <Skeleton className="h-4 w-full max-w-[160px]" />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            : rows.map((row) => (
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
          {!isLoading && rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground text-sm">
                {typeof renderEmpty === "function"
                  ? renderEmpty({ columns: columns.length })
                  : renderEmpty || "Nenhum registro encontrado."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="px-4 py-4">
        <Pagination
          className="justify-end"
          aria-disabled={paginationDisabled}
          data-disabled={paginationDisabled || undefined}
        >
          <PaginationContent className="justify-end">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (paginationDisabled) return;
                  if (controlled) {
                    if (current > 0) serverPagination.onPageChange(current - 1);
                  } else {
                    table.previousPage();
                  }
                }}
                aria-disabled={prevDisabled()}
                data-disabled={prevDisabled() || undefined}
                className={prevClass}
              />
            </PaginationItem>
            {pageWindow[0] > 0 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (paginationDisabled) return;
                      if (controlled) serverPagination.onPageChange(0);
                      else table.setPageIndex(0);
                    }}
                    isActive={current === 0}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {pageWindow[0] > 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}
            {pageWindow.map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === current}
                  onClick={(e) => {
                    e.preventDefault();
                    if (paginationDisabled) return;
                    if (controlled) serverPagination.onPageChange(p);
                    else table.setPageIndex(p);
                  }}
                >
                  {p + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {pageWindow[pageWindow.length - 1] < pageCount - 1 && (
              <>
                {pageWindow[pageWindow.length - 1] < pageCount - 2 && (
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
                      if (paginationDisabled) return;
                      if (controlled) serverPagination.onPageChange(pageCount - 1);
                      else table.setPageIndex(pageCount - 1);
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
                  if (paginationDisabled) return;
                  if (controlled) {
                    if (current < pageCount - 1) serverPagination.onPageChange(current + 1);
                  } else {
                    table.nextPage();
                  }
                }}
                aria-disabled={nextDisabled()}
                data-disabled={nextDisabled() || undefined}
                className={nextClass}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="mt-2 text-right text-muted-foreground text-xs">
          Página {current + 1} de {pageCount || 1}
          {serverPagination?.totalCount !== undefined && (
            <span className="ml-1">• Total {serverPagination.totalCount} registro(s)</span>
          )}
        </div>
      </div>
    </div>
  );
}
