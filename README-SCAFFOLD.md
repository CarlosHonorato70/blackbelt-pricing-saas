# Black Belt Pricing SaaS - Project Scaffold

Sistema SaaS completo de precificação para Black Belt Consultoria com cálculos automáticos de Hora Técnica, descontos por volume e geração de propostas comerciais.

## 📁 Estrutura do Projeto

```
blackbelt-pricing-saas/
├── backend/                 # Backend API (Node.js + Express + tRPC)
│   ├── src/
│   │   ├── database/       # Database configuration and schema
│   │   ├── trpc/           # tRPC routers and configuration
│   │   ├── utils/          # Utility functions (calculations)
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local          # Environment variables
│
├── frontend/               # Frontend Application (React + TypeScript)
│   ├── src/
│   │   └── App.tsx         # Main application component
│   └── package.json
│
├── streamlit/              # Streamlit Dashboard Application
│   ├── app.py              # Main Streamlit app
│   ├── requirements.txt    # Python dependencies
│   └── config.yaml         # Streamlit configuration
│
├── client/                 # Existing client application
├── server/                 # Existing server application
└── README.md
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ (para backend e frontend)
- Python 3.9+ (para streamlit)
- MySQL 8.0+ (banco de dados)
- npm ou pnpm (gerenciador de pacotes Node.js)

### 1. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.local .env.local
# Edite .env.local com suas credenciais do MySQL

# Compilar TypeScript
npm run build

# Iniciar servidor de desenvolvimento
npm run dev
```

O backend estará disponível em `http://localhost:3001`

### 2. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

### 3. Configurar Streamlit

```bash
cd streamlit

# Criar ambiente virtual Python (recomendado)
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar aplicação Streamlit
streamlit run app.py
```

O Streamlit estará disponível em `http://localhost:8501`

## 🗄️ Configuração do Banco de Dados

O schema do banco de dados está definido em `backend/src/database/schema.ts` e inclui as seguintes tabelas:

- **users** - Usuários da plataforma
- **clients** - Clientes cadastrados
- **services** - Serviços oferecidos
- **pricing_parameters** - Parâmetros de precificação
- **proposals** - Propostas comerciais
- **proposal_items** - Itens das propostas
- **risk_assessments** - Avaliações de risco (NR-01)
- **audit_logs** - Logs de auditoria

### Criar o Banco de Dados

```sql
CREATE DATABASE blackbelt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Configurar DATABASE_URL

No arquivo `backend/.env.local`:

```env
DATABASE_URL=mysql://usuario:senha@localhost:3306/blackbelt
```

## 📚 API Endpoints (tRPC)

### Pricing Router

- `pricing.calculateTechnicalHour` - Calcular hora técnica
- `pricing.calculateItemValue` - Calcular valor de item com ajustes

### Proposals Router

- `proposals.list` - Listar propostas
- `proposals.getById` - Obter proposta por ID
- `proposals.create` - Criar proposta
- `proposals.update` - Atualizar proposta
- `proposals.delete` - Deletar proposta
- `proposals.addItem` - Adicionar item à proposta
- `proposals.removeItem` - Remover item da proposta

### Risk Assessments Router

- `riskAssessments.list` - Listar avaliações
- `riskAssessments.getByClient` - Obter avaliações por cliente
- `riskAssessments.getById` - Obter avaliação por ID
- `riskAssessments.create` - Criar avaliação
- `riskAssessments.update` - Atualizar avaliação
- `riskAssessments.delete` - Deletar avaliação
- `riskAssessments.calculateRiskScore` - Calcular score de risco

## 🧮 Lógica de Cálculo

### Hora Técnica

```
Hora Base = (Custos Fixos + Pró-labore) / Horas Produtivas
Hora Técnica = Hora Base × (1 + Taxa Tributária)
```

### Valor do Item

```
Valor Base = Hora Técnica × Horas Estimadas × Quantidade
Com Ajustes = Valor Base × (1 + Personalização%) × (1 + Risco%) × (1 + Senioridade%)
Com Desconto = Com Ajustes × (1 - Desconto Volume%)
```

### Desconto por Volume

- 6-15 unidades: 5%
- 16-30 unidades: 10%
- 30+ unidades: 15%

## 🛠️ Scripts Disponíveis

### Backend

- `npm run dev` - Iniciar servidor em modo desenvolvimento
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar servidor em produção
- `npm run type-check` - Verificar tipos TypeScript

### Frontend

- `npm run dev` - Iniciar em modo desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Visualizar build de produção
- `npm run type-check` - Verificar tipos TypeScript

### Streamlit

- `streamlit run app.py` - Iniciar aplicação

## 🔐 Segurança

- Validação de entrada com Zod em todas as APIs
- Suporte para autenticação JWT (preparado para implementação futura)
- Variáveis de ambiente para dados sensíveis
- CORS configurável

## 📝 Próximos Passos

1. Implementar autenticação e autorização
2. Conectar frontend aos endpoints tRPC
3. Adicionar testes unitários e de integração
4. Implementar migrations do banco de dados com Drizzle
5. Adicionar documentação da API
6. Configurar CI/CD

## 👥 Desenvolvimento

Este é um projeto scaffold inicial. Para contribuir:

1. Clone o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

## 📄 Licença

Propriedade da Black Belt Consultoria

---

**Desenvolvido com ❤️ para Black Belt Consultoria**
