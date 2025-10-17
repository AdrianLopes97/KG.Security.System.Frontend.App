import { WrapperPage } from "@/components/layout/wrapper-page";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env";
import { useProjectKeyById } from "@/hooks/use-project-key-by-id";
import { useParams } from "react-router";

export function SetupObservability() {
  const { projectId = "" } = useParams() as { projectId: string };
  const { toast } = useToast();

  const { data, isLoading, isError } = useProjectKeyById(projectId);

  if (isLoading) {
    return (
      <WrapperPage title="Guia de integração" breadcrumbs={[{ title: "Observabilidade", url: "/observability" }]}>
        <div className="space-y-6">
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <Skeleton className="h-[60px] w-full rounded-md" />
                <Skeleton className="h-[60px] w-full rounded-md" />
                <Skeleton className="h-[60px] w-full rounded-md" />
              </div>
              <Separator />
              <div className="space-y-2">
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-32 w-full rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-32 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </WrapperPage>
    );
  }

  if (isError || !data) {
    return (
      <WrapperPage title="Guia de integração" breadcrumbs={[{ title: "Observabilidade", url: "/observability" }]}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guia de Integração – Observabilidade</CardTitle>
              <CardDescription>Falha ao carregar as informações do webhook. Tente novamente.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </WrapperPage>
    );
  }

  const projectKey = data;
  const endpoint = `${env.VITE_BASE_API_URL}/webhooks/observability`;

  const curlSample = `
curl --location '${endpoint}' \\
--header 'Content-Type: application/json' \\
--data '{
  "projectId": "${projectId}",
  "projectKey": "${projectKey}",
  "level": "info",
  "Message": "Esta é uma mensagem de exemplo",
  "Name": "Observabilidade Exemplo",
  "Origin": "main.cpp",
  "Stack": {},
  "Stringified": {},
  "info": {
    "key": "value"
  }
}'`.trim();

  const tsSample = `import axios from "axios";

interface ObservabilityPayload {
  projectId: string;
  projectKey: string;
  level: "info" | "warning" | "error";
  Message: string;
  Name?: string;
  Origin?: string;
  Stack?: Record<string, unknown>;
  Stringified?: Record<string, unknown>;
  info?: Record<string, unknown>;
}

async function sendObservabilityLog() {
  const payload: ObservabilityPayload = {
    projectId: "${projectId}",
    projectKey: "${projectKey}",
    level: "info",
    Message: "Esta é uma mensagem de exemplo",
    Name: "Observabilidade Exemplo",
    Origin: "main.cpp",
    Stack: {},
    Stringified: {},
    info: { key: "value" }
  };

  await axios.post("${endpoint}", payload, {
    headers: { "Content-Type": "application/json" },
    timeout: 10_000
  });
}

sendObservabilityLog().catch(console.error);`.trim();

  return (
    <WrapperPage title="Guia de integração" breadcrumbs={[{ title: "Observabilidade", url: "/observability" }]}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Guia de Integração – Observabilidade</CardTitle>
            <CardDescription>Siga as instruções abaixo para enviar logs para o webhook do projeto.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoItem label="Project ID" value={projectId} />
              <InfoItem label="Project Key" value={projectKey} />
              <InfoItem label="Endpoint" value={endpoint} />
            </div>
            <Separator />
            <Section title="1) Monte o payload">
              <p className="text-muted-foreground text-sm">
                Campos mínimos: projectId, projectKey, level e Message. Níveis aceitos: info, warning, error.
              </p>
            </Section>
            <Section title="2) Envie via cURL">
              <CodeBlock
                code={curlSample}
                language="bash"
                onCopy={() => toast({ title: "Copiado", description: "cURL copiado para a área de transferência." })}
              />
            </Section>
            <Section title="3) Envie via TypeScript (axios)">
              <CodeBlock
                code={tsSample}
                language="ts"
                onCopy={() => toast({ title: "Copiado", description: "Exemplo TypeScript copiado." })}
              />
            </Section>
            <Section title="4) Verifique na UI">
              <p className="text-muted-foreground text-sm">
                Após o envio, os registros aparecerão na tabela de Observabilidade do projeto selecionado.
              </p>
            </Section>
          </CardContent>
        </Card>
      </div>
    </WrapperPage>
  );
}

function Section(props: Readonly<{ title: string; children?: React.ReactNode }>) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">{props.title}</h3>
      {props.children}
    </div>
  );
}

function InfoItem({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="truncate font-medium text-sm">{value}</div>
    </div>
  );
}

function CodeBlock({
  code,
  language = "bash",
  onCopy,
}: Readonly<{ code: string; language?: string; onCopy?: () => void }>) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      onCopy?.();
    } catch {
      // noop
    }
  }

  return (
    <div data-slot="code-block" className="relative rounded-lg border bg-muted/40">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-muted-foreground text-xs uppercase tracking-wide">{language}</span>
        <Button variant="outline" onClick={handleCopy}>
          Copiar
        </Button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
