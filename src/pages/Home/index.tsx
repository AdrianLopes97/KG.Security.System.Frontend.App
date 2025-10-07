import { WrapperPage } from "@/components/layout/wrapper-page";
import { type ProjectRow, ProjectsTable } from "@/pages/Home/projects-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Clock9, FileText, Globe, Plus, ShieldEllipsis } from "lucide-react";

interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "brand" | "online" | "vuln" | "logs";
}

const metrics: MetricCard[] = [
  {
    id: "total-projects",
    label: "Total Projetos",
    value: 24,
    description: "Projetos cadastrados",
    icon: FileText,
    variant: "brand",
  },
  {
    id: "projects-online",
    label: "Projetos Online",
    value: 18,
    description: "Monitoramento ativo",
    icon: Globe,
    variant: "online",
  },
  {
    id: "total-vulns",
    label: "Total Vulnerabilidades",
    value: 132,
    description: "Encontradas no período",
    icon: ShieldEllipsis,
    variant: "vuln",
  },
  {
    id: "logs-24h",
    label: "Logs (24h)",
    value: 8_421,
    description: "Eventos processados",
    icon: Clock9,
    variant: "logs",
  },
];

export function Home() {
  // Temporary mock data for table (replace with API integration later)
  const projects: ProjectRow[] = [
    {
      id: "1",
      name: "E-commerce Portal",
      url: "https://ecommerce.example.com",
      status: "online",
      uptime: "99,3%",
      vulnerabilities: 3,
      lastScan: "20/01/2025, 07:30",
      logs24h: "1.523",
    },
    {
      id: "2",
      name: "E-commerce Portal",
      url: "https://ecommerce.example.com",
      status: "offline",
      uptime: "99,3%",
      vulnerabilities: 3,
      lastScan: "20/01/2025, 07:30",
      logs24h: "1.523",
    },
    ...Array.from({ length: 6 }).map((_, i) => ({
      id: String(i + 3),
      name: "E-commerce Portal",
      url: "https://ecommerce.example.com",
      status: "online" as const,
      uptime: "99,3%",
      vulnerabilities: 3,
      lastScan: "20/01/2025, 07:30",
      logs24h: "1.523",
    })),
  ];

  return (
    <WrapperPage title="Home">
      <div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-semibold text-lg">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Gerencie seus projetos de monitoramento de segurança</p>
          </div>
          <div>
            <Button variant="brand" size="lg">
              <Plus className="mr-2" />
              Criar Novo Projeto
            </Button>
          </div>
        </div>
        <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <Card
                key={m.id}
                className={cn("relative overflow-hidden border border-gray-200 text-black backdrop-blur-sm")}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-medium text-[16px] uppercase tracking-wide">{m.label}</CardTitle>
                    <span className="rounded-md bg-background/60 p-1.5 shadow-sm ring-1 ring-border ring-inset">
                      <Icon className="size-4 text-brand" />
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[48px] tabular-nums leading-tight">{m.value}</span>
                  </div>
                </CardContent>
                <div className="pointer-events-none absolute inset-0 opacity-40" />
              </Card>
            );
          })}
        </div>
        <ProjectsTable data={projects} pageSize={10} onEdit={(id) => console.log("edit", id)} />
      </div>
    </WrapperPage>
  );
}
