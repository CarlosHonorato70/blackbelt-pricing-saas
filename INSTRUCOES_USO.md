# Black Belt Pricing SaaS - Instruções de Uso

## 📋 Visão Geral

O **Black Belt Pricing SaaS** é um sistema web completo para automatizar a precificação de serviços de consultoria e gerar propostas comerciais profissionais. O sistema implementa a lógica de precificação detalhada no Manual de Precificação da Black Belt Consultoria.

## 🚀 Começando

### 1. Acesso ao Sistema

O sistema está disponível em: **https://seu-dominio.manus.space**

Faça login usando sua conta Manus OAuth.

### 2. Fluxo Recomendado de Uso

Siga os passos abaixo para começar a usar o sistema:

#### **Passo 1: Configurar Parâmetros de Precificação**

1. Clique em **"Parâmetros"** no menu principal
2. Configure os seguintes valores:

   **Custos e Horas:**
   - **Custos Fixos Mensais**: Soma de todos os custos operacionais (aluguel, internet, etc.)
   - **Pró-labore Mensal**: Remuneração mensal do consultor
   - **Horas Produtivas por Mês**: Número de horas disponíveis para trabalho em projetos (ex: 160)
   - **Margem para Imprevistos**: Percentual adicional para cobrir riscos (ex: 10%)

   **Taxas por Regime Tributário:**
   - **MEI**: Alíquota para Microempreendedor Individual
   - **Simples Nacional**: Alíquota para regime Simples Nacional
   - **Lucro Presumido**: Alíquota para regime Lucro Presumido
   - **Autônomo**: Alíquota para autônomos

   **Descontos por Volume:**
   - **6-15 Unidades**: Desconto aplicado para pedidos de 6 a 15 unidades (ex: 12.5%)
   - **16-30 Unidades**: Desconto para 16 a 30 unidades (ex: 25%)
   - **30+ Unidades**: Desconto para 30 ou mais unidades (ex: 37.5%)

   **Ajustes de Personalização, Risco e Senioridade:**
   - Configure os percentuais mínimos e máximos para cada tipo de ajuste

3. Clique em **"Salvar Parâmetros"**

#### **Passo 2: Cadastrar Serviços**

1. Clique em **"Serviços"** no menu principal
2. Clique em **"Novo Serviço"**
3. Preencha os dados:
   - **Categoria**: Tipo de serviço (Avaliação, Consultoria, Treinamento, etc.)
   - **Nome**: Nome descritivo do serviço
   - **Descrição**: Detalhes do serviço
   - **Unidade**: Unidade de medida (Pessoa, Projeto, Evento, Mês, Hora)
   - **Valor Mínimo**: Preço mínimo sugerido
   - **Valor Máximo**: Preço máximo sugerido
4. Clique em **"Criar Serviço"**

#### **Passo 3: Cadastrar Clientes**

1. Clique em **"Clientes"** no menu principal
2. Clique em **"Novo Cliente"**
3. Preencha os dados:
   - **Nome da Empresa**: Nome legal da empresa
   - **CNPJ**: Número de CNPJ (opcional)
   - **CNAE**: Código CNAE (opcional)
   - **Porte da Empresa**: Micro, Pequena, Média ou Grande
   - **Número de Colaboradores**: Quantidade de funcionários
   - **Endereço**: Endereço completo
   - **Contato**: Nome, email e telefone do responsável
4. Clique em **"Criar Cliente"**

#### **Passo 4: Criar uma Proposta**

1. Clique em **"Propostas"** no menu principal
2. Clique em **"Nova Proposta"**
3. Preencha os dados básicos:
   - **Cliente**: Selecione o cliente
   - **Número da Proposta**: Identificador único (ex: PROP-2025-001)
   - **Dias de Validade**: Quantos dias a proposta é válida (ex: 30)
   - **Regime Tributário**: Regime fiscal do cliente
   - **Desconto**: Percentual de desconto geral (opcional)
   - **Taxa de Deslocamento**: Valor adicional para deslocamento (opcional)
4. Clique em **"Criar Proposta"**

#### **Passo 5: Adicionar Itens à Proposta**

1. Na página de detalhes da proposta, clique em **"Adicionar Item"**
2. Selecione um **Serviço**
3. Configure os parâmetros:
   - **Quantidade**: Número de unidades
   - **Horas Estimadas**: Horas de trabalho (opcional, usado para calcular valor)
   - **Personalização**: Ajuste percentual para customização (0-25%)
   - **Risco**: Ajuste percentual para risco (0-30%)
   - **Senioridade**: Ajuste percentual para senioridade (0-50%)
