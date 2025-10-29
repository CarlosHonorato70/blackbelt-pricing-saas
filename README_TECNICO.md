# Black Belt Pricing SaaS - Documentação Técnica

## 📚 Arquitetura do Sistema

### Stack Tecnológico

**Frontend:**
- React 19 com TypeScript
- Tailwind CSS 4 para styling
- shadcn/ui para componentes
- wouter para roteamento
- tRPC para comunicação com backend

**Backend:**
- Express 4 com TypeScript
- tRPC 11 para API type-safe
- Drizzle ORM para acesso ao banco
- MySQL/TiDB para persistência

**Autenticação:**
- Manus OAuth integrado
- JWT para sessões

## 🗄️ Modelo de Dados

### Tabelas Principais

#### `users`
```sql
- id (PK)
- openId (UNIQUE)
- name
- email
- loginMethod
- role (enum: user, admin)
- createdAt
- updatedAt
- lastSignedIn
```

#### `services`
```sql
- id (PK)
- userId (FK)
- category (string)
- name (string)
- description (text, optional)
- unit (string)
- minValue (decimal, optional)
- maxValue (decimal, optional)
- notes (text, optional)
- createdAt
- updatedAt
```

#### `clients`
```sql
- id (PK)
- userId (FK)
- companyName (string)
- cnpj (string, optional)
- cnae (string, optional)
- companySize (enum)
- numberOfEmployees (int, optional)
- address (text, optional)
- contactName (string, optional)
- contactEmail (string, optional)
- contactPhone (string, optional)
- createdAt
- updatedAt
```

#### `pricing_parameters`
```sql
- id (PK)
- userId (FK)
- monthlyFixedCosts (decimal)
- monthlyProLabore (decimal)
- productiveHoursPerMonth (int)
- unexpectedMarginPercent (decimal)
- taxMeiPercent (decimal)
- taxSimpleNationalPercent (decimal)
- taxAssumedProfitPercent (decimal)
- taxFreelancePercent (decimal)
- volumeDiscount6To15Percent (decimal)
- volumeDiscount16To30Percent (decimal)
- volumeDiscount30PlusPercent (decimal)
- customizationAdjustmentMinPercent (decimal)
- customizationAdjustmentMaxPercent (decimal)
- riskAdjustmentMinPercent (decimal)
- riskAdjustmentMaxPercent (decimal)
- seniorityAdjustmentMinPercent (decimal)
- seniorityAdjustmentMaxPercent (decimal)
- effectiveDate (date)
- createdAt
- updatedAt
```

#### `proposals`
```sql
- id (PK)
- userId (FK)
- clientId (FK)
- proposalNumber (string)
- proposalDate (date)
- validityDays (int)
- status (enum: draft, sent, accepted, rejected)
- totalValue (decimal)
- discountPercent (decimal)
- travelFee (decimal)
- taxRegime (string)
- notes (text, optional)
- createdAt
- updatedAt
```

#### `proposal_items`
```sql
- id (PK)
- proposalId (FK)
- serviceId (FK)
- quantity (int)
- estimatedHours (decimal, optional)
- unitValue (decimal)
- volumeDiscount (decimal)
- customizationAdjustment (decimal)
- riskAdjustment (decimal)
- seniorityAdjustment (decimal)
- itemTotal (decimal)
- createdAt
- updatedAt
```

## 🔌 API tRPC

### Routers Disponíveis

#### `services`
- `list`: Listar todos os serviços do usuário
- `get`: Obter um serviço específico
- `create`: Criar novo serviço
- `update`: Atualizar serviço
- `delete`: Deletar serviço

#### `clients`
- `list`: Listar todos os clientes
- `get`: Obter um cliente específico
- `create`: Criar novo cliente
- `update`: Atualizar cliente
- `delete`: Deletar cliente

#### `pricingParameters`
- `getActive`: Obter parâmetros ativos
- `get`: Obter parâmetros específicos
- `create`: Criar novo conjunto de parâmetros
- `update`: Atualizar parâmetros

#### `proposals`
- `list`: Listar todas as propostas
- `get`: Obter proposta específica
- `create`: Criar nova proposta
- `update`: Atualizar proposta
- `delete`: Deletar proposta

#### `proposalItems`
- `list`: Listar itens de uma proposta
- `create`: Adicionar item à proposta
- `update`: Atualizar item
- `delete`: Deletar item

