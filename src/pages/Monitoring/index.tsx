import { WrapperPage } from "@/components/layout/wrapper-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjectsList } from "@/hooks/use-projects-list";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export function Monitoring() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const { data: projects = [], isLoading: isLoadingProjects } = useProjectsList();

  useEffect(() => {
    if (projects && projects.length > 0 && !projects.some((p) => p.id === selectedProjectId)) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  return (
    <WrapperPage title="Monitoramento">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-semibold text-lg">Monitoramento</h1>
          <p className="text-muted-foreground text-sm">Status dos sistemas monitorados</p>
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
    </WrapperPage>
  );
}
