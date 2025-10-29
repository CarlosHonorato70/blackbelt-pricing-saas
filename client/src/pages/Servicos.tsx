import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Plus, BarChart3, Loader2, AlertCircle, Trash2, Home } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useState } from "react";

const CATEGORIES = [
  "Avaliação",
  "Pacote",
  "Treinamento",
  "Consultoria",
  "Avaliação Organizacional",
  "Retainer",
  "Mentoria",
  "Auditoria",
];

const UNITS = ["Pessoa", "Projeto", "Evento", "Mês", "Hora"];

export default function Servicos() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "Consultoria",
    name: "",
    description: "",
    unit: "Projeto",
    minValue: "",
    maxValue: "",
    notes: "",
  });

  const { data: services, isLoading: servicesLoading, refetch: refetchServices } = trpc.services.list.useQuery();
  const createServiceMutation = trpc.services.create.useMutation();
  const deleteServiceMutation = trpc.services.delete.useMutation();

  const handleCreateService = async () => {
    if (!formData.name) {
      toast.error("Nome do serviço é obrigatório");
      return;
    }

    try {
      await createServiceMutation.mutateAsync({
        category: formData.category,
        name: formData.name,
        description: formData.description || undefined,
        unit: formData.unit,
        minValue: formData.minValue ? parseFloat(formData.minValue) : undefined,
        maxValue: formData.maxValue ? parseFloat(formData.maxValue) : undefined,
        notes: formData.notes || undefined,
      });

      toast.success("Serviço criado com sucesso!");
      setShowForm(false);
      setFormData({
        category: "Consultoria",
        name: "",
        description: "",
        unit: "Projeto",
        minValue: "",
        maxValue: "",
        notes: "",
      });
      refetchServices();
    } catch (error) {
      toast.error("Erro ao criar serviço");
      console.error(error);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este serviço?")) return;

    try {
      await deleteServiceMutation.mutateAsync({ id });
      toast.success("Serviço deletado com sucesso!");
      refetchServices();
    } catch (error) {
      toast.error("Erro ao deletar serviço");
      console.error(error);
    }
  };

  if (servicesLoading) {
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
          <h1 className="text-3xl font-bold text-slate-900">Serviços</h1>
          <p className="text-slate-600 mt-2">Cadastre e organize seus serviços</p>
        </div>

        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Serviço
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Novo Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="unit">Unidade</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="name">Nome do Serviço *</Label>
                <Input
                  id="name"
                  placeholder="ex: Consultoria Estratégica"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o serviço..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minValue">Valor Mínimo (R$)</Label>
                  <Input
                    id="minValue"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.minValue}
                    onChange={(e) => setFormData({ ...formData, minValue: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="maxValue">Valor Máximo (R$)</Label>
                  <Input
                    id="maxValue"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.maxValue}
                    onChange={(e) => setFormData({ ...formData, maxValue: e.target.value })}
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

              <div className="flex gap-4">
                <Button
                  onClick={handleCreateService}
                  disabled={createServiceMutation.isPending}
                  className="flex-1"
                >
                  {createServiceMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin mr-2 w-4 h-4" />
                      Criando...
                    </>
                  ) : (
                    "Criar Serviço"
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!services || services.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Nenhum serviço cadastrado ainda</p>
            <Button variant="outline" onClick={() => setShowForm(true)}>
              Cadastrar primeiro serviço
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      {service.name}
                    </CardTitle>
                    <p className="text-sm text-slate-600 mt-1">
                      {service.category} • {service.unit}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 space-y-1">
                {service.description && <p>{service.description}</p>}
                <p>
                  Faixa de Preço: R$ {service.minValue || '0.00'} - R$ {service.maxValue || '0.00'}
                </p>
                {service.notes && <p className="text-slate-500">Notas: {service.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