#### `pricing`
- `calculateItemValue`: Calcular valor de um item com todos os ajustes

#### `proposalPdf`
- `generate`: Gerar HTML da proposta

## 📄 Estrutura de Arquivos

```
blackbelt_pricing_saas/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Propostas.tsx
│   │   │   ├── PropostaDetalhes.tsx
│   │   │   ├── Clientes.tsx
│   │   │   ├── Servicos.tsx
│   │   │   └── Parametros.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
├── server/
│   ├── routers.ts
│   ├── db.ts
│   ├── pdf-generator.ts
│   └── _core/
├── drizzle/
│   └── schema.ts
├── shared/
├── storage/
├── todo.md
├── INSTRUCOES_USO.md
└── README_TECNICO.md
```

## 🧮 Lógica de Cálculo

### Cálculo da Hora Técnica

```typescript
function calculateTechnicalHour(params: {
  monthlyFixedCosts: number;
  monthlyProLabore: number;
  productiveHoursPerMonth: number;
  unexpectedMarginPercent: number;
  taxPercent: number;
}): number {
  const baseCost = (params.monthlyFixedCosts + params.monthlyProLabore) 
    / params.productiveHoursPerMonth;
  
  const withMargin = baseCost * (1 + params.unexpectedMarginPercent / 100);
  
  const withTax = withMargin * (1 + params.taxPercent / 100);
  
  return withTax;
}
```

### Cálculo do Desconto por Volume

```typescript
function getVolumeDiscount(quantity: number, params: PricingParameters): number {
  if (quantity <= 5) return 0;
  if (quantity <= 15) return params.volumeDiscount6To15Percent;
  if (quantity <= 30) return params.volumeDiscount16To30Percent;
  return params.volumeDiscount30PlusPercent;
}
```

### Cálculo do Total do Item

```typescript
function calculateItemTotal(params: {
  baseValue: number;
  quantity: number;
  volumeDiscount: number;
  customizationAdjustment: number;
  riskAdjustment: number;
  seniorityAdjustment: number;
}): number {
  const unitValue = params.baseValue * (1 - params.volumeDiscount / 100);
  
  const adjustmentFactor = 1 
    + (params.customizationAdjustment / 100)
    + (params.riskAdjustment / 100)
    + (params.seniorityAdjustment / 100);
  
  return unitValue * params.quantity * adjustmentFactor;
}
```

## 🚀 Deployment

### Requisitos
- Node.js 18+
- MySQL 8.0+ ou TiDB
- Manus OAuth configurado

### Variáveis de Ambiente
```
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=seu-secret-jwt
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
OWNER_OPEN_ID=seu-open-id
OWNER_NAME=seu-nome
VITE_APP_TITLE=Black Belt Pricing SaaS
VITE_APP_LOGO=url-do-logo
```

### Build e Deploy
```bash
# Instalar dependências
pnpm install

# Migrar banco de dados
pnpm db:push

# Build
pnpm build

# Iniciar servidor
pnpm start
```

## 🔒 Segurança

- Todas as rotas protegidas requerem autenticação
- Dados isolados por usuário (userId)
- Validação de entrada com Zod
- HTTPS obrigatório em produção
- Proteção contra CSRF via tRPC

## 📊 Performance

- Queries otimizadas com índices
- Cache de parâmetros de precificação
- Lazy loading de componentes
- Otimização de bundle com Vite

## 🧪 Testes

Para testar o sistema:

1. Configure os parâmetros de precificação
2. Crie alguns serviços
3. Crie um cliente
4. Crie uma proposta e adicione itens
5. Verifique os cálculos
6. Gere a proposta em HTML

## 📝 Notas de Desenvolvimento

- O sistema usa Drizzle ORM com MySQL
- tRPC fornece type-safety end-to-end
- Componentes React usam hooks e context
- Styling com Tailwind CSS classes
- Roteamento com wouter (lightweight)

## 🔄 Fluxo de Dados

```
Frontend (React)
    ↓
tRPC Client
    ↓
Backend (Express + tRPC)
    ↓
Database Layer (Drizzle)
    ↓
MySQL/TiDB
```

## 📚 Referências

- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

---

**Versão**: 1.0  
**Última atualização**: Outubro de 2025  
**Desenvolvido para**: Black Belt Consultoria
