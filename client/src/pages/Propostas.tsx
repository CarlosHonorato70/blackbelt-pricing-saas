import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Plus, FileText, Loader2, AlertCircle, Home } from "lucide-react";
import { useState } from "react";

export default function Propostas() {
  const { user } = useAuth();

  const { data: proposals, isLoading: proposalsLoading } = trpc.proposals.list.useQuery();

  if (proposalsLoading) {
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

        <Link href="/nova-proposta">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nova Proposta
          </Button>
        </Link>
      </div>

      {!proposals || proposals.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Nenhuma proposta criada ainda</p>
            <Link href="/nova-proposta">
              <Button variant="outline">Criar primeira proposta</Button>
            </Link>
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
                      <p className="text-sm text-slate-600 mt-1">
                        {new Date(proposal.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {proposal.taxRegime}
                      </p>
                      <p className="text-xs text-slate-500">
                        Status: <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">{proposal.status || "draft"}</span>
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">
                    Validade: {proposal.validityDays} dias
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
