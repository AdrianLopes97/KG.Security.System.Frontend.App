import { WrapperPage } from "@/components/layout/wrapper-page";
import { ObservabilitiesTable } from "@/components/tables/observabilities-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useObservabilityTable } from "@/hooks/use-observabilities-table";
import { useProjectsList } from "@/hooks/use-projects-list";
import { FilterPeriods } from "@/types/enums/filter-periods.enum";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, CircleX, Info, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
}

export function Observability() {
  const [page, setPage] = useState(0);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [period, setPeriod] = useState<FilterPeriods>(FilterPeriods.allDays);
  const limit = 10;

  const queryClient = useQueryClient();
  const { data: projects = [], isLoading: isLoadingProjects } = useProjectsList();

  useEffect(() => {
    if (projects && projects.length > 0 && !projects.some((p) => p.id === selectedProjectId)) {
      setSelectedProjectId(projects[0].id);
      setPage(0);
    }
  }, [projects, selectedProjectId]);

  const { data, isLoading, isFetching } = useObservabilityTable(selectedProjectId ?? "", period, page + 1, limit);

  const metrics: MetricCard[] = useMemo(() => {
    const erroLogs = data?.errorLogs ?? 0;
    const alertLogs = data?.alertLogs ?? 0;
    const infoLogs = data?.infoLogs ?? 0;

    const format = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

    return [
      {
        id: "error-logs",
        label: "Logs de Erro",
        value: format(erroLogs),
        icon: CircleX,
        iconClass: "text-red-600", // vermelho (danger)
      },
      {
        id: "alert-logs",
        label: "Logs de Alerta",
        value: format(alertLogs),
        icon: TriangleAlert,
        iconClass: "text-amber-600", // laranja (warning)
      },
      {
        id: "info-logs",
        label: "Logs de Informação",
        value: format(infoLogs),
        icon: Info,
        iconClass: "text-blue-600", // azul (info)
      },
    ];
  }, [data]);

  return (
    <WrapperPage title="Observabilidade">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-semibold text-lg">Observabilidade</h1>
          <p className="text-muted-foreground text-sm">Monitore logs e eventos dos seus projetos</p>
        </div>
      </div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Card className="flex-1 border-blue-200/60 bg-blue-50/80 text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-100">
          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 font-medium leading-none">
              <span
                aria-hidden
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-200 bg-blue-100 text-blue-600 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
              >
                <Info className="h-4 w-4" />
              </span>{" "}
              Para auxílio no setup clique aqui
            </CardTitle>
            <CardDescription className="text-blue-800/80 dark:text-blue-200/80">
              Precisa de ajuda para configurar o envio de logs e observabilidade?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div data-slot="setup-callout-cta">
              <Button variant="outline" size="sm" asChild>
                <Link to="/docs/observability-setup">Ver Guia de Setup</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-foreground text-sm">Projeto:</span>
          <div>
            <Select
              value={selectedProjectId}
              onValueChange={(val) => {
                setSelectedProjectId(val);
                setPage(0);
              }}
              disabled={isLoadingProjects}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder={isLoadingProjects ? "Carregando..." : "Selecione um projeto"} />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden />
          <div>
            <Select value={period} onValueChange={(val) => setPeriod(val as FilterPeriods)}>
              <SelectTrigger className="w-64" aria-label="Período">
                <SelectValue placeholder="Todos os períodos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FilterPeriods.allDays}>Todos os períodos</SelectItem>
                <SelectItem value={FilterPeriods.last7Days}>Últimos 7 dias</SelectItem>
                <SelectItem value={FilterPeriods.last30Days}>Últimos 30 dias</SelectItem>
                <SelectItem value={FilterPeriods.last90Days}>Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          const isPending = isLoading && !data;
          return (
            <Card key={m.id} className="relative overflow-hidden border border-gray-200 text-black backdrop-blur-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-medium text-[16px] tracking-wide">{m.label}</CardTitle>
                  <span className="bg-background/60 p-1.5">
                    <Icon className={`size-[24px] ${m.iconClass}`} />
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-[48px] tabular-nums leading-tight">
                    {isPending ? "…" : m.value}
                  </span>
                </div>
              </CardContent>
              <div className="pointer-events-none absolute inset-0 opacity-40" />
            </Card>
          );
        })}
      </div>
      <ObservabilitiesTable
        data={data?.observabilities ?? []}
        isLoading={isLoading || isFetching}
        serverPagination={
          data
            ? {
                pageIndex: page,
                pageCount: data.pagination.pageCount,
                totalCount: data.pagination.totalCount,
                hasMore: data.pagination.hasMore,
                onPageChange: setPage,
                isDisabled: isFetching,
              }
            : undefined
        }
      />
    </WrapperPage>
  );
}
