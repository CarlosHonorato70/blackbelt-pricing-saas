# Black Belt Pricing SaaS - TODO

## Fase 1: Estrutura do Banco de Dados
- [x] Criar tabela `services` (serviços com faixas de preço)
- [x] Criar tabela `clients` (clientes)
- [x] Criar tabela `pricing_parameters` (parâmetros de precificação)
- [x] Criar tabela `proposals` (propostas comerciais)
- [x] Criar tabela `proposal_items` (itens da proposta)
- [x] Criar relacionamentos entre tabelas
- [x] Executar migrações do banco de dados

## Fase 2: Backend - API de Gerenciamento
- [x] Implementar CRUD para serviços
- [x] Implementar CRUD para clientes
- [x] Implementar CRUD para parâmetros de precificação
- [x] Implementar CRUD para propostas
- [x] Implementar CRUD para itens de proposta
- [x] Implementar lógica de cálculo de Hora Técnica
- [x] Implementar lógica de cálculo de valor do item (com descontos por volume)
- [x] Implementar lógica de ajustes (personalização, risco, senioridade)
- [x] Implementar lógica de cálculo total da proposta
- [x] Implementar validações de faixa de preço

## Fase 3: Frontend - Interfaces de Gerenciamento
- [x] Criar layout principal (DashboardLayout)
- [x] Implementar página de Dashboard com resumo
- [x] Implementar página de Gerenciamento de Clientes
- [x] Implementar página de Gerenciamento de Serviços
- [x] Implementar página de Gerenciamento de Parâmetros de Precificação
- [x] Implementar navegação e roteamento

## Fase 4: Frontend - Compositor de Propostas
- [x] Criar página de Nova Proposta
- [x] Implementar seleção de cliente (ComboBox)
- [x] Implementar seleção de regime tributário
- [x] Implementar subformulário de itens da proposta
- [x] Implementar cálculo automático de valores
- [x] Implementar exibição de alertas de faixa de preço
- [x] Implementar botão para salvar proposta
- [x] Criar página de detalhes da proposta
- [x] Implementar compositor de itens com cálculos em tempo real

## Fase 5: Geração de Propostas
- [x] Implementar template de proposta em HTML
- [x] Implementar geração de HTML a partir dos dados da proposta
- [x] Implementar botão para gerar/baixar proposta
- [x] Implementar visualização prévia da proposta

## Fase 6: Testes e Validação
- [ ] Testar cálculos de Hora Técnica
- [ ] Testar cálculos de itens com descontos e ajustes
- [ ] Testar fluxo completo de criação de proposta
- [ ] Testar geração de PDF
- [ ] Validar conformidade com o Manual de Precificação

## Fase 7: Entrega
- [ ] Criar checkpoint do projeto
- [ ] Documentar instruções de uso
- [ ] Preparar código-fonte para entrega
