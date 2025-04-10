/**
 * Equihome Portfolio Management System - Mathematical Calculations
 *
 * This file contains all the mathematical formulas used in the simulation engine.
 * It serves as documentation and a central place for all calculations.
 */

/**
 * Calculate the Internal Rate of Return (IRR) for a series of cash flows
 *
 * @param cashFlows Array of cash flows
 * @param timePoints Array of time points (e.g., [0, 2, 4] for years)
 * @returns The IRR as a decimal (e.g., 0.15 for 15%)
 */
export const calculateIrr = (cashFlows: number[], timePoints?: number[]): number | null => {
  if (cashFlows.length < 2) return null;

  const times = timePoints || cashFlows.map((_, i) => i);
  if (cashFlows.length !== times.length) return null;

  let guess = 0.1;
  const maxIterations = 1000;
  const tolerance = 0.0000001;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivativeNpv = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      const factor = Math.pow(1 + guess, -times[j]);
      npv += cashFlows[j] * factor;
      derivativeNpv -= times[j] * cashFlows[j] * Math.pow(1 + guess, -times[j] - 1);
    }

    if (Math.abs(npv) < tolerance) {
      return guess;
    }

    const newGuess = guess - npv / derivativeNpv;
    if (Math.abs(newGuess - guess) < tolerance) {
      return newGuess;
    }

    guess = newGuess;

    if (guess < -1) {
      return null;
    }
  }

  return null;
};

/**
 * Calculate the equity multiple
 *
 * Equity Multiple = Total Returns / Initial Investment
 *
 * @param totalReturns Total returns from the investment (sum of all positive cash flows)
 * @param initialInvestment Initial investment amount (positive number)
 * @returns The equity multiple (e.g., 2.5 means 2.5x the initial investment)
 */
export const calculateEquityMultiple = (totalReturns: number, initialInvestment: number): number => {
  return totalReturns / initialInvestment;
};

/**
 * Calculate the Sharpe Ratio
 *
 * Sharpe Ratio = (Expected Return - Risk-Free Rate) / Standard Deviation of Returns
 *
 * @param expectedReturn Expected annual return (decimal)
 * @param riskFreeRate Risk-free rate (decimal)
 * @param volatility Standard deviation of returns (decimal)
 * @returns The Sharpe Ratio
 */
export const calculateSharpeRatio = (expectedReturn: number, riskFreeRate: number, volatility: number): number => {
  if (volatility === 0) return Infinity;
  return (expectedReturn - riskFreeRate) / volatility;
};

/**
 * Calculate the Maximum Drawdown
 *
 * Maximum Drawdown = (Peak Value - Trough Value) / Peak Value
 *
 * @param values Array of portfolio values over time
 * @returns The maximum drawdown as a decimal (e.g., 0.25 for 25%)
 */
