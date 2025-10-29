import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus, Loader2, AlertCircle, Trash2, FileDown, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function PropostaDetalhes() {
  const [, params] = useRoute("/propostas/:id");
  const [, navigate] = useLocation();
  const proposalId = params?.id ? parseInt(params.id) : null;

  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [itemForm, setItemForm] = useState({
    serviceId: "",
    quantity: "1",
    estimatedHours: "",
    customizationAdjustment: "0",
    riskAdjustment: "0",
    seniorityAdjustment: "0",
  });

  const { data: proposal, isLoading: proposalLoading, refetch: refetchProposal } = trpc.proposals.get.useQuery(
    { id: proposalId! },
    { enabled: !!proposalId }
  );

  const { data: services } = trpc.services.list.useQuery();
  const { data: pricingParams } = trpc.pricingParameters.getActive.useQuery();

  const createItemMutation = trpc.proposalItems.create.useMutation();
  const deleteItemMutation = trpc.proposalItems.delete.useMutation();
  const updateProposalMutation = trpc.proposals.update.useMutation();
  const generatePdfMutation = trpc.proposalPdf.generate.useMutation();

  const { data: itemCalculation, isLoading: calculationLoading } = trpc.pricing.calculateItemValue.useQuery(
    {
      serviceId: itemForm.serviceId ? parseInt(itemForm.serviceId) : 0,
      quantity: parseInt(itemForm.quantity) || 1,
      estimatedHours: itemForm.estimatedHours ? parseFloat(itemForm.estimatedHours) : undefined,
      taxRegime: proposal?.taxRegime || "Lucro Presumido",
      customizationAdjustment: parseFloat(itemForm.customizationAdjustment) || 0,
      riskAdjustment: parseFloat(itemForm.riskAdjustment) || 0,
      seniorityAdjustment: parseFloat(itemForm.seniorityAdjustment) || 0,
    },
    { enabled: !!itemForm.serviceId && !!proposal }
  );

  const handleAddItem = async () => {
    if (!itemForm.serviceId || !itemCalculation) {
      toast.error("Selecione um serviço e preencha os dados");
      return;
    }

    try {
      await createItemMutation.mutateAsync({
        proposalId: proposalId!,
        serviceId: parseInt(itemForm.serviceId),
        quantity: parseInt(itemForm.quantity),
        estimatedHours: itemForm.estimatedHours ? parseFloat(itemForm.estimatedHours) : undefined,
        unitValue: itemCalculation.unitValue,
        volumeDiscount: itemCalculation.volumeDiscount,
        customizationAdjustment: parseFloat(itemForm.customizationAdjustment) || 0,
        riskAdjustment: parseFloat(itemForm.riskAdjustment) || 0,
        seniorityAdjustment: parseFloat(itemForm.seniorityAdjustment) || 0,
        itemTotal: itemCalculation.itemTotal,
      });

      toast.success("Item adicionado com sucesso!");
      setIsAddItemOpen(false);
      setItemForm({
        serviceId: "",
        quantity: "1",
        estimatedHours: "",
        customizationAdjustment: "0",
        riskAdjustment: "0",
        seniorityAdjustment: "0",
      });

      refetchProposal();

      // Atualizar total da proposta
      if (proposal?.items) {
        const newTotal = proposal.items.reduce((sum, item) => sum + parseFloat(item.itemTotal), 0) + itemCalculation.itemTotal;
        await updateProposalMutation.mutateAsync({
          id: proposalId!,
          totalValue: newTotal - (parseFloat(proposal.discountPercent || "0") / 100) * newTotal + parseFloat(proposal.travelFee || "0"),
        });
      }
    } catch (error) {
      toast.error("Erro ao adicionar item");
      console.error(error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("Tem certeza que deseja deletar este item?")) return;

    try {
      await deleteItemMutation.mutateAsync({ id: itemId });
      toast.success("Item deletado com sucesso!");
      refetchProposal();
    } catch (error) {
      toast.error("Erro ao deletar item");
      console.error(error);
    }
  };

  if (proposalLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">Proposta não encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalItems = proposal.items?.reduce((sum, item) => sum + parseFloat(item.itemTotal), 0) || 0;
  const discountAmount = (parseFloat(proposal.discountPercent || "0") / 100) * totalItems;
  const finalTotal = totalItems - discountAmount + parseFloat(proposal.travelFee || "0");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate("/propostas")}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{proposal.proposalNumber}</h1>
        <p className="text-slate-600 mt-2">
          Criada em {new Date(proposal.createdAt).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Regime Tributário</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">{proposal.taxRegime}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Validade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">{proposal.validityDays} dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              proposal.status === "draft" ? "bg-yellow-100 text-yellow-800" :
              proposal.status === "sent" ? "bg-blue-100 text-blue-800" :
              proposal.status === "accepted" ? "bg-green-100 text-green-800" :
              "bg-red-100 text-red-800"
            }`}>
              {proposal.status}
            </span>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Itens da Proposta</CardTitle>
              <CardDescription>
                Adicione serviços à proposta
              </CardDescription>
            </div>

            <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Adicionar Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Item à Proposta</DialogTitle>
                  <DialogDescription>
                    Selecione um serviço e configure os parâmetros
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="serviceId">Serviço *</Label>
                    <Select value={itemForm.serviceId} onValueChange={(value) => setItemForm({ ...itemForm, serviceId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {services?.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">Quantidade</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={itemForm.quantity}
                        onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="estimatedHours">Horas Estimadas</Label>
                      <Input
                        id="estimatedHours"
                        type="number"
                        step="0.5"
                        value={itemForm.estimatedHours}
                        onChange={(e) => setItemForm({ ...itemForm, estimatedHours: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="customizationAdjustment">Personalização (%)</Label>
                      <Input
                        id="customizationAdjustment"
                        type="number"
                        step="0.01"
                        value={itemForm.customizationAdjustment}
                        onChange={(e) => setItemForm({ ...itemForm, customizationAdjustment: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="riskAdjustment">Risco (%)</Label>
                      <Input
                        id="riskAdjustment"
                        type="number"
                        step="0.01"
                        value={itemForm.riskAdjustment}
                        onChange={(e) => setItemForm({ ...itemForm, riskAdjustment: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="seniorityAdjustment">Senioridade (%)</Label>
                      <Input
                        id="seniorityAdjustment"
                        type="number"
                        step="0.01"
                        value={itemForm.seniorityAdjustment}
                        onChange={(e) => setItemForm({ ...itemForm, seniorityAdjustment: e.target.value })}
                      />
                    </div>
                  </div>

                  {itemCalculation && (
                    <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Valor Unitário:</span>
                        <span className="font-semibold">
                          R$ {Number(itemCalculation.unitValue).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Desconto Volume:</span>
                        <span className="font-semibold">{Number(itemCalculation.volumeDiscount).toFixed(2)}%</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="text-slate-900 font-semibold">Total do Item:</span>
                        <span className="text-lg font-bold text-blue-600">
                          R$ {Number(itemCalculation.itemTotal).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleAddItem}
                    disabled={createItemMutation.isPending || !itemCalculation}
                    className="w-full"
                  >
                    {createItemMutation.isPending ? (
                      <>
                        <Loader2 className="animate-spin mr-2 w-4 h-4" />
                        Adicionando...
                      </>
                    ) : (
                      "Adicionar Item"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {!proposal.items || proposal.items.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600">Nenhum item adicionado ainda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead className="text-right">Qtd</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead className="text-right">Desconto</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposal.items.map((item) => {
                    const service = services?.find((s) => s.id === item.serviceId);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{service?.name || "Serviço"}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          R$ {Number(item.unitValue || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">{Number(item.volumeDiscount || 0).toFixed(2)}%</TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ {Number(item.itemTotal || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={deleteItemMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-lg">
            <span>Subtotal:</span>
            <span className="font-semibold">
              R$ {totalItems.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          {parseFloat(proposal.discountPercent || "0") > 0 && (
            <div className="flex justify-between text-lg text-red-600">
              <span>Desconto ({proposal.discountPercent || "0"}%):</span>
              <span className="font-semibold">
                -R$ {discountAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {parseFloat(proposal.travelFee || "0") > 0 && (
            <div className="flex justify-between text-lg">
              <span>Taxa de Deslocamento:</span>
              <span className="font-semibold">
                R$ {parseFloat(proposal.travelFee || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}

          <div className="border-t pt-4 flex justify-between text-2xl">
            <span className="font-bold">Total:</span>
            <span className="font-bold text-blue-600">
              R$ {finalTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex gap-4">
        <Button
          variant="outline"
          className="gap-2"
          onClick={async () => {
            try {
              const result = await generatePdfMutation.mutateAsync({ proposalId: proposalId! });
              const blob = new Blob([result.html], { type: "text/html;charset=utf-8" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = `${result.proposalNumber}.html`;
              link.click();
              URL.revokeObjectURL(link.href);
              toast.success("Proposta gerada com sucesso!");
            } catch (error) {
              toast.error("Erro ao gerar proposta");
              console.error(error);
            }
          }}
          disabled={generatePdfMutation.isPending}
        >
          {generatePdfMutation.isPending ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Gerando...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              Gerar Proposta
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
