import { WrapperPage } from "@/components/layout/wrapper-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function CreateProject() {
  return (
    <WrapperPage title="Criar Projeto" breadcrumbs={[{ title: "Home", url: "/home" }]}>
      <div>
        <h1 className="font-semibold text-[30px] text-lg">Criar Novo Projeto</h1>
        <p className="text-[16px] text-muted-foreground text-sm">
          Configure um novo projeto preenchendo as informações abaixo
        </p>
      </div>
      <div>
        <Card className="relative overflow-hidden border border-gray-200 text-black backdrop-blur-lg">
          <CardHeader className="pb-2">
            <div className="flex flex-col">
              <CardTitle className="font-semibold text-[20px] text-black">Informações Básicas</CardTitle>
              <p className="text-[16px] text-muted-foreground text-sm">
                Dados fundamentais do projeto para identificação e análise
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup>
                <FieldSet>
                  <Field>
                    <div>
                      <FieldLabel>Nome do projeto</FieldLabel>
                      <Input placeholder="Ex: E-commerce Portal" required />
                    </div>
                  </Field>
                </FieldSet>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </WrapperPage>
  );
}
