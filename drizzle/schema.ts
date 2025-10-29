import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  longtext,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Services table - Serviços oferecidos pela Black Belt Consultoria
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 100 }).notNull(), // ex: "Avaliação", "Treinamento", "Consultoria"
  name: varchar("name", { length: 255 }).notNull(), // Nome do serviço
  description: longtext("description"), // Descrição detalhada
  unit: varchar("unit", { length: 50 }).notNull(), // Unidade: "Pessoa", "Projeto", "Evento", "Mês"
  minValue: decimal("minValue", { precision: 10, scale: 2 }), // Valor mínimo da faixa
  maxValue: decimal("maxValue", { precision: 10, scale: 2 }), // Valor máximo da faixa
  notes: longtext("notes"), // Observações
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Clients table - Clientes da Black Belt Consultoria
 */
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Referência ao usuário que criou/gerencia o cliente
  companyName: varchar("companyName", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }), // CNPJ da empresa
  cnae: varchar("cnae", { length: 100 }), // Código CNAE
  companySize: varchar("companySize", { length: 50 }), // "Micro", "Pequena", "Média", "Grande"
  numberOfEmployees: int("numberOfEmployees"), // Número de colaboradores
  address: longtext("address"), // Endereço completo
  contactName: varchar("contactName", { length: 100 }), // Nome do contato
  contactEmail: varchar("contactEmail", { length: 100 }), // Email do contato
  contactPhone: varchar("contactPhone", { length: 20 }), // Telefone do contato
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

/**
 * Pricing Parameters table - Parâmetros de precificação da consultoria
 */
export const pricingParameters = mysqlTable("pricing_parameters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Referência ao usuário (admin)
  monthlyFixedCosts: decimal("monthlyFixedCosts", { precision: 10, scale: 2 }).notNull(), // Custos fixos mensais
  monthlyProLabore: decimal("monthlyProLabore", { precision: 10, scale: 2 }).notNull(), // Pró-labore desejado
  productiveHoursPerMonth: int("productiveHoursPerMonth").notNull(), // Horas produtivas no mês
  unexpectedMarginPercent: decimal("unexpectedMarginPercent", { precision: 5, scale: 2 }).notNull(), // Margem para imprevistos (%)
  taxMeiPercent: decimal("taxMeiPercent", { precision: 5, scale: 2 }).notNull(), // Taxa MEI (%)
  taxSimpleNationalPercent: decimal("taxSimpleNationalPercent", { precision: 5, scale: 2 }).notNull(), // Taxa Simples Nacional (%)
  taxAssumedProfitPercent: decimal("taxAssumedProfitPercent", { precision: 5, scale: 2 }).notNull(), // Taxa Lucro Presumido (%)
  taxFreelancePercent: decimal("taxFreelancePercent", { precision: 5, scale: 2 }).notNull(), // Taxa Autônomo (%)
  volumeDiscount6To15Percent: decimal("volumeDiscount6To15Percent", { precision: 5, scale: 2 }).notNull(), // Desconto volume 6-15
  volumeDiscount16To30Percent: decimal("volumeDiscount16To30Percent", { precision: 5, scale: 2 }).notNull(), // Desconto volume 16-30
  volumeDiscount30PlusPercent: decimal("volumeDiscount30PlusPercent", { precision: 5, scale: 2 }).notNull(), // Desconto volume 30+
  customizationAdjustmentMinPercent: decimal("customizationAdjustmentMinPercent", { precision: 5, scale: 2 }).notNull(), // Ajuste personalização mín
  customizationAdjustmentMaxPercent: decimal("customizationAdjustmentMaxPercent", { precision: 5, scale: 2 }).notNull(), // Ajuste personalização máx
  riskAdjustmentMinPercent: decimal("riskAdjustmentMinPercent", { precision: 5, scale: 2 }).notNull(), // Ajuste risco mín
  riskAdjustmentMaxPercent: decimal("riskAdjustmentMaxPercent", { precision: 5, scale: 2 }).notNull(), // Ajuste risco máx
  seniorityAdjustmentMinPercent: decimal("seniorityAdjustmentMinPercent", { precision: 5, scale: 2 }).notNull(), // Ajuste senioridade mín
  seniorityAdjustmentMaxPercent: decimal("seniorityAdjustmentMaxPercent", { precision: 5, scale: 2 }).notNull(), // Ajuste senioridade máx
  effectiveDate: timestamp("effectiveDate").notNull(), // Data de vigência
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PricingParameters = typeof pricingParameters.$inferSelect;
export type InsertPricingParameters = typeof pricingParameters.$inferInsert;

/**
 * Proposals table - Propostas comerciais
 */
export const proposals = mysqlTable("proposals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Usuário que criou a proposta
  clientId: int("clientId").notNull(), // Referência ao cliente
  proposalNumber: varchar("proposalNumber", { length: 50 }).notNull().unique(), // Número único da proposta
  proposalDate: timestamp("proposalDate").notNull(), // Data da proposta
  validityDays: int("validityDays").notNull(), // Dias de validade
  status: mysqlEnum("status", ["draft", "sent", "accepted", "rejected"]).default("draft").notNull(), // Status
  totalValue: decimal("totalValue", { precision: 12, scale: 2 }).notNull(), // Valor total
  discountPercent: decimal("discountPercent", { precision: 5, scale: 2 }).default("0"), // Desconto percentual geral
  travelFee: decimal("travelFee", { precision: 10, scale: 2 }).default("0"), // Taxa de deslocamento
  taxRegime: varchar("taxRegime", { length: 50 }).notNull(), // Regime tributário: "MEI", "Simples", "Lucro Presumido", "Autônomo"
  notes: longtext("notes"), // Observações
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;

/**
 * Proposal Items table - Itens da proposta
 */
export const proposalItems = mysqlTable("proposal_items", {
  id: int("id").autoincrement().primaryKey(),
  proposalId: int("proposalId").notNull(), // Referência à proposta
  serviceId: int("serviceId").notNull(), // Referência ao serviço
  quantity: int("quantity").notNull(), // Quantidade
  estimatedHours: decimal("estimatedHours", { precision: 8, scale: 2 }), // Horas estimadas
  unitValue: decimal("unitValue", { precision: 10, scale: 2 }).notNull(), // Valor unitário
  volumeDiscount: decimal("volumeDiscount", { precision: 5, scale: 2 }).default("0"), // Desconto por volume (%)
  customizationAdjustment: decimal("customizationAdjustment", { precision: 5, scale: 2 }).default("0"), // Ajuste personalização (%)
  riskAdjustment: decimal("riskAdjustment", { precision: 5, scale: 2 }).default("0"), // Ajuste risco (%)
  seniorityAdjustment: decimal("seniorityAdjustment", { precision: 5, scale: 2 }).default("0"), // Ajuste senioridade (%)
  itemTotal: decimal("itemTotal", { precision: 12, scale: 2 }).notNull(), // Valor total do item
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProposalItem = typeof proposalItems.$inferSelect;
export type InsertProposalItem = typeof proposalItems.$inferInsert;
