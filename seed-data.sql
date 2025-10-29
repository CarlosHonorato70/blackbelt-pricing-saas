-- ============================================================================
-- SEED DATA - Black Belt Pricing SaaS
-- Parâmetros de Precificação e Serviços baseados no Manual
-- ============================================================================

-- Nota: Substitua {USER_ID} pelo ID do usuário logado no sistema

-- ============================================================================
-- 1. INSERIR PARÂMETROS DE PRECIFICAÇÃO PADRÃO
-- ============================================================================

INSERT INTO pricing_parameters (
  userId,
  monthlyFixedCosts,
  monthlyProLabore,
  productiveHoursPerMonth,
  unexpectedMarginPercent,
  taxMeiPercent,
  taxSimpleNationalPercent,
  taxAssumedProfitPercent,
  taxFreelancePercent,
  volumeDiscount6To15Percent,
  volumeDiscount16To30Percent,
  volumeDiscount30PlusPercent,
  customizationAdjustmentMinPercent,
  customizationAdjustmentMaxPercent,
  riskAdjustmentMinPercent,
  riskAdjustmentMaxPercent,
  seniorityAdjustmentMinPercent,
  seniorityAdjustmentMaxPercent,
  effectiveDate,
  createdAt,
  updatedAt
) VALUES (
  {USER_ID},
  3000.00,           -- Custos Fixos Mensais
  7000.00,           -- Pró-labore Mensal
  160,               -- Horas Produtivas por Mês (20 dias x 8 horas)
  10.00,             -- Margem para Imprevistos (10%)
  5.00,              -- MEI (5%)
  11.00,             -- Simples Nacional (11%)
  14.50,             -- Lucro Presumido (14.5%)
  32.50,             -- Autônomo (32.5%)
  12.50,             -- Desconto 6-15 unidades (12.5%)
  25.00,             -- Desconto 16-30 unidades (25%)
  37.50,             -- Desconto 30+ unidades (37.5%)
  10.00,             -- Personalização Mínima (10%)
  60.00,             -- Personalização Máxima (60%)
  15.00,             -- Risco Mínimo (15%)
  30.00,             -- Risco Máximo (30%)
  30.00,             -- Senioridade Mínima (30%)
  50.00,             -- Senioridade Máxima (50%)
  CURDATE(),
  NOW(),
  NOW()
);

-- ============================================================================
-- 2. INSERIR SERVIÇOS DO PORTFÓLIO BLACK BELT
-- ============================================================================

-- Avaliação Psicossocial Individual
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Avaliações', 'Avaliação Psicossocial Individual', 'Avaliação aprofundada de riscos psicossociais por colaborador', 'Pessoa', 250.00, 400.00, NOW(), NOW());

-- Pacote de 10 Avaliações + Relatório Executivo
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Pacotes', 'Pacote de 10 Avaliações + Relatório Executivo', 'Diagnóstico completo com relatório executivo consolidado', 'Projeto', 2000.00, 3500.00, NOW(), NOW());

-- Palestra Presencial
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Treinamentos', 'Palestra Presencial (1h30)', 'Apresentação presencial sobre gestão de riscos psicossociais', 'Evento', 800.00, 1500.00, NOW(), NOW());

-- Palestra Online
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Treinamentos', 'Palestra Online (1h30)', 'Apresentação online sobre gestão de riscos psicossociais', 'Evento', 500.00, 900.00, NOW(), NOW());

-- Workshop Prático
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Treinamentos', 'Workshop Prático (4h)', 'Capacitação prática com exercícios e dinâmicas', 'Evento', 1200.00, 2800.00, NOW(), NOW());

-- Plano de Ação Corporativo
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Consultoria', 'Plano de Ação Corporativo', 'Elaboração de estratégias e controles para mitigar riscos', 'Projeto', 1000.00, 2500.00, NOW(), NOW());

-- Avaliação Organizacional - Micro
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Avaliações', 'Avaliação Organizacional - Micro (até 19 colaboradores)', 'Diagnóstico completo para microempresas', 'Projeto', 3000.00, 4500.00, NOW(), NOW());

-- Avaliação Organizacional - Pequena
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Avaliações', 'Avaliação Organizacional - Pequena (20-99 colaboradores)', 'Diagnóstico completo para pequenas empresas', 'Projeto', 4500.00, 6000.00, NOW(), NOW());

-- Avaliação Organizacional - Média
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Avaliações', 'Avaliação Organizacional - Média (100-499 colaboradores)', 'Diagnóstico completo para médias empresas', 'Projeto', 6000.00, 8000.00, NOW(), NOW());

-- Avaliação Organizacional - Grande
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Avaliações', 'Avaliação Organizacional - Grande (500+ colaboradores)', 'Diagnóstico customizado para grandes empresas', 'Projeto', 10000.00, NULL, NOW(), NOW());

-- Consultoria Mensal Continuada (Retainer)
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Consultoria', 'Consultoria Mensal Continuada (Retainer)', 'Suporte contínuo para monitoramento e ajustes de planos', 'Mês', 1500.00, 4000.00, NOW(), NOW());

-- Diagnóstico de Riscos Psicossociais (DRPS)
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Avaliações', 'Diagnóstico de Riscos Psicossociais (DRPS)', 'Avaliação aprofundada dos perigos e riscos psicossociais', 'Projeto', 2000.00, 4000.00, NOW(), NOW());

-- Inventário de Riscos Psicossociais
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Consultoria', 'Inventário de Riscos Psicossociais', 'Documentação detalhada dos riscos identificados conforme NR 01', 'Projeto', 1500.00, 3000.00, NOW(), NOW());

-- Integração ao PCMSO (NR 07)
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Consultoria', 'Integração ao PCMSO (NR 07)', 'Adequação dos fluxos de saúde ocupacional', 'Projeto', 1000.00, 2500.00, NOW(), NOW());

-- Mentoria Executiva
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Consultoria', 'Mentoria Executiva', 'Acompanhamento individualizado para líderes e gestores', 'Mês', 2000.00, 5000.00, NOW(), NOW());

-- Auditorias Internas Simuladas (Mock Audit)
INSERT INTO services (userId, category, name, description, unit, minValue, maxValue, createdAt, updatedAt) VALUES
({USER_ID}, 'Consultoria', 'Auditorias Internas Simuladas (Mock Audit)', 'Avaliações preparatórias para auditorias externas', 'Projeto', 2000.00, 4000.00, NOW(), NOW());

-- ============================================================================
-- NOTAS IMPORTANTES:
-- ============================================================================
-- 1. Substitua {USER_ID} pelo ID do usuário logado no sistema
-- 2. Execute este script após fazer login no SaaS
-- 3. Os valores seguem o Manual de Precificação da Black Belt Consultoria
-- 4. Os parâmetros podem ser ajustados na interface "Parâmetros" do sistema
-- 5. Os serviços podem ser editados na interface "Serviços" do sistema
