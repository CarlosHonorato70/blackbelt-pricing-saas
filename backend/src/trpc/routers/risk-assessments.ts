import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '../../database';
import { riskAssessments, clients } from '../../database/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const riskAssessmentsRouter = router({
  /**
   * List all risk assessments for a tenant
   */
  list: publicProcedure
    .input(z.object({ tenantId: z.string() }))
    .query(async ({ input }) => {
      return await db
        .select()
        .from(riskAssessments)
        .where(eq(riskAssessments.tenantId, input.tenantId));
    }),

  /**
   * Get risk assessments for a specific client
   */
  getByClient: publicProcedure
    .input(z.object({ clientId: z.string(), tenantId: z.string() }))
    .query(async ({ input }) => {
      return await db
        .select()
        .from(riskAssessments)
        .where(
          and(
            eq(riskAssessments.clientId, input.clientId),
            eq(riskAssessments.tenantId, input.tenantId)
          )
        );
    }),

  /**
   * Get a single risk assessment by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string(), tenantId: z.string() }))
    .query(async ({ input }) => {
      const [assessment] = await db
        .select()
        .from(riskAssessments)
        .where(
          and(
            eq(riskAssessments.id, input.id),
            eq(riskAssessments.tenantId, input.tenantId)
          )
        )
        .limit(1);

      if (!assessment) {
        throw new Error('Risk assessment not found');
      }

      const [client] = await db
        .select()
        .from(clients)
        .where(eq(clients.id, assessment.clientId))
        .limit(1);

      return {
        ...assessment,
        client
      };
    }),

  /**
   * Create a new risk assessment
   */
  create: publicProcedure
    .input(
      z.object({
        tenantId: z.string(),
        clientId: z.string(),
        sector: z.string(),
        riskLevel: z.enum(['baixo', 'médio', 'alto', 'muito_alto']),
        psychosocialFactors: z.string().optional(),
        recommendations: z.string().optional()
      })
    )
    .mutation(async ({ input }) => {
      const assessmentId = uuidv4();

      const [newAssessment] = await db.insert(riskAssessments).values({
        id: assessmentId,
        clientId: input.clientId,
        sector: input.sector,
        riskLevel: input.riskLevel,
        psychosocialFactors: input.psychosocialFactors,
        recommendations: input.recommendations,
        tenantId: input.tenantId
      });

      return { id: assessmentId, ...newAssessment };
    }),

  /**
   * Update a risk assessment
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        tenantId: z.string(),
        sector: z.string().optional(),
        riskLevel: z.enum(['baixo', 'médio', 'alto', 'muito_alto']).optional(),
        psychosocialFactors: z.string().optional(),
        recommendations: z.string().optional()
      })
    )
    .mutation(async ({ input }) => {
      const { id, tenantId, ...updateData } = input;

      const updateFields: any = {};
      if (updateData.sector) updateFields.sector = updateData.sector;
      if (updateData.riskLevel) updateFields.riskLevel = updateData.riskLevel;
      if (updateData.psychosocialFactors !== undefined) 
        updateFields.psychosocialFactors = updateData.psychosocialFactors;
      if (updateData.recommendations !== undefined) 
        updateFields.recommendations = updateData.recommendations;

      await db
        .update(riskAssessments)
        .set(updateFields)
        .where(
          and(
            eq(riskAssessments.id, id),
            eq(riskAssessments.tenantId, tenantId)
          )
        );

      return { success: true };
    }),

  /**
   * Delete a risk assessment
   */
  delete: publicProcedure
    .input(z.object({ id: z.string(), tenantId: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .delete(riskAssessments)
        .where(
          and(
            eq(riskAssessments.id, input.id),
            eq(riskAssessments.tenantId, input.tenantId)
          )
        );

      return { success: true };
    }),

  /**
   * Calculate risk score based on assessment
   */
  calculateRiskScore: publicProcedure
    .input(
      z.object({
        riskLevel: z.enum(['baixo', 'médio', 'alto', 'muito_alto']),
        hasPsychosocialFactors: z.boolean()
      })
    )
    .query(({ input }) => {
      let baseScore = 0;

      switch (input.riskLevel) {
        case 'baixo':
          baseScore = 1;
          break;
        case 'médio':
          baseScore = 2;
          break;
        case 'alto':
          baseScore = 3;
          break;
        case 'muito_alto':
          baseScore = 4;
          break;
      }

      // Add extra points if psychosocial factors are present
      const finalScore = input.hasPsychosocialFactors ? baseScore + 0.5 : baseScore;

      return {
        score: finalScore,
        riskLevel: input.riskLevel,
        recommendation: getRecommendationForScore(finalScore)
      };
    })
});

/**
 * Helper function to get recommendations based on risk score
 */
function getRecommendationForScore(score: number): string {
  if (score <= 1.5) {
    return 'Manutenção das medidas preventivas atuais e monitoramento periódico.';
  } else if (score <= 2.5) {
    return 'Implementar medidas de controle adicionais e aumentar a frequência de monitoramento.';
  } else if (score <= 3.5) {
    return 'Ações corretivas imediatas necessárias. Desenvolver plano de ação detalhado.';
  } else {
    return 'Intervenção urgente necessária. Suspender atividades até implementação de controles adequados.';
  }
}
