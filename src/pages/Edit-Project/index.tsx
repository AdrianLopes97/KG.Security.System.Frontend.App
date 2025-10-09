import { WrapperPage } from "@/components/layout/wrapper-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useProjectById } from "@/hooks/use-project-by-id";
import type { UpdateProjectRequest } from "@/interfaces/projects/update-project.request";
import { updateProject } from "@/services/projects/update-project";
import { parseApiError } from "@/utils/parse-api-error";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useId, useState } from "react";
import { useNavigate, useParams } from "react-router";

export function EditProject() {
  const navigate = useNavigate();
  const { id = "" } = useParams();

  const nameId = useId();
  const dastId = useId();
  const githubId = useId();
  const hbId = useId();
  const timeoutId = useId();
  const slackId = useId();

  const [name, setName] = useState("");
  const [dastUrl, setDastUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [heartbeatSeconds, setHeartbeatSeconds] = useState<string>("");
  const [timeoutSeconds, setTimeoutSeconds] = useState<string>("");
  const [slackWebhook, setSlackWebhook] = useState("");
  const [monitoringId, setMonitoringId] = useState<string>("");

  const [nameError, setNameError] = useState<string | null>(null);
  const [dastUrlError, setDastUrlError] = useState<string | null>(null);
  const [githubUrlError, setGithubUrlError] = useState<string | null>(null);
  const [heartbeatSecondsError, setHeartbeatSecondsError] = useState<string | null>(null);
  const [timeoutSecondsError, setTimeoutSecondsError] = useState<string | null>(null);
  const [slackWebhookError, setSlackWebhookError] = useState<string | null>(null);

  function validateName(value: string) {
    const isValid = value.trim().length > 0;
    setNameError(isValid ? null : "Campo obrigatório");
    return isValid;
  }

  function validateOptionalUrl(value: string, setError: (msg: string | null) => void) {
    const trimmed = value.trim();
    if (!trimmed) {
      setError(null);
      return true;
    }
    try {
      const u = new URL(trimmed);
      const isHttp = u.protocol === "http:" || u.protocol === "https:";
      if (!isHttp) {
        setError("Informe uma URL válida (http/https)");
        return false;
      }
      setError(null);
      return true;
    } catch {
      setError("Informe uma URL válida (http/https)");
      return false;
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  const { data } = useProjectById(id);

  useEffect(() => {
    if (!data) return;
    setName(data.name ?? "");
    setGithubUrl(data.githubUrl ?? "");
    setDastUrl(data.systemUrl ?? "");

    if (data.monitoringRules) {
      setHeartbeatSeconds(String(data.monitoringRules.checkIntervalSeconds ?? ""));
      setTimeoutSeconds(String(data.monitoringRules.timeoutThresholdSeconds ?? ""));
      setSlackWebhook(data.monitoringRules.slackWebhookUrl ?? "");
      setMonitoringId(data.monitoringRules.id);
    } else {
      setHeartbeatSeconds("");
      setTimeoutSeconds("");
    }
  }, [data]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: UpdateProjectRequest) => updateProject(id, payload),
    onSuccess: () => {
      navigate("/home", { replace: true });
    },
    onError: (error) => {
      alert(parseApiError(error, "Erro ao atualizar projeto"));
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isNameOk = validateName(name);
    const isDastOk = validateOptionalUrl(dastUrl, setDastUrlError);
    const isGithubOk = validateOptionalUrl(githubUrl, setGithubUrlError);
    const isSlackFormatOk = validateOptionalUrl(slackWebhook, setSlackWebhookError);

    if (!isNameOk || !isDastOk || !isGithubOk || !isSlackFormatOk) {
      return;
    }

    const hb = Number.parseInt(heartbeatSeconds || "0", 10) || 0;
    const to = Number.parseInt(timeoutSeconds || "0", 10) || 0;
    const slack = slackWebhook.trim();

    const anyMonitoringFilled = hb > 0 || to > 0 || slack.length > 0;

    setHeartbeatSecondsError(null);
    setTimeoutSecondsError(null);

    let monitoringRules: UpdateProjectRequest["monitoringRules"] = null;
    let monitoringIsValid = true;

    if (anyMonitoringFilled) {
      if (hb <= 0) {
        setHeartbeatSecondsError("Campo obrigatório");
        monitoringIsValid = false;
      }
      if (to <= 0) {
        setTimeoutSecondsError("Campo obrigatório");
        monitoringIsValid = false;
      }
      if (!slack) {
        setSlackWebhookError("Campo obrigatório");
        monitoringIsValid = false;
      } else if (!validateOptionalUrl(slack, setSlackWebhookError)) {
        monitoringIsValid = false;
      }

      if (monitoringIsValid) {
        monitoringRules = {
          id: monitoringId,
          checkIntervalSeconds: hb,
          timeoutThresholdSeconds: to,
          slackWebhookUrl: slack,
          isActive: true,
        };
      }
    }

    if (!monitoringIsValid) return;

    const payload: UpdateProjectRequest = {
      name: name.trim(),
      systemUrl: dastUrl.trim() || null,
      githubUrl: githubUrl.trim() || null,
      monitoringRules,
    };

    await mutateAsync(payload);
  }

  return (
    <WrapperPage title="Editar Projeto" breadcrumbs={[{ title: "Home", url: "/home" }]}>
      <div>
        <h1 className="font-semibold text-[30px] text-lg">Editar Projeto</h1>
        <p className="text-[16px] text-muted-foreground text-sm">Atualize as informações do projeto</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Card className="relative overflow-hidden border border-gray-200 text-black backdrop-blur-lg">
          <CardHeader className="pb-2">
            <div className="flex flex-col">
              <CardTitle className="font-semibold text-[20px] text-black">Informações Básicas</CardTitle>
              <p className="text-[16px] text-muted-foreground text-sm">Dados fundamentais do projeto</p>
            </div>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FieldSet>
                <Field data-invalid={!!nameError}>
                  <FieldLabel htmlFor={nameId}>Nome do Projeto</FieldLabel>
                  <Input
                    id={nameId}
                    placeholder="Ex: E-commerce Portal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={(e) => validateName(e.target.value)}
                    required
                    aria-invalid={!!nameError}
                  />
                  <FieldError errors={nameError ? [{ message: nameError }] : undefined} />
                </Field>

                <Field data-invalid={!!dastUrlError}>
                  <FieldLabel htmlFor={dastId}>URL do Sistema para Análise DAST</FieldLabel>
                  <Input
                    id={dastId}
                    type="url"
                    placeholder="https://meuapp.com"
                    value={dastUrl}
                    onChange={(e) => {
                      setDastUrl(e.target.value);
                      if (dastUrlError) validateOptionalUrl(e.target.value, setDastUrlError);
                    }}
                    onBlur={(e) => validateOptionalUrl(e.target.value, setDastUrlError)}
                    aria-invalid={!!dastUrlError}
                  />
                  <FieldError errors={dastUrlError ? [{ message: dastUrlError }] : undefined} />
                </Field>

                <Field data-invalid={!!githubUrlError}>
                  <FieldLabel htmlFor={githubId}>URL do Repositório GitHub Público</FieldLabel>
                  <Input
                    id={githubId}
                    type="url"
                    placeholder="https://github.com/usuario/projeto"
                    value={githubUrl}
                    onChange={(e) => {
                      setGithubUrl(e.target.value);
                      if (githubUrlError) validateOptionalUrl(e.target.value, setGithubUrlError);
                    }}
                    onBlur={(e) => validateOptionalUrl(e.target.value, setGithubUrlError)}
                    aria-invalid={!!githubUrlError}
                  />
                  <FieldError errors={githubUrlError ? [{ message: githubUrlError }] : undefined} />
                </Field>
              </FieldSet>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-gray-200 text-black backdrop-blur-lg">
          <CardHeader className="pb-2">
            <div className="flex flex-col">
              <CardTitle className="font-semibold text-[20px] text-black">Regras de Monitoramento</CardTitle>
              <p className="text-[16px] text-muted-foreground text-sm">
                Configure os parâmetros de monitoramento e notificações
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FieldSet>
                <Field data-invalid={!!heartbeatSecondsError}>
                  <FieldLabel htmlFor={hbId}>Tempo de Checagem de Heartbeats (segundos)</FieldLabel>
                  <Input
                    id={hbId}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="30"
                    value={heartbeatSeconds}
                    onChange={(e) => {
                      setHeartbeatSeconds(e.target.value);
                      if (heartbeatSecondsError) setHeartbeatSecondsError(null);
                    }}
                  />
                  <FieldError errors={heartbeatSecondsError ? [{ message: heartbeatSecondsError }] : undefined} />
                </Field>

                <Field data-invalid={!!timeoutSecondsError}>
                  <FieldLabel htmlFor={timeoutId}>Timeout para Considerar Queda (segundos)</FieldLabel>
                  <Input
                    id={timeoutId}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    step={1}
                    placeholder="120"
                    value={timeoutSeconds}
                    onChange={(e) => {
                      setTimeoutSeconds(e.target.value);
                      if (timeoutSecondsError) setTimeoutSecondsError(null);
                    }}
                  />
                  <FieldError errors={timeoutSecondsError ? [{ message: timeoutSecondsError }] : undefined} />
                </Field>

                <Field data-invalid={!!slackWebhookError}>
                  <FieldLabel htmlFor={slackId}>URL de Webhook do Slack</FieldLabel>
                  <Input
                    id={slackId}
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={slackWebhook}
                    onChange={(e) => {
                      setSlackWebhook(e.target.value);
                      if (slackWebhookError) validateOptionalUrl(e.target.value, setSlackWebhookError);
                    }}
                    onBlur={(e) => validateOptionalUrl(e.target.value, setSlackWebhookError)}
                    aria-invalid={!!slackWebhookError}
                  />
                  <FieldError errors={slackWebhookError ? [{ message: slackWebhookError }] : undefined} />
                </Field>
              </FieldSet>
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="brand" className="opacity-50" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="brand" type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </WrapperPage>
  );
}
