import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { BarChart3, Users, Settings, FileText, Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-16 mx-auto mb-4" />}
            <h1 className="text-4xl font-bold text-white mb-2">{APP_TITLE}</h1>
            <p className="text-xl text-slate-300">Sistema de Precificação e Propostas Comerciais</p>
          </div>

          <p className="text-slate-400 mb-8 text-lg">
            Automatize a precificação de seus serviços e gere propostas profissionais em minutos.
          </p>

          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
          >
            Entrar com Manus
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Bem-vindo, {user?.name || "Usuário"}!
          </h1>
          <p className="text-slate-600 mt-2">
            Gerencie seus serviços, clientes e propostas comerciais
          </p>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/propostas">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Propostas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Crie e gerencie propostas comerciais
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/clientes">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Gerencie seus clientes
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/servicos">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Serviços
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Cadastre e organize serviços
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/parametros">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-orange-600" />
                  Parâmetros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Configure regras de precificação
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre o Sistema</CardTitle>
              <CardDescription>
                Funcionalidades principais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>✓ Cálculo automático de Hora Técnica</p>
              <p>✓ Descontos por volume configuráveis</p>
              <p>✓ Ajustes de personalização, risco e senioridade</p>
              <p>✓ Geração de propostas em PDF</p>
              <p>✓ Gerenciamento completo de clientes e serviços</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Começar</CardTitle>
              <CardDescription>
                Próximos passos recomendados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-semibold text-slate-900 mb-1">1. Configure os Parâmetros</p>
                <p className="text-slate-600">Defina custos fixos, pró-labore e taxas tributárias</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-900 mb-1">2. Cadastre Serviços</p>
                <p className="text-slate-600">Adicione os serviços que sua consultoria oferece</p>
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-900 mb-1">3. Crie Propostas</p>
                <p className="text-slate-600">Gere propostas automáticas com cálculos precisos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
