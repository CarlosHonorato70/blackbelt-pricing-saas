// backend/src/utils/calculations.ts
import Decimal from 'decimal.js';

export interface PricingInput {
  fixedCosts?: number;
  proLabor?: number;
  productiveHours?: number;
  basePrice?: number;
  estimatedHours: number;
  adjustmentPersonalization: number;
  adjustmentRisk: number;
  adjustmentSeniority: number;
  volumeDiscount: number;
  discountGeneral?: number;
  displacementFee?: number;
  taxRateByRegime?: number;
}

export class PricingCalculator {
  /**
   * Calcula a hora técnica
   * Fórmula: (Custos Fixos + Pró-labore) / Horas Produtivas
   */
  static calculateTechnicalHour(
    fixedCosts: number,
    proLabor: number,
    productiveHours: number
  ): number {
    const result = new Decimal(fixedCosts).plus(new Decimal(proLabor)).dividedBy(new Decimal(productiveHours));
    return result.toNumber();
  }

  /**
   * Calcula valor com impostos
   * Fórmula: Hora Técnica × (1 + Taxa Tributária)
   * taxRate em porcentagem (ex: 10 => 10%)
   */
  static calculateValueWithTaxes(
    technicalHour: number,
    taxRate: number
  ): number {
    const multiplier = new Decimal(1).plus(new Decimal(taxRate).dividedBy(100));
    const result = new Decimal(technicalHour).times(multiplier);
    return result.toNumber();
  }

  /**
   * Calcula valor base
   * Fórmula: Hora Técnica × Horas Estimadas
   */
  static calculateBaseValue(
    technicalHour: number,
    estimatedHours: number
  ): number {
    const result = new Decimal(technicalHour).times(new Decimal(estimatedHours));
    return result.toNumber();
  }

  /**
   * Calcula valor com ajustes
   * Fórmula: Valor Base × (1 + Personalização%) × (1 + Risco%) × (1 + Senioridade%)
   */
  static calculateWithAdjustments(
    baseValue: number,
    personalization: number,
    risk: number,
    seniority: number
  ): number {
    const result = new Decimal(baseValue)
      .times(new Decimal(1).plus(new Decimal(personalization).dividedBy(100)))
      .times(new Decimal(1).plus(new Decimal(risk).dividedBy(100)))
      .times(new Decimal(1).plus(new Decimal(seniority).dividedBy(100)));
    return result.toNumber();
  }

  /**
   * Calcula valor com desconto de volume
   * Fórmula: Com Ajustes × (1 - Desconto por Volume%)
   */
  static calculateWithVolumeDiscount(
    adjustedValue: number,
    volumeDiscount: number
  ): number {
    const result = new Decimal(adjustedValue).times(new Decimal(1).minus(new Decimal(volumeDiscount).dividedBy(100)));
    return result.toNumber();
  }

  /**
   * Calcula valor total da proposta
   * Fórmula: Com Desconto - Desconto Geral + Taxa Deslocamento
   */
  static calculateTotal(
    discountedValue: number,
    generalDiscount: number,
    displacementFee: number
  ): number {
    const result = new Decimal(discountedValue).minus(new Decimal(generalDiscount || 0)).plus(new Decimal(displacementFee || 0));
    return result.toNumber();
  }

  /**
   * Realiza cálculo completo de item de proposta
   *
   * Observação: o cálculo da hora técnica normalmente depende de parâmetros de
   * configuração (fixedCosts, proLabor, productiveHours). Se esses parâmetros
   * não forem fornecidos, aplica um fallback razoável para permitir cálculo
   * local rápido (útil para UI/preview). Para produção, recomendo sempre
   * fornecer os parâmetros de tenant.
   */
  static calculateProposalItem(input: {
    fixedCosts?: number;
    proLabor?: number;
    productiveHours?: number;
    basePrice?: number;
    estimatedHours: number;
    taxRate: number;
    adjustmentPersonalization?: number;
    adjustmentRisk?: number;
    adjustmentSeniority?: number;
    volumeDiscount?: number;
  }): {
    technicalHour: number;
    valueWithTaxes: number;
    baseValue: number;
    adjustedValue: number;
    discountedValue: number;
  } {
    // Fallbacks se parâmetros não estiverem disponíveis (melhor enviar valores reais do tenant)
    const fixedCosts = input.fixedCosts ?? (input.basePrice ? input.basePrice * 1 : 0);
    const proLabor = input.proLabor ?? (input.basePrice ? input.basePrice * 0.2 : 0);
    const productiveHours = input.productiveHours ?? 160;

    const technicalHour = this.calculateTechnicalHour(fixedCosts, proLabor, productiveHours);
    const valueWithTaxes = this.calculateValueWithTaxes(technicalHour, input.taxRate);
    const baseValue = this.calculateBaseValue(valueWithTaxes, input.estimatedHours);
    const adjustedValue = this.calculateWithAdjustments(
      baseValue,
      input.adjustmentPersonalization ?? 0,
      input.adjustmentRisk ?? 0,
      input.adjustmentSeniority ?? 0
    );
    const discountedValue = this.calculateWithVolumeDiscount(
      adjustedValue,
      input.volumeDiscount ?? 0
    );

    return {
      technicalHour,
      valueWithTaxes,
      baseValue,
      adjustedValue,
      discountedValue
    };
  }

  /**
   * Retorna taxa por regime a partir de um objeto de taxas (ex.: do DB)
   */
  static getTaxRateByRegime(regime: string, taxRates: Record<string, number>): number {
    const rateKeyMap: Record<string, string> = {
      'MEI': 'taxRateMEI',
      'Simples Nacional': 'taxRateSimples',
      'Lucro Presumido': 'taxRateLucroPresumido',
      'Autônomo': 'taxRateAutonomo'
    };
    const key = rateKeyMap[regime] || '';
    return key && taxRates[key] != null ? taxRates[key] : 0;
  }
}

export default PricingCalculator;