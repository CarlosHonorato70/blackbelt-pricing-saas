import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { generateProposalHTML } from "./pdf-generator";
import { TRPCError } from "@trpc/server";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  createPricingParameters,
  getActivePricingParameters,
  getPricingParametersById,
  updatePricingParameters,
  createProposal,
  getProposals,
  getProposalById,
  updateProposal,
  deleteProposal,
  createProposalItem,
  getProposalItems,
  getProposalItemById,
  updateProposalItem,
  deleteProposalItem,
  deleteProposalItemsByProposalId,
} from "./db";

// ============================================================================
// PRICING CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calcula a hora técnica base com base nos parâmetros de precificação
 */
function calculateTechnicalHour(params: {
  monthlyFixedCosts: number;
  monthlyProLabore: number;
  productiveHoursPerMonth: number;
  unexpectedMarginPercent: number;
  taxPercent: number;
}): number {
  const { monthlyFixedCosts, monthlyProLabore, productiveHoursPerMonth, unexpectedMarginPercent, taxPercent } = params;

  if (productiveHoursPerMonth <= 0) return 0;

  const hourBase = (monthlyFixedCosts + monthlyProLabore) / productiveHoursPerMonth;
  const hourWithMargin = hourBase * (1 + unexpectedMarginPercent / 100);
  const hourWithTax = hourWithMargin * (1 + taxPercent / 100);

  return hourWithTax;
}

/**
 * Obtém a taxa de imposto com base no regime tributário
 */
function getTaxRate(taxRegime: string, params: any): number {
  switch (taxRegime) {
    case "MEI":
      return parseFloat(params.taxMeiPercent);
    case "Simples":
      return parseFloat(params.taxSimpleNationalPercent);
    case "Lucro Presumido":
      return parseFloat(params.taxAssumedProfitPercent);
    case "Autônomo":
      return parseFloat(params.taxFreelancePercent);
    default:
      return 0;
  }
}

/**
 * Obtém o percentual de desconto por volume
 */
function getVolumeDiscount(quantity: number, params: any): number {
  if (quantity >= 6 && quantity <= 15) {
    return parseFloat(params.volumeDiscount6To15Percent);
  } else if (quantity >= 16 && quantity <= 30) {
    return parseFloat(params.volumeDiscount16To30Percent);
  } else if (quantity > 30) {
    return parseFloat(params.volumeDiscount30PlusPercent);
  }
  return 0;
}

/**
 * Calcula o valor total de um item da proposta
 */
function calculateItemTotal(params: {
  baseValue: number;
  quantity: number;
  volumeDiscount: number;
  customizationAdjustment: number;
  riskAdjustment: number;
  seniorityAdjustment: number;
}): number {
  const { baseValue, volumeDiscount, customizationAdjustment, riskAdjustment, seniorityAdjustment } = params;

  let value = baseValue * (1 - volumeDiscount / 100);
  value = value * (1 + customizationAdjustment / 100);
  value = value * (1 + riskAdjustment / 100);
  value = value * (1 + seniorityAdjustment / 100);

  return value;
}

