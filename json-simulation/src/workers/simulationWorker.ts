/**
 * Web Worker for Portfolio Simulation Engine
 *
 * This worker handles computationally intensive tasks like:
 * - Monte Carlo simulations
 * - IRR calculations
 * - Sensitivity analysis
 */

import {
  calculateIrr,
  calculateEquityMultiple,
  calculatePercentile,
  generateRandomValue,
} from '../utils/calculations';

// Cache for memoization
const cache: Record<string, any> = {};

/**
 * Memoization helper function
 * @param fn Function to memoize
 * @param keyFn Function to generate cache key
 * @returns Memoized function
 */
function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args)
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn(...args);
    if (key in cache) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  }) as T;
}

// Memoized IRR calculation
const memoizedIrr = memoize(calculateIrr, (cashFlows, timePoints) => {
  return `irr-${cashFlows.join('-')}-${timePoints?.join('-') || ''}`;
});

/**
 * Run Monte Carlo simulation with chunked processing and progress tracking
 */
function runMonteCarloSimulation(params: {
  initialInvestment: number;
  timeHorizon: number;
  interestRate: number;
  propertyAppreciation: number;
  defaultRate: number;
  volatility: number;
  numSimulations: number;
  chunkSize?: number; // Optional chunk size for processing
  reportProgress?: boolean; // Whether to report progress
}) {
  const {
    initialInvestment,
    timeHorizon,
    interestRate,
    propertyAppreciation,
    defaultRate,
    volatility,
    numSimulations,
    chunkSize = 1000, // Default chunk size
    reportProgress = true, // Default to reporting progress
  } = params;

  // Use typed arrays for better performance
  const results = new Array(numSimulations);

  // Calculate number of chunks
  const numChunks = Math.ceil(numSimulations / chunkSize);

  // Process in chunks for better responsiveness
  for (let chunk = 0; chunk < numChunks; chunk++) {
    const startSim = chunk * chunkSize;
    const endSim = Math.min((chunk + 1) * chunkSize, numSimulations);

    // Process this chunk
    for (let sim = startSim; sim < endSim; sim++) {
      // Generate random variations of key parameters
      const randomInterestRate = generateRandomValue(interestRate, volatility);
      const randomPropertyAppreciation = generateRandomValue(propertyAppreciation, volatility);
      const randomDefaultRate = generateRandomValue(defaultRate, volatility);

      // Use Float64Array for better performance with large datasets
      const simValues = new Float64Array(timeHorizon + 1);
      simValues[0] = initialInvestment;

      for (let year = 1; year <= timeHorizon; year++) {
        // Simple growth model for Monte Carlo
        const prevValue = simValues[year - 1];
        const effectiveReturn = (randomInterestRate + randomPropertyAppreciation - randomDefaultRate) / 100;
        simValues[year] = prevValue * (1 + effectiveReturn);
      }

      // Convert back to regular array for easier handling
      results[sim] = Array.from(simValues);
    }

    // Report progress after each chunk
    if (reportProgress) {
      const progress = Math.round(((chunk + 1) / numChunks) * 100);
      self.postMessage({
        type: 'progress',
        data: {
          task: 'monteCarlo',
          progress,
          currentChunk: chunk + 1,
          totalChunks: numChunks,
          processedSimulations: Math.min((chunk + 1) * chunkSize, numSimulations),
          totalSimulations: numSimulations,
        }
      });
    }
  }

  return results;
}

/**
 * Calculate portfolio projections from Monte Carlo results
 */
function calculatePortfolioProjections(monteCarloResults: number[][], timeHorizon: number) {
  return Array.from({ length: timeHorizon + 1 }, (_, year) => {
    // Extract all values for this year across simulations
    const yearValues = monteCarloResults.map(sim => sim[year]);

    // Calculate percentiles
    return {
      year,
      median: calculatePercentile(yearValues, 50),
      percentile_5: calculatePercentile(yearValues, 5),
      percentile_25: calculatePercentile(yearValues, 25),
      percentile_75: calculatePercentile(yearValues, 75),
      percentile_95: calculatePercentile(yearValues, 95),
    };
  });
}

/**
 * Run sensitivity analysis to identify key drivers
 */
