import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { Loader2, Home, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function NovaPropostaForm() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    clientId: "",
    proposalNumber: "",
    validityDays: "30",
    taxRegime: "Lucro Presumido",
    discountPercent: "0",
    travelFee: "0",
    notes: "",
  });

  const { data: clients, isLoading: clientsLoading } = trpc.clients.list.useQuery();
  const createProposalMutation = trpc.proposals.create.useMutation();

  const handleCreateProposal = async () => {
    if (!formData.clientId || !formData.proposalNumber) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      const result = await createProposalMutation.mutateAsync({
        clientId: parseInt(formData.clientId),
        proposalNumber: formData.proposalNumber,
        proposalDate: new Date(),
        validityDays: parseInt(formData.validityDays),
        taxRegime: formData.taxRegime,
        discountPercent: parseFloat(formData.discountPercent) || 0,
        travelFee: parseFloat(formData.travelFee) || 0,
        notes: formData.notes,
      });

      toast.success("Proposta criada com sucesso!");
      if (result && typeof result === 'object' && 'id' in result) {
        navigate(`/propostas/${(result as any).id}`);
      } else {
        navigate("/propostas");
      }
    } catch (error) {
      toast.error("Erro ao criar proposta");
      console.error(error);
    }
  };

  if (clientsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/propostas">
        <Button variant="outline" size="sm" className="mb-4 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Criar Nova Proposta</CardTitle>
          <CardDescription>
            Preencha os dados básicos da proposta comercial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Label htmlFor="clientId">Cliente *</Label>
              <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="proposalNumber">Número da Proposta *</Label>
              <Input
                id="proposalNumber"
                placeholder="ex: PROP-2025-001"
                value={formData.proposalNumber}
                onChange={(e) => setFormData({ ...formData, proposalNumber: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validityDays">Dias de Validade</Label>
                <Input
                  id="validityDays"
                  type="number"
                  value={formData.validityDays}
                  onChange={(e) => setFormData({ ...formData, validityDays: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="taxRegime">Regime Tributário</Label>
                <Select value={formData.taxRegime} onValueChange={(value) => setFormData({ ...formData, taxRegime: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEI">MEI</SelectItem>
                    <SelectItem value="Simples">Simples Nacional</SelectItem>
                    <SelectItem value="Lucro Presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="Autônomo">Autônomo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountPercent">Desconto (%)</Label>
                <Input
                  id="discountPercent"
                  type="number"
                  step="0.01"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="travelFee">Taxa Deslocamento (R$)</Label>
                <Input
                  id="travelFee"
                  type="number"
                  step="0.01"
                  value={formData.travelFee}
                  onChange={(e) => setFormData({ ...formData, travelFee: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                placeholder="Notas adicionais..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleCreateProposal}
                disabled={createProposalMutation.isPending}
                className="flex-1"
              >
                {createProposalMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    Criando...
                  </>
                ) : (
                  "Criar Proposta"
                )}
              </Button>
              <Link href="/propostas">
                <Button variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