// ============================================================================
// ROUTERS
// ============================================================================

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ========================================================================
  // SERVICES
  // ========================================================================
  services: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getServices(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getServiceById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          category: z.string(),
          name: z.string(),
          description: z.string().optional(),
          unit: z.string(),
          minValue: z.number().optional(),
          maxValue: z.number().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createService(ctx.user.id, {
          ...input,
          minValue: input.minValue ? input.minValue.toString() : null,
          maxValue: input.maxValue ? input.maxValue.toString() : null,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          category: z.string().optional(),
          name: z.string().optional(),
          description: z.string().optional(),
          unit: z.string().optional(),
          minValue: z.number().optional(),
          maxValue: z.number().optional(),
          notes: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateService(id, {
          ...data,
          minValue: data.minValue ? data.minValue.toString() : undefined,
          maxValue: data.maxValue ? data.maxValue.toString() : undefined,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteService(input.id);
      }),
  }),

  // ========================================================================
  // CLIENTS
  // ========================================================================
  clients: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getClients(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await getClientById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          companyName: z.string(),
          cnpj: z.string().optional(),
          cnae: z.string().optional(),
          companySize: z.string().optional(),
          numberOfEmployees: z.number().optional(),
          address: z.string().optional(),
          contactName: z.string().optional(),
          contactEmail: z.string().optional(),
          contactPhone: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createClient(ctx.user.id, input);
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          companyName: z.string().optional(),
          cnpj: z.string().optional(),
          cnae: z.string().optional(),
          companySize: z.string().optional(),
          numberOfEmployees: z.number().optional(),
          address: z.string().optional(),
          contactName: z.string().optional(),
          contactEmail: z.string().optional(),
          contactPhone: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return await updateClient(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await deleteClient(input.id, ctx.user.id);
      }),
  }),

  // ========================================================================
  // PRICING PARAMETERS
  // ========================================================================
  pricingParameters: router({
    getActive: protectedProcedure.query(async ({ ctx }) => {
      return await getActivePricingParameters(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await getPricingParametersById(input.id, ctx.user.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          monthlyFixedCosts: z.number(),
          monthlyProLabore: z.number(),
          productiveHoursPerMonth: z.number(),
          unexpectedMarginPercent: z.number(),
          taxMeiPercent: z.number(),
          taxSimpleNationalPercent: z.number(),
          taxAssumedProfitPercent: z.number(),
          taxFreelancePercent: z.number(),
          volumeDiscount6To15Percent: z.number(),
          volumeDiscount16To30Percent: z.number(),
          volumeDiscount30PlusPercent: z.number(),
          customizationAdjustmentMinPercent: z.number(),
          customizationAdjustmentMaxPercent: z.number(),
          riskAdjustmentMinPercent: z.number(),
          riskAdjustmentMaxPercent: z.number(),
          seniorityAdjustmentMinPercent: z.number(),
          seniorityAdjustmentMaxPercent: z.number(),
          effectiveDate: z.date(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createPricingParameters(ctx.user.id, {
          ...input,
          monthlyFixedCosts: input.monthlyFixedCosts.toString(),
          monthlyProLabore: input.monthlyProLabore.toString(),
          unexpectedMarginPercent: input.unexpectedMarginPercent.toString(),
          taxMeiPercent: input.taxMeiPercent.toString(),
          taxSimpleNationalPercent: input.taxSimpleNationalPercent.toString(),
          taxAssumedProfitPercent: input.taxAssumedProfitPercent.toString(),
          taxFreelancePercent: input.taxFreelancePercent.toString(),
          volumeDiscount6To15Percent: input.volumeDiscount6To15Percent.toString(),
          volumeDiscount16To30Percent: input.volumeDiscount16To30Percent.toString(),
          volumeDiscount30PlusPercent: input.volumeDiscount30PlusPercent.toString(),
          customizationAdjustmentMinPercent: input.customizationAdjustmentMinPercent.toString(),
          customizationAdjustmentMaxPercent: input.customizationAdjustmentMaxPercent.toString(),
          riskAdjustmentMinPercent: input.riskAdjustmentMinPercent.toString(),
          riskAdjustmentMaxPercent: input.riskAdjustmentMaxPercent.toString(),
          seniorityAdjustmentMinPercent: input.seniorityAdjustmentMinPercent.toString(),
          seniorityAdjustmentMaxPercent: input.seniorityAdjustmentMaxPercent.toString(),
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          monthlyFixedCosts: z.number().optional(),
          monthlyProLabore: z.number().optional(),
          productiveHoursPerMonth: z.number().optional(),
          unexpectedMarginPercent: z.number().optional(),
          taxMeiPercent: z.number().optional(),
          taxSimpleNationalPercent: z.number().optional(),
          taxAssumedProfitPercent: z.number().optional(),
          taxFreelancePercent: z.number().optional(),
          volumeDiscount6To15Percent: z.number().optional(),
          volumeDiscount16To30Percent: z.number().optional(),
          volumeDiscount30PlusPercent: z.number().optional(),
          customizationAdjustmentMinPercent: z.number().optional(),
          customizationAdjustmentMaxPercent: z.number().optional(),
          riskAdjustmentMinPercent: z.number().optional(),
          riskAdjustmentMaxPercent: z.number().optional(),
          seniorityAdjustmentMinPercent: z.number().optional(),
          seniorityAdjustmentMaxPercent: z.number().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = {};

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && typeof value === "number") {
            updateData[key] = value.toString();
          } else if (value !== undefined) {
            updateData[key] = value;
          }
        });

        return await updatePricingParameters(id, ctx.user.id, updateData);
      }),
  }),

  // ========================================================================
  // PROPOSALS
  // ========================================================================
  proposals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getProposals(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const proposal = await getProposalById(input.id, ctx.user.id);
        if (!proposal) return null;

        const items = await getProposalItems(input.id);
        return { ...proposal, items };
      }),

    create: protectedProcedure
      .input(
        z.object({
          clientId: z.number(),
          proposalNumber: z.string(),
          proposalDate: z.date(),
          validityDays: z.number(),
          taxRegime: z.string(),
          discountPercent: z.number().optional(),
          travelFee: z.number().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createProposal(ctx.user.id, {
          ...input,
          totalValue: "0",
          proposalDate: input.proposalDate,
          discountPercent: input.discountPercent?.toString() || "0",
          travelFee: input.travelFee?.toString() || "0",
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          clientId: z.number().optional(),
          proposalNumber: z.string().optional(),
          proposalDate: z.date().optional(),
          validityDays: z.number().optional(),
          status: z.enum(["draft", "sent", "accepted", "rejected"]).optional(),
          totalValue: z.number().optional(),
          discountPercent: z.number().optional(),
          travelFee: z.number().optional(),
          taxRegime: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updateData: any = {};

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && typeof value === "number") {
            updateData[key] = value.toString();
          } else if (value !== undefined) {
            updateData[key] = value;
          }
        });

        return await updateProposal(id, ctx.user.id, updateData);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteProposalItemsByProposalId(input.id);
        return await deleteProposal(input.id, ctx.user.id);
      }),
  }),

  // ========================================================================
  // PROPOSAL ITEMS
  // ========================================================================
  proposalItems: router({
    list: protectedProcedure
      .input(z.object({ proposalId: z.number() }))
      .query(async ({ input }) => {
        return await getProposalItems(input.proposalId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          proposalId: z.number(),
          serviceId: z.number(),
          quantity: z.number(),
          estimatedHours: z.number().optional(),
          unitValue: z.number(),
          volumeDiscount: z.number().optional(),
          customizationAdjustment: z.number().optional(),
          riskAdjustment: z.number().optional(),
          seniorityAdjustment: z.number().optional(),
          itemTotal: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        return await createProposalItem({
          ...input,
          unitValue: input.unitValue.toString(),
          estimatedHours: input.estimatedHours?.toString(),
          volumeDiscount: input.volumeDiscount?.toString() || "0",
          customizationAdjustment: input.customizationAdjustment?.toString() || "0",
          riskAdjustment: input.riskAdjustment?.toString() || "0",
          seniorityAdjustment: input.seniorityAdjustment?.toString() || "0",
          itemTotal: input.itemTotal.toString(),
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          quantity: z.number().optional(),
          estimatedHours: z.number().optional(),
          unitValue: z.number().optional(),
          volumeDiscount: z.number().optional(),
          customizationAdjustment: z.number().optional(),
          riskAdjustment: z.number().optional(),
          seniorityAdjustment: z.number().optional(),
          itemTotal: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = {};

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && typeof value === "number") {
            updateData[key] = value.toString();
          } else if (value !== undefined) {
            updateData[key] = value;
          }
        });

        return await updateProposalItem(id, updateData);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteProposalItem(input.id);
      }),
  }),

  // ========================================================================
  // PRICING CALCULATIONS
  // ========================================================================
  pricing: router({
    calculateTechnicalHour: protectedProcedure
      .input(
        z.object({
          taxRegime: z.string(),
          pricingParametersId: z.number().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        const params = input.pricingParametersId
          ? await getPricingParametersById(input.pricingParametersId, ctx.user.id)
          : await getActivePricingParameters(ctx.user.id);

        if (!params) {
          throw new Error("Pricing parameters not found");
        }

        const taxRate = getTaxRate(input.taxRegime, params);

        const technicalHour = calculateTechnicalHour({
          monthlyFixedCosts: parseFloat(params.monthlyFixedCosts),
          monthlyProLabore: parseFloat(params.monthlyProLabore),
          productiveHoursPerMonth: params.productiveHoursPerMonth,
          unexpectedMarginPercent: parseFloat(params.unexpectedMarginPercent),
          taxPercent: taxRate,
        });

        return { technicalHour, taxRate };
      }),

    calculateItemValue: protectedProcedure
      .input(
        z.object({
          serviceId: z.number(),
          quantity: z.number(),
          estimatedHours: z.number().optional(),
          taxRegime: z.string(),
          customizationAdjustment: z.number().optional(),
          riskAdjustment: z.number().optional(),
          seniorityAdjustment: z.number().optional(),
          pricingParametersId: z.number().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        const service = await getServiceById(input.serviceId);
        if (!service) {
          throw new Error("Service not found");
        }

        const params = input.pricingParametersId
          ? await getPricingParametersById(input.pricingParametersId, ctx.user.id)
          : await getActivePricingParameters(ctx.user.id);

        if (!params) {
          throw new Error("Pricing parameters not found");
        }

        const taxRate = getTaxRate(input.taxRegime, params);

        let baseValue = 0;
        if (input.estimatedHours && input.estimatedHours > 0) {
          const technicalHour = calculateTechnicalHour({
            monthlyFixedCosts: parseFloat(params.monthlyFixedCosts),
            monthlyProLabore: parseFloat(params.monthlyProLabore),
            productiveHoursPerMonth: params.productiveHoursPerMonth,
            unexpectedMarginPercent: parseFloat(params.unexpectedMarginPercent),
            taxPercent: taxRate,
          });
          baseValue = input.estimatedHours * technicalHour;
        } else {
          baseValue = service.minValue ? parseFloat(service.minValue) : 0;
        }

        const volumeDiscount = getVolumeDiscount(input.quantity, params);

        const itemTotal = calculateItemTotal({
          baseValue,
          quantity: input.quantity,
          volumeDiscount,
          customizationAdjustment: input.customizationAdjustment || 0,
          riskAdjustment: input.riskAdjustment || 0,
          seniorityAdjustment: input.seniorityAdjustment || 0,
        });

        return {
          baseValue,
          volumeDiscount,
          unitValue: baseValue * (1 - volumeDiscount / 100),
          itemTotal,
          minValue: service.minValue ? parseFloat(service.minValue) : null,
          maxValue: service.maxValue ? parseFloat(service.maxValue) : null,
        };
      }),
  }),

  // ========================================================================
  // PROPOSAL PDF
  // ========================================================================
  proposalPdf: router({
    generate: protectedProcedure
      .input(z.object({ proposalId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const proposal = await getProposalById(input.proposalId, ctx.user.id);
        if (!proposal) throw new TRPCError({ code: "NOT_FOUND" });

        const items = await getProposalItems(input.proposalId);
        const client = await getClientById(proposal.clientId, ctx.user.id);

        const html = generateProposalHTML({
          proposal: { ...proposal, items },
          clientName: client?.companyName || "Cliente",
          clientEmail: client?.contactEmail || undefined,
          clientPhone: client?.contactPhone || undefined,
        });

        return { html, proposalNumber: proposal.proposalNumber };
      }),
  }),
});

export type AppRouter = typeof appRouter;