export const calculateMaxDrawdown = (values: number[]): number => {
  if (values.length < 2) return 0;
  let maxDrawdown = 0;
  let peak = values[0];

  for (let i = 1; i < values.length; i++) {
    if (values[i] > peak) {
      peak = values[i];
    } else {
      const drawdown = peak > 0 ? (peak - values[i]) / peak : 0;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }

  return maxDrawdown;
};

/**
 * Calculate the simple interest
 *
 * Simple Interest = Principal × Rate × Time
 *
 * @param principal Principal amount
 * @param rate Annual interest rate (decimal)
 * @param years Time in years
 * @returns The simple interest amount
 */
export const calculateSimpleInterest = (principal: number, rate: number, years: number): number => {
  return principal * rate * years;
};

/**
 * Calculate the compound interest
 *
 * Compound Interest = Principal × (1 + Rate)^Time - Principal
 *
 * @param principal Principal amount
 * @param rate Annual interest rate (decimal)
 * @param years Time in years
 * @returns The compound interest amount
 */
export const calculateCompoundInterest = (principal: number, rate: number, years: number): number => {
  return principal * Math.pow(1 + rate, years) - principal;
};

/**
 * Calculate the loan amount based on property value and LTV
 *
 * Loan Amount = Property Value × LTV
 *
 * @param propertyValue Property value
 * @param ltv Loan-to-Value ratio (decimal)
 * @returns The loan amount
 */
export const calculateLoanAmount = (propertyValue: number, ltv: number): number => {
  return propertyValue * ltv;
};

/**
 * Calculate the appreciation share based on property appreciation and LTV
 *
 * Appreciation Share = Property Appreciation × LTV
 *
 * @param propertyAppreciation Property appreciation amount
 * @param ltv Loan-to-Value ratio (decimal)
 * @returns The appreciation share amount
 */
export const calculateAppreciationShare = (propertyAppreciation: number, ltv: number): number => {
  return propertyAppreciation * ltv;
};

/**
 * Calculate the total return from a loan (including upfront fee paid by homeowner)
 *
 * Total Return = Principal + Simple Interest + Appreciation Share + Upfront Fee
 *
 * @param principal Principal amount
 * @param interest Interest amount
 * @param appreciationShare Appreciation share amount
 * @param upfrontFee Upfront fee paid by homeowner
 * @returns The total return amount
 */
export const calculateTotalReturn = (principal: number, interest: number, appreciationShare: number, upfrontFee: number): number => {
  return principal + interest + appreciationShare + upfrontFee;
};

/**
 * Calculate the management fee
 *
 * Management Fee = AUM × Management Fee Rate
 *
 * @param aum Assets Under Management
 * @param managementFeeRate Management fee rate (decimal)
 * @returns The management fee amount
 */
export const calculateManagementFee = (aum: number, managementFeeRate: number): number => {
  return aum * managementFeeRate;
};

/**
 * Calculate the performance fee
 *
 * Performance Fee = (Return - Hurdle Rate × Principal) × Performance Fee Rate
 *
 * @param totalReturn Total return amount
 * @param principal Principal amount
 * @param hurdleRate Hurdle rate (decimal)
 * @param performanceFeeRate Performance fee rate (decimal)
 * @param years Time in years
 * @returns The performance fee amount
 */
export const calculatePerformanceFee = (
  totalReturn: number,
  principal: number,
  hurdleRate: number,
  performanceFeeRate: number,
  years: number
): number => {
  const hurdleAmount = principal * Math.pow(1 + hurdleRate, years);
  const excessReturn = Math.max(0, totalReturn - hurdleAmount);
  return excessReturn * performanceFeeRate;
};

/**
 * Calculate the upfront fee
 *
 * Upfront Fee = Loan Amount × Upfront Fee Rate
 *
 * @param loanAmount Loan amount
 * @param upfrontFeeRate Upfront fee rate (decimal)
 * @returns The upfront fee amount
 */
export const calculateUpfrontFee = (loanAmount: number, upfrontFeeRate: number): number => {
  return loanAmount * upfrontFeeRate;
};

/**
 * Calculate the net return to LP per loan (after fees)
 *
 * Net Return = Gross Return - Management Fee (prorated) - Performance Fee
 *
 * @param grossReturn Gross return amount
 * @param managementFeePerDeal Prorated management fee for the deal
 * @param performanceFee Performance fee amount
 * @returns The net return amount
 */
export const calculateNetReturn = (grossReturn: number, managementFeePerDeal: number, performanceFee: number): number => {
  return grossReturn - managementFeePerDeal - performanceFee;
};

/**
 * Calculate the LP profit and reinvestment amount at homeowner exit
 *
 * @param totalReturn Total return from the loan
 * @param principal Principal amount
 * @param managementFeePerDeal Prorated management fee
 * @param performanceFee Performance fee
 * @returns Object with LP profit and amount to reinvest
 */
export const calculateRecyclingPayout = (
  totalReturn: number,
  principal: number,
  managementFeePerDeal: number,
  performanceFee: number
): { lpProfit: number; reinvestAmount: number } => {
  const profit = totalReturn - principal;
  const lpProfit = profit - managementFeePerDeal - performanceFee;
  const reinvestAmount = principal;
  return { lpProfit, reinvestAmount };
};

/**
 * Calculate the LP cash flow for a given year
 *
 * LP Cash Flow = LP Profit Payout (from recycling) + Capital Returned (at fund close)
 *
 * @param lpProfit LP profit payout for the year
 * @param capitalReturned Capital returned amount (at fund close)
 * @returns The LP cash flow amount
 */
export const calculateLpCashFlow = (lpProfit: number, capitalReturned: number): number => {
  return lpProfit + capitalReturned;
};

/**
 * Calculate the GP cash flow for a given year
 *
 * GP Cash Flow = Management Fee + Performance Fee + Upfront Fee
 *
 * @param managementFee Management fee amount (consistent yearly)
 * @param performanceFee Performance fee amount (from exits)
 * @param upfrontFee Upfront fee amount (at loan origination)
 * @returns The GP cash flow amount
 */
export const calculateGpCashFlow = (managementFee: number, performanceFee: number, upfrontFee: number): number => {
  return managementFee + performanceFee + upfrontFee;
};

/**
 * Calculate the fund cash flow for a given year
 *
 * Fund Cash Flow = Inflows (loan repayments) - Outflows (new loans deployed) - Management Fees
 *
 * @param loanRepayments Total loan repayments (including interest, appreciation, upfront fees)
 * @param newLoansDeployed New loans deployed (reinvestment)
 * @param managementFee Management fee paid to GP
 * @returns The fund cash flow amount
 */
export const calculateFundCashFlow = (loanRepayments: number, newLoansDeployed: number, managementFee: number): number => {
  return loanRepayments - newLoansDeployed - managementFee;
};

/**
 * Calculate the catch-up distribution for a European waterfall
 *
 * @param totalProfit Total profit to distribute
 * @param catchUpPercentage Percentage of profits allocated to GP during catch-up
 * @param lpPreferredReturn LP preferred return amount
 * @returns Object with LP and GP profit shares during catch-up phase
 */
export const calculateCatchUpDistribution = (
  totalProfit: number,
  catchUpPercentage: number,
  lpPreferredReturn: number
): { lpProfit: number; gpProfit: number } => {
  const lpProfit = Math.min(totalProfit, lpPreferredReturn);
  const remainingProfit = totalProfit - lpProfit;
  const gpCatchUp = remainingProfit * (catchUpPercentage / 100);
  const lpCatchUp = remainingProfit - gpCatchUp;
  return { lpProfit: lpProfit + lpCatchUp, gpProfit: gpCatchUp };
};

/**
 * Calculate Value at Risk (VaR) at a given confidence level
 *
 * @param returns Array of portfolio returns
 * @param confidenceLevel Confidence level (e.g., 95 for 95%)
 * @returns The VaR value (negative number representing potential loss)
 */
export const calculateVaR = (returns: number[], confidenceLevel: number): number => {
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidenceLevel / 100) * sortedReturns.length);
  return sortedReturns[index];
};

