import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle, Save, Home } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Parametros() {
  const { data: params, isLoading: paramsLoading, refetch: refetchParams } = trpc.pricingParameters.getActive.useQuery();
  const createParamsMutation = trpc.pricingParameters.create.useMutation();
  const updateParamsMutation = trpc.pricingParameters.update.useMutation();

  const [formData, setFormData] = useState({
    monthlyFixedCosts: String(params?.monthlyFixedCosts || "5000"),
    monthlyProLabore: String(params?.monthlyProLabore || "7000"),
    productiveHoursPerMonth: String(params?.productiveHoursPerMonth || "160"),
    unexpectedMarginPercent: String(params?.unexpectedMarginPercent || "10"),
    taxMeiPercent: String(params?.taxMeiPercent || "0"),
    taxSimpleNationalPercent: String(params?.taxSimpleNationalPercent || "11"),
    taxAssumedProfitPercent: String(params?.taxAssumedProfitPercent || "14.5"),
    taxFreelancePercent: String(params?.taxFreelancePercent || "32.5"),
    volumeDiscount6To15Percent: String(params?.volumeDiscount6To15Percent || "12.5"),
    volumeDiscount16To30Percent: String(params?.volumeDiscount16To30Percent || "25"),
    volumeDiscount30PlusPercent: String(params?.volumeDiscount30PlusPercent || "37.5"),
    customizationAdjustmentMinPercent: String(params?.customizationAdjustmentMinPercent || "10"),
    customizationAdjustmentMaxPercent: String(params?.customizationAdjustmentMaxPercent || "25"),
    riskAdjustmentMinPercent: String(params?.riskAdjustmentMinPercent || "15"),
    riskAdjustmentMaxPercent: String(params?.riskAdjustmentMaxPercent || "30"),
    seniorityAdjustmentMinPercent: String(params?.seniorityAdjustmentMinPercent || "30"),
    seniorityAdjustmentMaxPercent: String(params?.seniorityAdjustmentMaxPercent || "50"),
  });

  const handleSave = async () => {
    try {
      if (params?.id) {
        await updateParamsMutation.mutateAsync({
          id: params.id,
          monthlyFixedCosts: parseFloat(formData.monthlyFixedCosts),
          monthlyProLabore: parseFloat(formData.monthlyProLabore),
          productiveHoursPerMonth: parseInt(formData.productiveHoursPerMonth),
          unexpectedMarginPercent: parseFloat(formData.unexpectedMarginPercent),
          taxMeiPercent: parseFloat(formData.taxMeiPercent),
          taxSimpleNationalPercent: parseFloat(formData.taxSimpleNationalPercent),
          taxAssumedProfitPercent: parseFloat(formData.taxAssumedProfitPercent),
          taxFreelancePercent: parseFloat(formData.taxFreelancePercent),
          volumeDiscount6To15Percent: parseFloat(formData.volumeDiscount6To15Percent),
          volumeDiscount16To30Percent: parseFloat(formData.volumeDiscount16To30Percent),
          volumeDiscount30PlusPercent: parseFloat(formData.volumeDiscount30PlusPercent),
          customizationAdjustmentMinPercent: parseFloat(formData.customizationAdjustmentMinPercent),
          customizationAdjustmentMaxPercent: parseFloat(formData.customizationAdjustmentMaxPercent),
          riskAdjustmentMinPercent: parseFloat(formData.riskAdjustmentMinPercent),
          riskAdjustmentMaxPercent: parseFloat(formData.riskAdjustmentMaxPercent),
          seniorityAdjustmentMinPercent: parseFloat(formData.seniorityAdjustmentMinPercent),
          seniorityAdjustmentMaxPercent: parseFloat(formData.seniorityAdjustmentMaxPercent),
        });
      } else {
        await createParamsMutation.mutateAsync({
          monthlyFixedCosts: parseFloat(formData.monthlyFixedCosts),
          monthlyProLabore: parseFloat(formData.monthlyProLabore),
          productiveHoursPerMonth: parseInt(formData.productiveHoursPerMonth),
          unexpectedMarginPercent: parseFloat(formData.unexpectedMarginPercent),
          taxMeiPercent: parseFloat(formData.taxMeiPercent),
          taxSimpleNationalPercent: parseFloat(formData.taxSimpleNationalPercent),
          taxAssumedProfitPercent: parseFloat(formData.taxAssumedProfitPercent),
          taxFreelancePercent: parseFloat(formData.taxFreelancePercent),
          volumeDiscount6To15Percent: parseFloat(formData.volumeDiscount6To15Percent),
          volumeDiscount16To30Percent: parseFloat(formData.volumeDiscount16To30Percent),
          volumeDiscount30PlusPercent: parseFloat(formData.volumeDiscount30PlusPercent),
          customizationAdjustmentMinPercent: parseFloat(formData.customizationAdjustmentMinPercent),
          customizationAdjustmentMaxPercent: parseFloat(formData.customizationAdjustmentMaxPercent),
          riskAdjustmentMinPercent: parseFloat(formData.riskAdjustmentMinPercent),
          riskAdjustmentMaxPercent: parseFloat(formData.riskAdjustmentMaxPercent),
          seniorityAdjustmentMinPercent: parseFloat(formData.seniorityAdjustmentMinPercent),
          seniorityAdjustmentMaxPercent: parseFloat(formData.seniorityAdjustmentMaxPercent),
          effectiveDate: new Date(),
        });
      }

      toast.success("Parâmetros salvos com sucesso!");
      refetchParams();
    } catch (error) {
      toast.error("Erro ao salvar parâmetros");
      console.error(error);
    }
  };

  if (paramsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="outline" size="sm" className="mb-4 gap-2">
          <Home className="w-4 h-4" />
          Voltar ao Dashboard
        </Button>
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Parâmetros de Precificação</h1>
        <p className="text-slate-600 mt-2">Configure as regras de cálculo da sua consultoria</p>
      </div>

      {!params ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Nenhum parâmetro configurado ainda</p>
            <p className="text-sm text-slate-500 mb-6">
              Crie um novo conjunto de parâmetros para começar
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="custos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="custos">Custos</TabsTrigger>
            <TabsTrigger value="impostos">Impostos</TabsTrigger>
            <TabsTrigger value="descontos">Descontos</TabsTrigger>
            <TabsTrigger value="ajustes">Ajustes</TabsTrigger>
          </TabsList>

          <TabsContent value="custos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Custos e Horas</CardTitle>
                <CardDescription>
                  Configure os custos fixos, pró-labore e horas produtivas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyFixedCosts">Custos Fixos Mensais (R$)</Label>
                    <Input
                      id="monthlyFixedCosts"
                      type="number"
                      step="0.01"
                      value={formData.monthlyFixedCosts}
                      onChange={(e) => setFormData({ ...formData, monthlyFixedCosts: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="monthlyProLabore">Pró-labore Mensal (R$)</Label>
                    <Input
                      id="monthlyProLabore"
                      type="number"
                      step="0.01"
                      value={formData.monthlyProLabore}
                      onChange={(e) => setFormData({ ...formData, monthlyProLabore: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="productiveHoursPerMonth">Horas Produtivas por Mês</Label>
                  <Input
                    id="productiveHoursPerMonth"
                    type="number"
                    value={formData.productiveHoursPerMonth}
                    onChange={(e) => setFormData({ ...formData, productiveHoursPerMonth: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="unexpectedMarginPercent">Margem para Imprevistos (%)</Label>
                  <Input
                    id="unexpectedMarginPercent"
                    type="number"
                    step="0.01"
                    value={formData.unexpectedMarginPercent}
                    onChange={(e) => setFormData({ ...formData, unexpectedMarginPercent: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impostos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Taxas por Regime Tributário</CardTitle>
                <CardDescription>
                  Configure as alíquotas de imposto para cada regime
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taxMeiPercent">MEI (%)</Label>
                    <Input
                      id="taxMeiPercent"
                      type="number"
                      step="0.01"
                      value={formData.taxMeiPercent}
                      onChange={(e) => setFormData({ ...formData, taxMeiPercent: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="taxSimpleNationalPercent">Simples Nacional (%)</Label>
                    <Input
                      id="taxSimpleNationalPercent"
                      type="number"
                      step="0.01"
                      value={formData.taxSimpleNationalPercent}
                      onChange={(e) => setFormData({ ...formData, taxSimpleNationalPercent: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="taxAssumedProfitPercent">Lucro Presumido (%)</Label>
                    <Input
                      id="taxAssumedProfitPercent"
                      type="number"
                      step="0.01"
                      value={formData.taxAssumedProfitPercent}
                      onChange={(e) => setFormData({ ...formData, taxAssumedProfitPercent: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="taxFreelancePercent">Autônomo (%)</Label>
                    <Input
                      id="taxFreelancePercent"
                      type="number"
                      step="0.01"
                      value={formData.taxFreelancePercent}
                      onChange={(e) => setFormData({ ...formData, taxFreelancePercent: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="descontos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Descontos por Volume</CardTitle>
                <CardDescription>
                  Configure os descontos aplicados conforme a quantidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="volumeDiscount6To15Percent">6-15 Unidades (%)</Label>
                    <Input
                      id="volumeDiscount6To15Percent"
                      type="number"
                      step="0.01"
                      value={formData.volumeDiscount6To15Percent}
                      onChange={(e) => setFormData({ ...formData, volumeDiscount6To15Percent: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="volumeDiscount16To30Percent">16-30 Unidades (%)</Label>
                    <Input
                      id="volumeDiscount16To30Percent"
                      type="number"
                      step="0.01"
                      value={formData.volumeDiscount16To30Percent}
                      onChange={(e) => setFormData({ ...formData, volumeDiscount16To30Percent: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="volumeDiscount30PlusPercent">30+ Unidades (%)</Label>
                    <Input
                      id="volumeDiscount30PlusPercent"
                      type="number"
                      step="0.01"
                      value={formData.volumeDiscount30PlusPercent}
                      onChange={(e) => setFormData({ ...formData, volumeDiscount30PlusPercent: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ajustes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ajustes de Personalização, Risco e Senioridade</CardTitle>
                <CardDescription>
                  Configure os percentuais mínimos e máximos para cada ajuste
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Personalização</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customizationAdjustmentMinPercent">Mínimo (%)</Label>
                      <Input
                        id="customizationAdjustmentMinPercent"
                        type="number"
                        step="0.01"
                        value={formData.customizationAdjustmentMinPercent}
                        onChange={(e) => setFormData({ ...formData, customizationAdjustmentMinPercent: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="customizationAdjustmentMaxPercent">Máximo (%)</Label>
                      <Input
                        id="customizationAdjustmentMaxPercent"
                        type="number"
                        step="0.01"
                        value={formData.customizationAdjustmentMaxPercent}
                        onChange={(e) => setFormData({ ...formData, customizationAdjustmentMaxPercent: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Risco</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="riskAdjustmentMinPercent">Mínimo (%)</Label>
                      <Input
                        id="riskAdjustmentMinPercent"
                        type="number"
                        step="0.01"
                        value={formData.riskAdjustmentMinPercent}
                        onChange={(e) => setFormData({ ...formData, riskAdjustmentMinPercent: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="riskAdjustmentMaxPercent">Máximo (%)</Label>
                      <Input
                        id="riskAdjustmentMaxPercent"
                        type="number"
                        step="0.01"
                        value={formData.riskAdjustmentMaxPercent}
                        onChange={(e) => setFormData({ ...formData, riskAdjustmentMaxPercent: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Senioridade</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="seniorityAdjustmentMinPercent">Mínimo (%)</Label>
                      <Input
                        id="seniorityAdjustmentMinPercent"
                        type="number"
                        step="0.01"
                        value={formData.seniorityAdjustmentMinPercent}
                        onChange={(e) => setFormData({ ...formData, seniorityAdjustmentMinPercent: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="seniorityAdjustmentMaxPercent">Máximo (%)</Label>
                      <Input
                        id="seniorityAdjustmentMaxPercent"
                        type="number"
                        step="0.01"
                        value={formData.seniorityAdjustmentMaxPercent}
                        onChange={(e) => setFormData({ ...formData, seniorityAdjustmentMaxPercent: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <div className="mt-8 flex gap-4">
        <Button
          onClick={handleSave}
          disabled={createParamsMutation.isPending || updateParamsMutation.isPending}
          size="lg"
          className="gap-2"
        >
          {createParamsMutation.isPending || updateParamsMutation.isPending ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Salvar Parâmetros
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
