import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Plus, FileText, Loader2, AlertCircle, Home } from "lucide-react";
import { toast } from "sonner";

export default function Propostas() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    proposalNumber: "",
    validityDays: "30",
    taxRegime: "Lucro Presumido",
    discountPercent: "0",
    travelFee: "0",
    notes: "",
  });

  const { data: proposals, isLoading: proposalsLoading, refetch: refetchProposals } = trpc.proposals.list.useQuery();
  const { data: clients, isLoading: clientsLoading } = trpc.clients.list.useQuery();
  const createProposalMutation = trpc.proposals.create.useMutation();

  const handleCreateProposal = async () => {
    if (!formData.clientId || !formData.proposalNumber) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      await createProposalMutation.mutateAsync({
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
      setIsOpen(false);
      setFormData({
        clientId: "",
        proposalNumber: "",
        validityDays: "30",
        taxRegime: "Lucro Presumido",
        discountPercent: "0",
        travelFee: "0",
        notes: "",
      });
      refetchProposals();
    } catch (error) {
      toast.error("Erro ao criar proposta");
      console.error(error);
    }
  };

  if (proposalsLoading || clientsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="outline" size="sm" className="mb-4 gap-2">
          <Home className="w-4 h-4" />
          Voltar ao Dashboard
        </Button>
      </Link>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Propostas Comerciais</h1>
          <p className="text-slate-600 mt-2">Crie e gerencie suas propostas</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Proposta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Proposta</DialogTitle>
              <DialogDescription>
                Preencha os dados básicos da proposta
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
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
                  rows={3}
                />
              </div>

              <Button
                onClick={handleCreateProposal}
                disabled={createProposalMutation.isPending}
                className="w-full"
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
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!proposals || proposals.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Nenhuma proposta criada ainda</p>
            <Button variant="outline">Criar primeira proposta</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <Link key={proposal.id} href={`/propostas/${proposal.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        {proposal.proposalNumber}
                      </CardTitle>
                      <CardDescription>
                        Criada em {new Date(proposal.createdAt).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      proposal.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                      proposal.status === "sent" ? "bg-blue-100 text-blue-800" :
                      proposal.status === "accepted" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {proposal.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">Regime Tributário</p>
                      <p className="font-semibold text-slate-900">{proposal.taxRegime}</p>
                    </div>
                    <div>
                      <p className="text-slate-600">Valor Total</p>
                      <p className="font-semibold text-slate-900">
                        R$ {parseFloat(proposal.totalValue).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
