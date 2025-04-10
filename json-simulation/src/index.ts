/**
 * Equihome Portfolio Management System - JSON Simulation Engine
 * 
 * This is the main entry point for the JSON Simulation Engine.
 * It exports all the functionality from the various modules.
 */

// Export all calculations
export * from './utils/calculations';

// Export worker URL for easy instantiation
export const SIMULATION_WORKER_URL = new URL('./workers/simulationWorker.ts', import.meta.url).href;

/**
 * Create a new simulation worker instance
 * @returns A new Web Worker instance for running simulations
 */
export function createSimulationWorker(): Worker {
  return new Worker(SIMULATION_WORKER_URL);
}

/**
 * Default simulation parameters
 */
export const DEFAULT_PARAMS = {
  initialInvestment: 50000000,  // Initial fund size ($)
  interestRate: 5.0,            // Annual interest rate (%)
  propertyAppreciation: 3.0,    // Annual property appreciation rate (%)
  defaultRate: 1.0,             // Annual default rate (%)
  reinvestmentRate: 70.0,       // Percentage of returns reinvested (%)
  targetLtv: 60.0,              // Target loan-to-value ratio (%)
  avgTermLength: 2.0,           // Average loan term length (years)
  initialDeploymentPeriod: 3.0, // Initial capital deployment period (years)
  lastReinvestmentYear: 7.0,    // Last year when capital can be reinvested
  managementFee: 2.0,           // Annual management fee (%)
  performanceFee: 20.0,         // Performance fee on profits above hurdle (%)
  hurdleRate: 8.0,              // Hurdle rate for performance fee (%)
  upfrontFee: 3.0,              // Upfront fee on loan origination (%)
  timeHorizon: 10,              // Fund lifetime (years)
  volatility: 2.0,              // Volatility in simulation outcomes (%)
  numSimulations: 1000,         // Number of Monte Carlo simulations
  earlyRepaymentRate: 15.0,     // Annual early repayment rate (%)
  waterfallType: 'european',    // Waterfall structure (european, american, hybrid)
  zoneAllocation: { green: 60, orange: 30, red: 10 },  // Zone allocation (%)
  geographyAllocation: { sydney: 70, melbourne: 20, brisbane: 10 }  // Geography allocation (%)
};

/**
 * Simulation worker message types
 */
export enum SimulationMessageType {
  MONTE_CARLO = 'monteCarlo',
  PORTFOLIO_PROJECTIONS = 'portfolioProjections',
  SENSITIVITY_ANALYSIS = 'sensitivityAnalysis',
  COMPARE_SCENARIOS = 'compareScenarios',
  CLEAR_CACHE = 'clearCache',
  CANCEL = 'cancel'
}

/**
 * Simulation worker response types
 */
export enum SimulationResponseType {
  MONTE_CARLO_RESULTS = 'monteCarloResults',
  PORTFOLIO_PROJECTIONS = 'portfolioProjections',
  SENSITIVITY_RESULTS = 'sensitivityResults',
  COMPARISON_RESULTS = 'comparisonResults',
  PROGRESS = 'progress',
  ERROR = 'error',
  CANCELLED = 'cancelled',
  CACHE_CLEARED = 'cacheCleared'
}

/**
 * Interface for simulation parameters
 */
export interface SimulationParameters {
  initialInvestment?: number;
  interestRate?: number;
  propertyAppreciation?: number;
  defaultRate?: number;
  reinvestmentRate?: number;
  targetLtv?: number;
  avgTermLength?: number;
  initialDeploymentPeriod?: number;
  lastReinvestmentYear?: number;
  managementFee?: number;
  performanceFee?: number;
  hurdleRate?: number;
  upfrontFee?: number;
  timeHorizon?: number;
  volatility?: number;
  numSimulations?: number;
  earlyRepaymentRate?: number;
  waterfallType?: 'european' | 'american' | 'hybrid';
  zoneAllocation?: Record<string, number>;
  geographyAllocation?: Record<string, number>;
}

/**
 * Interface for worker message
 */
export interface WorkerMessage {
  type: SimulationMessageType;
  data: any;
  id?: string;
}

/**
 * Interface for worker response
 */
export interface WorkerResponse {
  type: SimulationResponseType;
  data: any;
  id?: string;
}

/**
 * Interface for progress data
 */
export interface ProgressData {
  task: string;
  progress: number;
  status?: 'started' | 'running' | 'completed' | 'failed';
  message?: string;
  currentChunk?: number;
  totalChunks?: number;
  processedSimulations?: number;
  totalSimulations?: number;
}

/**
 * Interface for sensitivity analysis result
 */
export interface SensitivityResult {
  parameter: string;
  sensitivity: number;
}

/**
 * Interface for scenario comparison result
 */
export interface ScenarioComparisonResult {
  name: string;
  irr: number | null;
  equityMultiple: number;
  cashFlows: number[];
}

/**
 * Interface for portfolio projection
 */
export interface PortfolioProjection {
  year: number;
  median: number;
  percentile_5: number;
  percentile_25: number;
  percentile_75: number;
  percentile_95: number;
}
