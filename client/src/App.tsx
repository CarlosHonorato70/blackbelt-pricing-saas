import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Propostas from "./pages/Propostas";
import Clientes from "./pages/Clientes";
import Servicos from "./pages/Servicos";
import Parametros from "./pages/Parametros";
import PropostaDetalhes from "./pages/PropostaDetalhes";
import NovaPropostaForm from "./pages/NovaPropostaForm";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/propostas" component={Propostas} />
      <Route path="/nova-proposta" component={NovaPropostaForm} />
      <Route path="/propostas/:id" component={PropostaDetalhes} />
      <Route path="/clientes" component={Clientes} />
      <Route path="/servicos" component={Servicos} />
      <Route path="/parametros" component={Parametros} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
