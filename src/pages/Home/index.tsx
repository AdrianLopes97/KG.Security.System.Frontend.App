import { WrapperPage } from "@/components/layout/wrapper-page";
import { ProjectsTable } from "@/components/tables/projects-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectsTable } from "@/hooks/use-projects-table";
import { Clock9, FileText, Globe, Plus, ShieldEllipsis } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "brand" | "online" | "vuln" | "logs";
}

export function Home() {
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const limit = 10;

  const { data, isLoading, isFetching } = useProjectsTable(page + 1, limit); // se sua API usa 1-based

  const metrics: MetricCard[] = useMemo(() => {
    const totalProjects = data?.totalCount ?? data?.pagination.totalCount ?? 0;
    const projectsOnline = data?.totalProjectsOnlineCount ?? 0;
    const totalVulns = data?.vulnerabilityTotalCount ?? 0;
    const logsTotal = data?.logsTotalCount ?? 0;

    const format = (n: number) => new Intl.NumberFormat("pt-BR").format(n);

    return [
      {
        id: "total-projects",
        label: "Total Projetos",
        value: format(totalProjects),
        icon: FileText,
        variant: "brand" as const,
      },
      {
        id: "projects-online",
        label: "Projetos Online",
        value: format(projectsOnline),
        icon: Globe,
        variant: "online" as const,
      },
      {
        id: "total-vulns",
        label: "Total Vulnerabilidades",
        value: format(totalVulns),
        icon: ShieldEllipsis,
        variant: "vuln" as const,
      },
      {
        id: "logs-24h",
        label: "Logs (total)",
        value: format(logsTotal),
        icon: Clock9,
        variant: "logs" as const,
      },
    ];
  }, [data]);

  return (
    <WrapperPage title="Home">
      <div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-semibold text-lg">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Gerencie seus projetos</p>
          </div>
          <div>
            <Button variant="brand" size="lg" onClick={() => navigate("/home/create-project")}>
              <Plus className="mr-2" />
              Criar Novo Projeto
            </Button>
          </div>
        </div>
        <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            const isPending = isLoading && !data; // primeira carga
            return (
              <Card key={m.id} className="relative overflow-hidden border border-gray-200 text-black backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-medium text-[16px] tracking-wide">{m.label}</CardTitle>
                    <span className="bg-background/60 p-1.5">
                      <Icon className="size-[24px] text-brand" />
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
        <ProjectsTable
          data={data?.projects ?? []}
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
          onEdit={(id) => navigate(`/home/projects/${id}/edit`)}
        />
      </div>
    </WrapperPage>
  );
}
