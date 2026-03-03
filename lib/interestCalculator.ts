/**
 * Investment Cycle and Pro-rated Interest Calculator
 * 
 * Investment cycles run biannually:
 * - Cycle 1: February through May (4 months)
 * - Cycle 2: September through December (4 months)
 * 
 * Interest rate: 8% per month
 * Full cycle return: 8% × 4 months = 32%
 * 
 * Pro-rated calculation:
 * - Deposits made during a cycle earn interest only for remaining months
 * - Example: Deposit in March of Feb-May cycle → 3 months → 24% interest
 */

export interface InvestmentCycle {
  name: string;
  startMonth: number; // 0-based (0 = January)
  endMonth: number;   // 0-based (4 = May)
  year: number;
}

export interface DepositInterestCalculation {
  depositDate: Date;
  amount: number;
  cycle: InvestmentCycle;
  monthsInCycle: number;
  interestRate: number; // As decimal (e.g., 0.24 for 24%)
  interestAmount: number;
  totalValue: number;
}

const MONTHLY_INTEREST_RATE = 0.08; // 8% per month

/**
 * Get all active investment cycles
 */
export function getInvestmentCycles(year: number): InvestmentCycle[] {
  return [
    {
      name: `Feb-May ${year}`,
      startMonth: 1,  // February (0-based)
      endMonth: 4,    // May (0-based)
      year: year
    },
    {
      name: `Sep-Dec ${year}`,
      startMonth: 8,  // September (0-based)
      endMonth: 11,   // December (0-based)
      year: year
    }
  ];
}

/**
 * Determine which cycle a deposit date falls into
 * Returns the cycle if deposit is eligible, null otherwise
 */
export function getDepositCycle(depositDate: Date): InvestmentCycle | null {
  const year = depositDate.getFullYear();
  const month = depositDate.getMonth(); // 0-based
  
  const cycles = getInvestmentCycles(year);
  
  // Check current year cycles
  for (const cycle of cycles) {
    if (month <= cycle.endMonth && month >= cycle.startMonth - 1) {
      // Deposits made in the month before cycle starts or during the cycle are eligible
      // (e.g., January deposits are eligible for Feb-May cycle)
      return cycle;
    }
  }
  
  // Check if deposit is in previous cycle's range
  const previousYearCycles = getInvestmentCycles(year - 1);
  for (const cycle of previousYearCycles) {
    const cycleEndDate = new Date(cycle.year, cycle.endMonth + 1, 0); // Last day of end month
    if (depositDate <= cycleEndDate) {
      return cycle;
    }
  }
  
  // Check if deposit should be in next cycle
  if (month === 0) {
    // January deposits go to Feb-May of same year
    return cycles[0];
  }
  
  if (month >= 5 && month <= 7) {
    // June, July, August deposits go to Sep-Dec of same year
    return cycles[1];
  }
  
  return null;
}

/**
 * Calculate remaining months in cycle from deposit date
 */
export function calculateRemainingMonths(depositDate: Date, cycle: InvestmentCycle): number {
  const depositMonth = depositDate.getMonth();
  const depositYear = depositDate.getFullYear();
  
  // If deposit is before cycle starts, they get full cycle
  if (depositYear < cycle.year || (depositYear === cycle.year && depositMonth < cycle.startMonth)) {
    return 4; // Full cycle
  }
  
  // If deposit is during cycle, calculate remaining months (inclusive)
  if (depositYear === cycle.year && depositMonth >= cycle.startMonth && depositMonth <= cycle.endMonth) {
    return cycle.endMonth - depositMonth + 1;
  }
  
  // Default to full cycle
  return 4;
}

/**
 * Calculate pro-rated interest for a single deposit
 */
export function calculateDepositInterest(
  depositDate: Date,
  amount: number,
  cycle?: InvestmentCycle | null
): DepositInterestCalculation | null {
  // Determine cycle if not provided
  const depositCycle = cycle || getDepositCycle(depositDate);
  
  if (!depositCycle) {
    return null; // Deposit doesn't fall in any cycle
  }
  
  const monthsInCycle = calculateRemainingMonths(depositDate, depositCycle);
  const interestRate = MONTHLY_INTEREST_RATE * monthsInCycle;
  const interestAmount = amount * interestRate;
  const totalValue = amount + interestAmount;
  
  return {
    depositDate,
    amount,
    cycle: depositCycle,
    monthsInCycle,
    interestRate,
    interestAmount,
    totalValue
  };
}

/**
 * Calculate total interest for multiple deposits across potentially different cycles
 */
export function calculateTotalInterest(
  deposits: Array<{ date: Date | string; amount: number }>,
  targetCycle?: InvestmentCycle
): {
  totalPrincipal: number;
  totalInterest: number;
  totalValue: number;
  deposits: DepositInterestCalculation[];
} {
  const calculations: DepositInterestCalculation[] = [];
  let totalPrincipal = 0;
  let totalInterest = 0;
  
  for (const deposit of deposits) {
    const depositDate = typeof deposit.date === 'string' ? new Date(deposit.date) : deposit.date;
    const calc = calculateDepositInterest(depositDate, deposit.amount, targetCycle);
    
    if (calc) {
      calculations.push(calc);
      totalPrincipal += calc.amount;
      totalInterest += calc.interestAmount;
    }
  }
  
  return {
    totalPrincipal,
    totalInterest,
    totalValue: totalPrincipal + totalInterest,
    deposits: calculations
  };
}

/**
 * Get current active cycle
 */
export function getCurrentCycle(): InvestmentCycle {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const cycles = getInvestmentCycles(currentYear);
  
  // Feb-May cycle
  if (currentMonth >= 1 && currentMonth <= 4) {
    return cycles[0];
  }
  
  // Sep-Dec cycle
  if (currentMonth >= 8 && currentMonth <= 11) {
    return cycles[1];
  }
  
  // Between cycles - return next upcoming cycle
  if (currentMonth === 0 || (currentMonth >= 5 && currentMonth <= 7)) {
    return cycles[currentMonth === 0 ? 0 : 1];
  }
  
  return cycles[0]; // Default
}

/**
 * Format interest calculation for display
 */
export function formatInterestCalculation(calc: DepositInterestCalculation): string {
  const percentage = (calc.interestRate * 100).toFixed(0);
  return `${calc.monthsInCycle} months @ 8% = ${percentage}% total return`;
}
