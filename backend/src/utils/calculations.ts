/**
 * Utility functions for pricing calculations
 */

export interface TechnicalHourParams {
  fixedCosts: number;
  proLabor: number;
  productiveHours: number;
  taxRate: number;
}

export interface ItemCalculationParams {
  basePrice: number;
  estimatedHours: number;
  quantity: number;
  adjustmentPersonalization: number;
  adjustmentRisk: number;
  adjustmentSeniority: number;
  volumeDiscount: number;
}

/**
 * Calculate technical hour rate based on costs and parameters
 */
export function calculateTechnicalHour(params: TechnicalHourParams): number {
  const { fixedCosts, proLabor, productiveHours, taxRate } = params;
  
  if (productiveHours <= 0) {
    return 0;
  }
  
  const hourBase = (fixedCosts + proLabor) / productiveHours;
  const hourWithTax = hourBase * (1 + taxRate / 100);
  
  return hourWithTax;
}

/**
 * Get volume discount percentage based on quantity
 */
export function getVolumeDiscount(quantity: number): number {
  if (quantity >= 6 && quantity <= 15) {
    return 5; // 5%
  } else if (quantity >= 16 && quantity <= 30) {
    return 10; // 10%
  } else if (quantity > 30) {
    return 15; // 15%
  }
  return 0;
}

/**
 * Calculate total value for a proposal item
 */
export function calculateItemTotal(params: ItemCalculationParams): number {
  const {
    basePrice,
    estimatedHours,
    quantity,
    adjustmentPersonalization,
    adjustmentRisk,
    adjustmentSeniority,
    volumeDiscount
  } = params;
  
  // Base value calculation
  let value = basePrice * estimatedHours * quantity;
  
  // Apply adjustments (multiplicative)
  value = value * (1 + adjustmentPersonalization / 100);
  value = value * (1 + adjustmentRisk / 100);
  value = value * (1 + adjustmentSeniority / 100);
  
  // Apply volume discount
  value = value * (1 - volumeDiscount / 100);
  
  return value;
}

/**
 * Calculate proposal total with general discount and fees
 */
export function calculateProposalTotal(
  itemsTotal: number,
  discountGeneral: number,
  displacementFee: number
): number {
  const totalWithDiscount = itemsTotal * (1 - discountGeneral / 100);
  return totalWithDiscount + displacementFee;
}

/**
 * Get tax rate based on tax regime
 */
export function getTaxRateForRegime(
  regime: string,
  params: {
    taxRateMEI: number;
    taxRateSimples: number;
    taxRateLucroPresumido: number;
    taxRateAutonomo: number;
  }
): number {
  switch (regime) {
    case 'MEI':
      return params.taxRateMEI;
    case 'Simples Nacional':
      return params.taxRateSimples;
    case 'Lucro Presumido':
      return params.taxRateLucroPresumido;
    case 'Autônomo':
      return params.taxRateAutonomo;
    default:
      return 0;
  }
}
