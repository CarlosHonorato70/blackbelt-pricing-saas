# Black Belt Pricing SaaS

Sistema SaaS completo de precificação para Black Belt Consultoria com cálculos automáticos de Hora Técnica, descontos por volume e geração de propostas comerciais.

## 🎯 Características Principais

- **Cálculo Automático de Hora Técnica** - Com suporte a 4 regimes tributários (MEI, Simples Nacional, Lucro Presumido, Autônomo)
- **Descontos por Volume Configuráveis** - Faixas automáticas (6-15, 16-30, 30+)
- **Ajustes de Personalização, Risco e Senioridade** - Aplicados automaticamente aos cálculos
- **Gerenciamento de Clientes** - CRUD completo com informações de contato
- **Catálogo de Serviços** - Organização por categoria com faixas de preço
- **Compositor de Propostas** - Interface intuitiva para criar propostas com cálculos em tempo real
- **Geração de Propostas** - Exportação em HTML/PDF
- **Autenticação OAuth** - Integrada com Manus OAuth
- **Banco de Dados MySQL** - Com schema bem definido

## 🚀 Stack Tecnológico

- **Frontend:** React 19 + Tailwind CSS 4 + TypeScript
- **Backend:** Express 4 + tRPC 11
- **Banco de Dados:** MySQL com Drizzle ORM
- **Autenticação:** Manus OAuth
- **Deploy:** Plataforma Manus

## 📋 Pré-requisitos

- Node.js 22.13.0+
- pnpm (gerenciador de pacotes)
- MySQL 8.0+
- Variáveis de ambiente configuradas

## 🛠️ Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/CarlosHonorato70/blackbelt-pricing-saas.git
cd blackbelt-pricing-saas
```

### 2. Instalar dependências

```bash
pnpm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
DATABASE_URL=mysql://user:password@localhost:3306/blackbelt_pricing
JWT_SECRET=seu_jwt_secret_aqui
VITE_APP_ID=seu_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=seu_owner_id
OWNER_NAME=Seu Nome
VITE_APP_TITLE=Black Belt Pricing
VITE_APP_LOGO=https://seu-logo-url.com/logo.png
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_api_key
```

### 4. Configurar banco de dados

```bash
pnpm db:push
```

### 5. Iniciar o servidor de desenvolvimento

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
blackbelt-pricing-saas/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários e configurações
│   │   └── App.tsx        # Componente principal
│   └── public/            # Arquivos estáticos
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Definição das rotas tRPC
│   ├── db.ts              # Funções de banco de dados
│   └── _core/             # Configurações principais
├── drizzle/               # Schema e migrações
│   └── schema.ts          # Definição das tabelas
├── storage/               # Integração com S3
└── shared/                # Código compartilhado

```

## 🗄️ Schema do Banco de Dados

### Tabelas Principais

- **users** - Usuários da plataforma
- **clients** - Clientes cadastrados
- **services** - Serviços oferecidos
- **pricing_parameters** - Parâmetros de precificação
- **proposals** - Propostas comerciais
- **proposal_items** - Itens das propostas

## 📚 API tRPC

### Routers Disponíveis

#### Clientes
```typescript
trpc.clients.list.useQuery()           // Listar clientes
trpc.clients.create.useMutation()      // Criar cliente
trpc.clients.delete.useMutation()      // Deletar cliente
```

#### Serviços
```typescript
trpc.services.list.useQuery()          // Listar serviços
trpc.services.create.useMutation()     // Criar serviço
trpc.services.delete.useMutation()     // Deletar serviço
```

#### Propostas
```typescript
trpc.proposals.list.useQuery()         // Listar propostas
trpc.proposals.create.useMutation()    // Criar proposta
trpc.proposals.getById.useQuery()      // Obter proposta por ID
```

#### Cálculos de Precificação
```typescript
trpc.pricing.calculateTechnicalHour.useMutation()  // Calcular Hora Técnica
trpc.pricing.calculateItem.useMutation()           // Calcular item da proposta
```

## 💡 Como Usar

### 1. Configurar Parâmetros de Precificação

Acesse a página **Parâmetros** e configure:
- Custos fixos mensais
- Pró-labore
- Horas produtivas por mês
- Taxas tributárias por regime
- Descontos por volume
- Ajustes de personalização, risco e senioridade

### 2. Cadastrar Serviços

Vá para **Serviços** e adicione os serviços oferecidos com:
- Nome e descrição
- Categoria
- Unidade de medida
- Faixa de preço (mín/máx)

### 3. Cadastrar Clientes

Em **Clientes**, registre os clientes com:
- Razão social
- CNPJ
- Tamanho da empresa
- Informações de contato

### 4. Criar Propostas

Clique em **Propostas** → **Nova Proposta** e:
- Selecione o cliente
- Escolha o regime tributário
- Defina desconto geral e taxa de deslocamento
- Adicione itens (serviços com quantidades)
- Os cálculos são feitos automaticamente
- Gere a proposta em HTML

## 🧮 Lógica de Cálculo

### Hora Técnica

```
Hora Técnica = (Custos Fixos + Pró-labore) / Horas Produtivas
Valor com Impostos = Hora Técnica × (1 + Taxa Tributária)
```

### Valor do Item

```
Valor Base = Hora Técnica × Horas Estimadas
Com Ajustes = Valor Base × (1 + Personalização) × (1 + Risco) × (1 + Senioridade)
Com Desconto = Com Ajustes × (1 - Desconto por Volume)
Total = Com Desconto - Desconto Geral + Taxa Deslocamento
```

## 🔐 Segurança

- Autenticação OAuth integrada
- Proteção de rotas com `protectedProcedure`
- Validação de entrada em todas as APIs
- Variáveis de ambiente para dados sensíveis
- HTTPS em produção

## 📝 Licença

Propriedade da Black Belt Consultoria

## 👥 Suporte

Para dúvidas ou sugestões, entre em contato com o time de desenvolvimento.

## 🚀 Deploy

### Opção 1: Plataforma Manus (Recomendado)

1. Clique no botão **Publish** na interface de gerenciamento
2. Configure o domínio customizado (opcional)
3. A aplicação será publicada automaticamente

### Opção 2: Outras Plataformas

O projeto pode ser deployado em:
- Vercel
- Railway
- Render
- AWS
- Google Cloud
- Azure

Consulte a documentação de cada plataforma para instruções específicas.

## 📊 Roadmap

- [ ] Integração com sistema de pagamento
- [ ] Relatórios avançados e analytics
- [ ] Exportação de propostas em PDF
- [ ] Histórico de versões de propostas
- [ ] Integração com CRM
- [ ] API pública para integrações externas
- [ ] Aplicativo mobile

---

**Desenvolvido com ❤️ para Black Belt Consultoria**