/**
 * Calculate the portfolio value at a given time
 *
 * @param initialValue Initial portfolio value
 * @param cashFlows Array of cash flows (inflows/outflows)
 * @param timePoints Array of time points for cash flows
 * @param time Time at which to calculate the value
 * @param growthRate Annual growth rate (decimal)
 * @returns The portfolio value at the specified time
 */
export const calculatePortfolioValue = (
  initialValue: number,
  cashFlows: number[],
  timePoints: number[],
  time: number,
  growthRate: number
): number => {
  let value = initialValue;
  for (let i = 0; i < cashFlows.length; i++) {
    if (timePoints[i] <= time) {
      const growthPeriod = time - timePoints[i];
      value += cashFlows[i] * Math.pow(1 + growthRate, growthPeriod);
    }
  }
  return value;
};

/**
 * Generate a random normal variable using the Box-Muller transform
 *
 * @returns A random normal variable with mean 0 and standard deviation 1
 */
export const generateRandomNormal = (): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
};

/**
 * Generate a random value for a parameter based on its expected value and volatility
 *
 * @param expectedValue Expected value of the parameter
 * @param volatility Volatility of the parameter (percentage)
 * @returns A random value for the parameter
 */
export const generateRandomValue = (expectedValue: number, volatility: number): number => {
  const randomNormal = generateRandomNormal();
  return expectedValue * (1 + (volatility * randomNormal) / 100);
};

/**
 * Calculate the early exit probability based on loan age
 *
 * @param earlyRepaymentRate Annual early repayment rate (percentage)
 * @param monthsSinceOrigination Months since loan origination
 * @param avgTermLength Average term length in years
 * @returns The probability of early exit in the current month
 */
export const calculateEarlyExitProbability = (
  earlyRepaymentRate: number,
  monthsSinceOrigination: number,
  avgTermLength: number
): number => {
  return (earlyRepaymentRate / 100) * Math.exp(-monthsSinceOrigination / (avgTermLength * 6)) / 12;
};

/**
 * Calculate the default probability based on loan age
 *
 * @param defaultRate Annual default rate (percentage)
 * @param monthsSinceOrigination Months since loan origination
 * @param avgTermLength Average term length in years
 * @returns The probability of default in the current month
 */
export const calculateDefaultProbability = (
  defaultRate: number,
  monthsSinceOrigination: number,
  avgTermLength: number
): number => {
  // Convert annual default rate to monthly
  // Adjust for loan age - defaults are more likely as loans age
  // But cap the maximum monthly default probability
  const monthlyBaseRate = defaultRate / 100 / 12;
  const ageAdjustment = 1 + (monthsSinceOrigination / (avgTermLength * 12));
  return Math.min(monthlyBaseRate * ageAdjustment, defaultRate / 100 / 6); // Cap at 2x the monthly rate
};

/**
 * Calculate the scheduled exit probability based on loan age
 *
 * @param monthsSinceOrigination Months since loan origination
 * @param avgTermLength Average term length in years
 * @returns The probability of scheduled exit in the current month
 */
export const calculateScheduledExitProbability = (
  monthsSinceOrigination: number,
  avgTermLength: number
): number => {
  return monthsSinceOrigination >= avgTermLength * 12 - 12 ? 1 / 12 : 1 / (avgTermLength * 12 * 10);
};

/**
 * Calculate the percentile from an array of values
 *
 * @param values Array of values
 * @param percentile Percentile to calculate (0-100)
 * @returns The value at the specified percentile
 */
export const calculatePercentile = (values: number[], percentile: number): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);

  if (Number.isInteger(index)) {
    return sorted[index];
  } else {
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  }
};
