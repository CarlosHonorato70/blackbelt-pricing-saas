import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '../../database';
import { pricingParameters, services } from '../../database/schema';
import { eq } from 'drizzle-orm';
import {
  calculateTechnicalHour,
  calculateItemTotal,
  getTaxRateForRegime,
  getVolumeDiscount
} from '../../utils/calculations';

export const pricingRouter = router({
  /**
   * Calculate technical hour rate for a given tenant and tax regime
   */
  calculateTechnicalHour: publicProcedure
    .input(
      z.object({
        tenantId: z.string(),
        taxRegime: z.enum(['MEI', 'Simples Nacional', 'Lucro Presumido', 'Autônomo'])
      })
    )
    .query(async ({ input }) => {
      const [params] = await db
        .select()
        .from(pricingParameters)
        .where(eq(pricingParameters.tenantId, input.tenantId))
        .limit(1);

      if (!params) {
        throw new Error('Pricing parameters not found for tenant');
      }

      const taxRate = getTaxRateForRegime(input.taxRegime, {
        taxRateMEI: Number(params.taxRateMEI),
        taxRateSimples: Number(params.taxRateSimples),
        taxRateLucroPresumido: Number(params.taxRateLucroPresumido),
        taxRateAutonomo: Number(params.taxRateAutonomo)
      });

      const technicalHour = calculateTechnicalHour({
        fixedCosts: Number(params.fixedCosts),
        proLabor: Number(params.proLabor),
        productiveHours: Number(params.productiveHours),
        taxRate
      });

      return {
        technicalHour,
        taxRate,
        params: {
          fixedCosts: Number(params.fixedCosts),
          proLabor: Number(params.proLabor),
          productiveHours: Number(params.productiveHours)
        }
      };
    }),

  /**
   * Calculate item value with all adjustments
   */
  calculateItemValue: publicProcedure
    .input(
      z.object({
        serviceId: z.string(),
        tenantId: z.string(),
        taxRegime: z.enum(['MEI', 'Simples Nacional', 'Lucro Presumido', 'Autônomo']),
        quantity: z.number().positive(),
        estimatedHours: z.number().positive().optional(),
        adjustmentPersonalization: z.number().default(0),
        adjustmentRisk: z.number().default(0),
        adjustmentSeniority: z.number().default(0)
      })
    )
    .query(async ({ input }) => {
      const [service] = await db
        .select()
        .from(services)
        .where(eq(services.id, input.serviceId))
        .limit(1);

      if (!service) {
        throw new Error('Service not found');
      }

      const [params] = await db
        .select()
        .from(pricingParameters)
        .where(eq(pricingParameters.tenantId, input.tenantId))
        .limit(1);

      if (!params) {
        throw new Error('Pricing parameters not found for tenant');
      }

      const taxRate = getTaxRateForRegime(input.taxRegime, {
        taxRateMEI: Number(params.taxRateMEI),
        taxRateSimples: Number(params.taxRateSimples),
        taxRateLucroPresumido: Number(params.taxRateLucroPresumido),
        taxRateAutonomo: Number(params.taxRateAutonomo)
      });

      const technicalHour = calculateTechnicalHour({
        fixedCosts: Number(params.fixedCosts),
        proLabor: Number(params.proLabor),
        productiveHours: Number(params.productiveHours),
        taxRate
      });

      const estimatedHours = input.estimatedHours || Number(service.estimatedHours);
      const basePrice = technicalHour;
      const volumeDiscount = getVolumeDiscount(input.quantity);

      const totalValue = calculateItemTotal({
        basePrice,
        estimatedHours,
        quantity: input.quantity,
        adjustmentPersonalization: input.adjustmentPersonalization,
        adjustmentRisk: input.adjustmentRisk,
        adjustmentSeniority: input.adjustmentSeniority,
        volumeDiscount
      });

      return {
        basePrice,
        technicalHour,
        estimatedHours,
        volumeDiscount,
        unitPrice: basePrice * estimatedHours,
        totalValue,
        service: {
          id: service.id,
          name: service.name,
          description: service.description
        }
      };
    })
});
