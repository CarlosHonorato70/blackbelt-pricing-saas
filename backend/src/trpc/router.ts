import { router } from './trpc';
import { pricingRouter } from './routers/pricing';
import { proposalsRouter } from './routers/proposals';
import { riskAssessmentsRouter } from './routers/risk-assessments';

/**
 * Main application router
 * Aggregates all sub-routers
 */
export const appRouter = router({
  pricing: pricingRouter,
  proposals: proposalsRouter,
  riskAssessments: riskAssessmentsRouter
});

export type AppRouter = typeof appRouter;