function runSensitivityAnalysis(params: {
  baseParams: Record<string, number>;
  variationPercentage: number;
  targetMetric: 'irr' | 'equityMultiple';
  cashFlowGenerator: (params: Record<string, number>) => number[];
}) {
  const { baseParams, variationPercentage, targetMetric, cashFlowGenerator } = params;

  // Calculate base case
  const baseCashFlows = cashFlowGenerator(baseParams);
  const baseIrr = memoizedIrr(baseCashFlows);
  const baseEquityMultiple = calculateEquityMultiple(
    baseCashFlows.slice(1).reduce((sum, cf) => sum + Math.max(0, cf), 0),
    Math.abs(baseCashFlows[0])
  );

  const baseValue = targetMetric === 'irr' ? baseIrr : baseEquityMultiple;

  // Calculate sensitivity for each parameter
  const results: Record<string, { parameter: string; sensitivity: number }> = {};

  for (const [param, value] of Object.entries(baseParams)) {
    // Skip parameters that shouldn't be varied
    if (param === 'initialInvestment') continue;

    // Calculate high case
    const highParams = { ...baseParams, [param]: value * (1 + variationPercentage / 100) };
    const highCashFlows = cashFlowGenerator(highParams);
    const highIrr = memoizedIrr(highCashFlows);
    const highEquityMultiple = calculateEquityMultiple(
      highCashFlows.slice(1).reduce((sum, cf) => sum + Math.max(0, cf), 0),
      Math.abs(highCashFlows[0])
    );

    // Calculate low case
    const lowParams = { ...baseParams, [param]: value * (1 - variationPercentage / 100) };
    const lowCashFlows = cashFlowGenerator(lowParams);
    const lowIrr = memoizedIrr(lowCashFlows);
    const lowEquityMultiple = calculateEquityMultiple(
      lowCashFlows.slice(1).reduce((sum, cf) => sum + Math.max(0, cf), 0),
      Math.abs(lowCashFlows[0])
    );

    const highValue = targetMetric === 'irr' ? highIrr : highEquityMultiple;
    const lowValue = targetMetric === 'irr' ? lowIrr : lowEquityMultiple;

    // Calculate sensitivity
    // Sensitivity = (% change in output) / (% change in input)
    const sensitivity = ((highValue - lowValue) / (baseValue * 2)) / (variationPercentage / 50);

    results[param] = { parameter: param, sensitivity };
  }

  // Sort by absolute sensitivity
  return Object.values(results).sort((a, b) => Math.abs(b.sensitivity) - Math.abs(a.sensitivity));
}

/**
 * Compare multiple scenarios
 */
function compareScenarios(scenarios: {
  name: string;
  params: Record<string, number>;
  cashFlowGenerator: (params: Record<string, number>) => number[];
}[]) {
  return scenarios.map(scenario => {
    const cashFlows = scenario.cashFlowGenerator(scenario.params);
    const irr = memoizedIrr(cashFlows);
    const equityMultiple = calculateEquityMultiple(
      cashFlows.slice(1).reduce((sum, cf) => sum + Math.max(0, cf), 0),
      Math.abs(cashFlows[0])
    );

    return {
      name: scenario.name,
      irr,
      equityMultiple,
      cashFlows,
    };
  });
}

// Handle messages from the main thread
self.onmessage = (e: MessageEvent) => {
  const { type, data, id } = e.data;

  try {
    switch (type) {
      case 'monteCarlo':
        // Report progress start
        self.postMessage({
          type: 'progress',
          id,
          data: {
            task: 'monteCarlo',
            progress: 0,
            status: 'started',
            message: 'Starting Monte Carlo simulation...',
          },
        });

        const monteCarloResults = runMonteCarloSimulation(data);

        self.postMessage({
          type: 'monteCarloResults',
          id,
          data: monteCarloResults,
        });
        break;

      case 'portfolioProjections':
        // Report progress start
        self.postMessage({
          type: 'progress',
          id,
          data: {
            task: 'portfolioProjections',
            progress: 0,
            status: 'started',
            message: 'Calculating portfolio projections...',
          },
        });

        const projections = calculatePortfolioProjections(data.monteCarloResults, data.timeHorizon);

        // Report completion
        self.postMessage({
          type: 'progress',
          id,
          data: {
            task: 'portfolioProjections',
            progress: 100,
            status: 'completed',
            message: 'Portfolio projections calculated.',
          },
        });

        self.postMessage({
          type: 'portfolioProjections',
          id,
          data: projections,
        });
        break;

      case 'sensitivityAnalysis':
        // Report progress start
        self.postMessage({
          type: 'progress',
          id,
          data: {
            task: 'sensitivityAnalysis',
            progress: 0,
            status: 'started',
            message: 'Running sensitivity analysis...',
          },
        });

        const sensitivityResults = runSensitivityAnalysis(data);

        // Report completion
        self.postMessage({
          type: 'progress',
          id,
          data: {
            task: 'sensitivityAnalysis',
            progress: 100,
            status: 'completed',
            message: 'Sensitivity analysis completed.',
          },
        });

        self.postMessage({
          type: 'sensitivityResults',
          id,
          data: sensitivityResults,
        });
        break;

      case 'compareScenarios':
        // Report progress start
        self.postMessage({
          type: 'progress',
          id,
          data: {
            task: 'compareScenarios',
            progress: 0,
            status: 'started',
            message: 'Comparing scenarios...',
          },
        });

        const comparisonResults = compareScenarios(data);

        // Report completion
        self.postMessage({
          type: 'progress',
          id,
          data: {
            task: 'compareScenarios',
            progress: 100,
            status: 'completed',
            message: 'Scenario comparison completed.',
          },
        });

        self.postMessage({
          type: 'comparisonResults',
          id,
          data: comparisonResults,
        });
        break;

      case 'clearCache':
        for (const key in cache) {
          delete cache[key];
        }
        self.postMessage({ type: 'cacheCleared', id });
        break;

      case 'cancel':
        // Handle cancellation request
        self.postMessage({
          type: 'cancelled',
          id,
          data: {
            message: 'Operation cancelled',
          },
        });
        break;

      default:
        self.postMessage({
          type: 'error',
          id,
          data: { message: `Unknown message type: ${type}` },
        });
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      id,
      data: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : '',
        task: type,
      },
    });
  }
};

// Export empty object to satisfy TypeScript
export {};
