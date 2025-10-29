import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Plus, Users, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Clientes() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    cnpj: "",
    cnae: "",
    companySize: "Pequena",
    numberOfEmployees: "",
    address: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const { data: clients, isLoading: clientsLoading, refetch: refetchClients } = trpc.clients.list.useQuery();
  const createClientMutation = trpc.clients.create.useMutation();
  const deleteClientMutation = trpc.clients.delete.useMutation();

  const handleCreateClient = async () => {
    if (!formData.companyName) {
      toast.error("Nome da empresa é obrigatório");
      return;
    }

    try {
      await createClientMutation.mutateAsync({
        companyName: formData.companyName,
        cnpj: formData.cnpj || undefined,
        cnae: formData.cnae || undefined,
        companySize: formData.companySize,
        numberOfEmployees: formData.numberOfEmployees ? parseInt(formData.numberOfEmployees) : undefined,
        address: formData.address || undefined,
        contactName: formData.contactName || undefined,
        contactEmail: formData.contactEmail || undefined,
        contactPhone: formData.contactPhone || undefined,
      });

      toast.success("Cliente criado com sucesso!");
      setIsOpen(false);
      setFormData({
        companyName: "",
        cnpj: "",
        cnae: "",
        companySize: "Pequena",
        numberOfEmployees: "",
        address: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
      });
      refetchClients();
    } catch (error) {
      toast.error("Erro ao criar cliente");
      console.error(error);
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este cliente?")) return;

    try {
      await deleteClientMutation.mutateAsync({ id });
      toast.success("Cliente deletado com sucesso!");
      refetchClients();
    } catch (error) {
      toast.error("Erro ao deletar cliente");
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600 mt-2">Gerencie seus clientes</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha os dados do cliente
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  placeholder="ex: Empresa LTDA"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    placeholder="ex: 12.345.678/0001-90"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="cnae">CNAE</Label>
                  <Input
                    id="cnae"
                    placeholder="ex: 6209-1/00"
                    value={formData.cnae}
                    onChange={(e) => setFormData({ ...formData, cnae: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companySize">Porte da Empresa</Label>
                  <Select value={formData.companySize} onValueChange={(value) => setFormData({ ...formData, companySize: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Micro">Micro (até 19)</SelectItem>
                      <SelectItem value="Pequena">Pequena (20-99)</SelectItem>
                      <SelectItem value="Média">Média (100-499)</SelectItem>
                      <SelectItem value="Grande">Grande (500+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="numberOfEmployees">Número de Colaboradores</Label>
                  <Input
                    id="numberOfEmployees"
                    type="number"
                    value={formData.numberOfEmployees}
                    onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Textarea
                  id="address"
                  placeholder="Endereço completo..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="contactName">Nome do Contato</Label>
                <Input
                  id="contactName"
                  placeholder="ex: João Silva"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Telefone</Label>
                  <Input
                    id="contactPhone"
                    placeholder="(11) 99999-9999"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
              </div>

              <Button
                onClick={handleCreateClient}
                disabled={createClientMutation.isPending}
                className="w-full"
              >
                {createClientMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 w-4 h-4" />
                    Criando...
                  </>
                ) : (
                  "Criar Cliente"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!clients || clients.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Nenhum cliente cadastrado ainda</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      {client.companyName}
                    </CardTitle>
                    <CardDescription>
                      {client.cnpj && `CNPJ: ${client.cnpj}`}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClient(client.id)}
                    disabled={deleteClientMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {client.companySize && (
                    <div>
                      <p className="text-slate-600">Porte</p>
                      <p className="font-semibold text-slate-900">{client.companySize}</p>
                    </div>
                  )}
                  {client.numberOfEmployees && (
                    <div>
                      <p className="text-slate-600">Colaboradores</p>
                      <p className="font-semibold text-slate-900">{client.numberOfEmployees}</p>
                    </div>
                  )}
                  {client.contactName && (
                    <div>
                      <p className="text-slate-600">Contato</p>
                      <p className="font-semibold text-slate-900">{client.contactName}</p>
                    </div>
                  )}
                  {client.contactEmail && (
                    <div>
                      <p className="text-slate-600">Email</p>
                      <p className="font-semibold text-slate-900 truncate">{client.contactEmail}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
