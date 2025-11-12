import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { db } from '../../database';
import { proposals, proposalItems, clients, services } from '../../database/schema';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { calculateProposalTotal } from '../../utils/calculations';

export const proposalsRouter = router({
  /**
   * List all proposals for a tenant
   */
  list: publicProcedure
    .input(z.object({ tenantId: z.string() }))
    .query(async ({ input }) => {
      return await db
        .select()
        .from(proposals)
        .where(eq(proposals.tenantId, input.tenantId));
    }),

  /**
   * Get a single proposal by ID with items
   */
  getById: publicProcedure
    .input(z.object({ id: z.string(), tenantId: z.string() }))
    .query(async ({ input }) => {
      const [proposal] = await db
        .select()
        .from(proposals)
        .where(
          and(
            eq(proposals.id, input.id),
            eq(proposals.tenantId, input.tenantId)
          )
        )
        .limit(1);

      if (!proposal) {
        throw new Error('Proposal not found');
      }

      const items = await db
        .select()
        .from(proposalItems)
        .where(eq(proposalItems.proposalId, input.id));

      const [client] = await db
        .select()
        .from(clients)
        .where(eq(clients.id, proposal.clientId))
        .limit(1);

      return {
        ...proposal,
        items,
        client
      };
    }),

  /**
   * Create a new proposal
   */
  create: publicProcedure
    .input(
      z.object({
        tenantId: z.string(),
        clientId: z.string(),
        title: z.string(),
        description: z.string().optional(),
        discountGeneral: z.number().default(0),
        displacementFee: z.number().default(0)
      })
    )
    .mutation(async ({ input }) => {
      const proposalId = uuidv4();

      const [newProposal] = await db.insert(proposals).values({
        id: proposalId,
        clientId: input.clientId,
        title: input.title,
        description: input.description,
        status: 'draft',
        totalValue: '0.00',
        discountGeneral: input.discountGeneral.toString(),
        displacementFee: input.displacementFee.toString(),
        tenantId: input.tenantId
      });

      return { id: proposalId, ...newProposal };
    }),

  /**
   * Update a proposal
   */
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        tenantId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['draft', 'sent', 'approved', 'rejected', 'archived']).optional(),
        discountGeneral: z.number().optional(),
        displacementFee: z.number().optional()
      })
    )
    .mutation(async ({ input }) => {
      const { id, tenantId, ...updateData } = input;

      const updateFields: any = {};
      if (updateData.title) updateFields.title = updateData.title;
      if (updateData.description !== undefined) updateFields.description = updateData.description;
      if (updateData.status) updateFields.status = updateData.status;
      if (updateData.discountGeneral !== undefined) 
        updateFields.discountGeneral = updateData.discountGeneral.toString();
      if (updateData.displacementFee !== undefined) 
        updateFields.displacementFee = updateData.displacementFee.toString();

      await db
        .update(proposals)
        .set(updateFields)
        .where(
          and(
            eq(proposals.id, id),
            eq(proposals.tenantId, tenantId)
          )
        );

      return { success: true };
    }),

  /**
   * Delete a proposal
   */
  delete: publicProcedure
    .input(z.object({ id: z.string(), tenantId: z.string() }))
    .mutation(async ({ input }) => {
      // Delete items first
      await db
        .delete(proposalItems)
        .where(eq(proposalItems.proposalId, input.id));

      // Delete proposal
      await db
        .delete(proposals)
        .where(
          and(
            eq(proposals.id, input.id),
            eq(proposals.tenantId, input.tenantId)
          )
        );

      return { success: true };
    }),

  /**
   * Add item to proposal
   */
  addItem: publicProcedure
    .input(
      z.object({
        proposalId: z.string(),
        serviceId: z.string(),
        quantity: z.number().positive(),
        unitPrice: z.number(),
        adjustmentPersonalization: z.number().default(0),
        adjustmentRisk: z.number().default(0),
        adjustmentSeniority: z.number().default(0),
        volumeDiscount: z.number().default(0),
        totalValue: z.number()
      })
    )
    .mutation(async ({ input }) => {
      const itemId = uuidv4();

      await db.insert(proposalItems).values({
        id: itemId,
        proposalId: input.proposalId,
        serviceId: input.serviceId,
        quantity: input.quantity,
        unitPrice: input.unitPrice.toString(),
        adjustmentPersonalization: input.adjustmentPersonalization.toString(),
        adjustmentRisk: input.adjustmentRisk.toString(),
        adjustmentSeniority: input.adjustmentSeniority.toString(),
        volumeDiscount: input.volumeDiscount.toString(),
        totalValue: input.totalValue.toString()
      });

      // Recalculate proposal total
      await recalculateProposalTotal(input.proposalId);

      return { id: itemId };
    }),

  /**
   * Remove item from proposal
   */
  removeItem: publicProcedure
    .input(z.object({ itemId: z.string(), proposalId: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .delete(proposalItems)
        .where(eq(proposalItems.id, input.itemId));

      // Recalculate proposal total
      await recalculateProposalTotal(input.proposalId);

      return { success: true };
    })
});

/**
 * Helper function to recalculate proposal total
 */
async function recalculateProposalTotal(proposalId: string) {
  const [proposal] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, proposalId))
    .limit(1);

  if (!proposal) return;

  const items = await db
    .select()
    .from(proposalItems)
    .where(eq(proposalItems.proposalId, proposalId));

  const itemsTotal = items.reduce((sum, item) => sum + Number(item.totalValue), 0);

  const totalValue = calculateProposalTotal(
    itemsTotal,
    Number(proposal.discountGeneral),
    Number(proposal.displacementFee)
  );

  await db
    .update(proposals)
    .set({ totalValue: totalValue.toString() })
    .where(eq(proposals.id, proposalId));
}
