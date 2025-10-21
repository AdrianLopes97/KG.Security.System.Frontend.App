import { WrapperPage } from "@/components/layout/wrapper-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMonitoringCounters } from "@/hooks/use-monitoring-counters";
import { useProjectsList } from "@/hooks/use-projects-list";
import type { UpTimeStatus } from "@/types/enums/up-time-status.enum";
import { UpTimeStatus as UpTimeStatusEnum } from "@/types/enums/up-time-status.enum";
import { Activity, Bell, Clock9, Info, TrendingUp, Wifi } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  description?: string; // ADDED: linha auxiliar embaixo do valor
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
}

function getStatusMeta(status?: UpTimeStatus) {
  switch (status) {
    case UpTimeStatusEnum.UP:
      return {
        pillLabel: "Online",
        qualityLabel: "Bom",
        pillClass: "border-green-200 bg-green-100 text-green-700",
        textClass: "text-green-600",
      };
    case UpTimeStatusEnum.DOWN:
      return {
        pillLabel: "Offline",
        qualityLabel: "Ruim",
        pillClass: "border-red-200 bg-red-100 text-red-700",
        textClass: "text-red-600",
      };
    case UpTimeStatusEnum.UNKNOWN:
    default:
      return {
        pillLabel: "—",
        qualityLabel: "Desconhecido",
        pillClass: "border-neutral-200 bg-neutral-100 text-neutral-700",
        textClass: "text-muted-foreground",
      };
  }
}

export function Monitoring() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const { data: projects = [], isLoading: isLoadingProjects } = useProjectsList();

  useEffect(() => {
    if (projects && projects.length > 0 && !projects.some((p) => p.id === selectedProjectId)) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const { data, isLoading } = useMonitoringCounters(selectedProjectId ?? "");

  // API values (outer scope so multiple sections can consume)
  const totalHeartbeats = data?.totalHeartbeats ?? 0;
  const timeOnline = data?.currentUptime ?? "-";
  const alertsSent = data?.sentAlertsCount ?? 0;
  const uptimePercent = data?.uptimePercentage ?? 0;
  const rules = data?.monitoringRules ?? null;
  const statusMeta = getStatusMeta(data?.systemStatus);

  const metrics: MetricCard[] = useMemo(() => {
    const format = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

    return [
      {
        id: "system-status",
        label: "Status do Sistema",
        value: "-",
        icon: Wifi,
        iconClass: "text-green-600", // verde (success)
      },
      {
        id: "heartbeats-received",
        label: "Heartbeats Recebidos",
        value: format(totalHeartbeats),
        icon: Activity,
        iconClass: "text-blue-600", // azul (info)
      },
      {
        id: "time-online",
        label: "Tempo Online",
        value: timeOnline,
        description: "Desde último reinício",
        icon: Clock9,
        iconClass: "text-blue-600", // azul (info)
      },
      {
        id: "alerts-sent",
        label: "Alertas Enviados",
        value: format(alertsSent),
        description: "Últimos 30 dias",
        icon: Bell,
        iconClass: "text-amber-500", // âmbar (warning)
      },
    ];
  }, [totalHeartbeats, timeOnline, alertsSent]);

  return (
    <WrapperPage title="Monitoramento">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-semibold text-lg">Monitoramento</h1>
          <p className="text-muted-foreground text-sm">Status dos sistemas monitorados</p>
        </div>
      </div>

      {/* Callout guia */}
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
              Precisa de ajuda para configurar o envio de heartbeats e monitoramento?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div data-slot="setup-callout-cta">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/monitoring/${selectedProjectId}/setup-monitoring`}>Ver Guia de Setup</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-foreground text-sm">Projeto:</span>
          <div>
            <Select
              value={selectedProjectId}
              onValueChange={(val) => {
                setSelectedProjectId(val);
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
        </div>
      </div>

      {/* Cards de métricas (4 colunas) */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                {/* Card 1 (Status): usa status vindo da API */}
                {m.id === "system-status" ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-xs ${statusMeta.pillClass}`}>
                        {statusMeta.pillLabel}
                      </Badge>
                      <span className={`font-medium text-sm ${statusMeta.textClass}`}>{statusMeta.qualityLabel}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[32px] tabular-nums leading-tight">
                      {isPending ? "…" : m.value}
                    </span>
                    {/* linha de tendência/descrição */}
                    {m.description ? (
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        {m.id === "heartbeats-received" ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : null}
                        <span>{m.description}</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </CardContent>
              <div className="pointer-events-none absolute inset-0 opacity-40" />
            </Card>
          );
        })}
      </div>

      {/* Disponibilidade (Uptime) */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Disponibilidade (Uptime)</CardTitle>
          <CardDescription>Percentual de disponibilidade nos últimos 30 dias</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Uptime atual</span>
            <span className="font-semibold text-green-600">{uptimePercent.toFixed(1).replace(".", ",")}%</span>
          </div>

          {/* Barra de progresso custom (verde) */}
          <div className="relative h-2 w-full rounded-full bg-neutral-200">
            <div
              className="absolute top-0 left-0 h-2 rounded-full bg-green-500"
              style={{ width: `${uptimePercent}%` }}
            />
            <span
              className="-translate-y-1/2 absolute top-1/2 h-3 w-3 rounded-full border border-neutral-300 bg-white"
              style={{ left: `calc(${uptimePercent}% - 6px)` }}
              aria-hidden
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Tempo total monitorado: {isLoading ? "Carregando..." : (data?.totalTimeMonitored ?? "—")}
            </span>
            <span className="text-red-600">
              Downtime total: {isLoading ? "Carregando..." : (data?.downtimeInTime ?? "—")}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Configuração de Monitoramento */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Configuração de Monitoramento</CardTitle>
          <CardDescription>Parâmetros atuais de monitoramento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-md border p-4">
              <div className="text-muted-foreground text-xs">Intervalo de Heartbeat</div>
              <div className="font-semibold text-2xl leading-tight">
                {rules ? `${rules.checkIntervalSeconds}s` : "—"}
              </div>
              <div className="text-muted-foreground text-xs">
                {rules ? `Verificação a cada ${rules.checkIntervalSeconds} segundos` : "—"}
              </div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-muted-foreground text-xs">Timeout</div>
              <div className="font-semibold text-2xl leading-tight">
                {rules ? `${rules.timeoutThresholdSeconds}s` : "—"}
              </div>
              <div className="text-muted-foreground text-xs">
                {rules ? `Considera offline após ${Math.round(rules.timeoutThresholdSeconds / 60)} minutos` : "—"}
              </div>
            </div>
            <div className="rounded-md border p-4">
              <div className="text-muted-foreground text-xs">Alertas Configurados</div>
              <div className="font-semibold text-2xl leading-tight">{rules ? rules.alertsConfigured : "—"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </WrapperPage>
  );
}