4. O sistema calcula automaticamente:
   - **Valor Unitário**: Baseado na Hora Técnica ou valor padrão do serviço
   - **Desconto por Volume**: Aplicado automaticamente conforme quantidade
   - **Total do Item**: Valor final com todos os ajustes
5. Clique em **"Adicionar Item"**

#### **Passo 6: Gerar Proposta**

1. Na página de detalhes da proposta, clique em **"Gerar Proposta"**
2. O sistema gera um arquivo HTML profissional com:
   - Dados do cliente
   - Lista de itens com valores
   - Resumo financeiro
   - Validade da proposta
3. O arquivo é baixado automaticamente em seu computador

## 📊 Entendendo os Cálculos

### Hora Técnica

A **Hora Técnica** é calculada automaticamente com base em:

```
Hora Técnica = (Custos Fixos + Pró-labore + Margem para Imprevistos) / Horas Produtivas
Hora Técnica com Impostos = Hora Técnica × (1 + Taxa Tributária)
```

### Valor do Item

O valor de cada item é calculado como:

```
Valor Base = Hora Técnica × Horas Estimadas (ou Valor Mínimo do Serviço)
Desconto Volume = Aplicado conforme quantidade
Valor com Desconto = Valor Base × (1 - Desconto Volume)
Total Item = Valor com Desconto × (1 + Personalização + Risco + Senioridade)
```

### Descontos por Volume

Os descontos são aplicados automaticamente:
- **1-5 unidades**: Sem desconto
- **6-15 unidades**: Desconto configurado (ex: 12.5%)
- **16-30 unidades**: Desconto configurado (ex: 25%)
- **30+ unidades**: Desconto configurado (ex: 37.5%)

## 🎯 Dicas de Uso

### Otimizando Propostas

1. **Use Horas Estimadas**: Quando você sabe quantas horas o projeto levará, use o campo "Horas Estimadas" para cálculos mais precisos
2. **Aproveite Ajustes**: Use os ajustes de personalização, risco e senioridade para refletir a complexidade do projeto
3. **Descontos Estratégicos**: Configure descontos por volume para incentivar pedidos maiores

### Mantendo Dados Atualizados

1. **Revise Parâmetros Regularmente**: Atualize custos e pró-labore conforme necessário
2. **Mantenha Serviços Organizados**: Use categorias para organizar seus serviços
3. **Atualize Informações de Clientes**: Mantenha dados de contato atualizados

## 🔧 Funcionalidades Principais

### Dashboard
- Resumo rápido do sistema
- Links para todas as funcionalidades principais
- Instruções de uso

### Gerenciamento de Clientes
- CRUD completo (Criar, Ler, Atualizar, Deletar)
- Armazenamento de dados de contato
- Classificação por porte da empresa

### Gerenciamento de Serviços
- Cadastro de serviços oferecidos
- Categorização de serviços
- Definição de faixas de preço (mínimo e máximo)

### Parâmetros de Precificação
- Configuração de custos operacionais
- Definição de taxas tributárias por regime
- Ajuste de descontos por volume
- Customização de ajustes (personalização, risco, senioridade)

### Gerenciamento de Propostas
- Criação de propostas com dados do cliente
- Adição dinâmica de itens
- Cálculos automáticos em tempo real
- Geração de propostas em HTML profissional

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- Desktop (Chrome, Firefox, Safari, Edge)
- Tablet (iPad, Android)
- Mobile (iPhone, Android)

## 🔐 Segurança

- Autenticação via Manus OAuth
- Dados protegidos e isolados por usuário
- Conexão HTTPS
- Senhas não são armazenadas no sistema

## ❓ Perguntas Frequentes

### P: Como alterar um valor já calculado?
R: Você pode editar os itens da proposta clicando no ícone de lixeira e adicionando novamente com os valores corretos.

### P: Posso usar o sistema sem internet?
R: Não, o sistema é web-based e requer conexão com a internet.

### P: Como faço backup dos meus dados?
R: Os dados são armazenados automaticamente no servidor. Você pode exportar propostas em HTML.

### P: Quantos clientes e serviços posso cadastrar?
R: Não há limite. O sistema suporta milhares de registros.

### P: Posso compartilhar propostas com clientes?
R: Sim, você pode enviar o arquivo HTML gerado por email ou qualquer outro meio.

## 📞 Suporte

Para dúvidas ou problemas, entre em contato através do sistema de suporte integrado.

---

**Versão**: 1.0  
**Última atualização**: Outubro de 2025  
**Desenvolvido para**: Black Belt Consultoria
