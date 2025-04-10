# Equihome Portfolio Management System - JSON Simulation Engine

This folder contains the JavaScript/TypeScript implementation of the Equihome Portfolio Management System's simulation engine. It provides a comprehensive set of mathematical calculations, algorithms, and utilities for simulating portfolio performance, analyzing risk, and optimizing investment strategies.

## Directory Structure

- `src/utils/calculations.ts`: Core mathematical calculations and financial formulas
- `src/workers/simulationWorker.ts`: Web Worker implementation for computationally intensive tasks

## Key Features

### Core Financial Calculations

- Internal Rate of Return (IRR)
- Equity Multiple
- Sharpe Ratio
- Maximum Drawdown
- Simple and Compound Interest
- Loan Amount and Appreciation Share
- Management and Performance Fees
- Waterfall Distribution (European, American, Hybrid)
- Value at Risk (VaR)

### Advanced Simulation Capabilities

- Monte Carlo Simulations
- Sensitivity Analysis
- Scenario Comparison
- Portfolio Projections
- 3D Visualization
- Memoization for Performance Optimization

## Parameter Definitions

The simulation engine uses the following parameters:

| Parameter | Description | Default Value |
|-----------|-------------|---------------|
| `initialInvestment` | Initial fund size ($) | 50,000,000 |
| `interestRate` | Annual interest rate (%) | 5.0 |
| `propertyAppreciation` | Annual property appreciation rate (%) | 3.0 |
| `defaultRate` | Annual default rate (%) | 1.0 |
| `reinvestmentRate` | Percentage of returns reinvested (%) | 70.0 |
| `targetLtv` | Target loan-to-value ratio (%) | 60.0 |
| `avgTermLength` | Average loan term length (years) | 2.0 |
| `initialDeploymentPeriod` | Initial capital deployment period (years) | 3.0 |
| `lastReinvestmentYear` | Last year when capital can be reinvested | 7.0 |
| `managementFee` | Annual management fee (%) | 2.0 |
| `performanceFee` | Performance fee on profits above hurdle (%) | 20.0 |
| `hurdleRate` | Hurdle rate for performance fee (%) | 8.0 |
| `upfrontFee` | Upfront fee on loan origination (%) | 3.0 |
| `timeHorizon` | Fund lifetime (years) | 10 |
| `volatility` | Volatility in simulation outcomes (%) | 2.0 |
| `numSimulations` | Number of Monte Carlo simulations | 1000 |
| `earlyRepaymentRate` | Annual early repayment rate (%) | 15.0 |
| `waterfallType` | Waterfall structure | 'european' |

## Usage Examples

### Running a Monte Carlo Simulation

```typescript
// Import the simulation worker
import simulationWorker from './workers/simulationWorker';

// Define simulation parameters
const params = {
  initialInvestment: 50000000,
  timeHorizon: 10,
  interestRate: 5.0,
  propertyAppreciation: 3.0,
  defaultRate: 1.0,
  volatility: 2.0,
  numSimulations: 1000
};

// Create a worker instance
const worker = new Worker(new URL('./workers/simulationWorker.ts', import.meta.url));

// Set up message handler
worker.onmessage = (e) => {
  const { type, data, id } = e.data;
  
  if (type === 'monteCarloResults') {
    console.log('Monte Carlo simulation results:', data);
    // Process results...
  } else if (type === 'progress') {
    console.log(`Progress: ${data.progress}%`);
    // Update UI...
  }
};

// Start the simulation
worker.postMessage({
  type: 'monteCarlo',
  data: params,
  id: 'simulation-1'
});
```

### Calculating IRR

```typescript
import { calculateIrr } from './utils/calculations';

// Cash flows: initial investment (negative) followed by returns
const cashFlows = [-1000000, 200000, 250000, 300000, 400000, 500000];

// Calculate IRR
const irr = calculateIrr(cashFlows);
console.log(`IRR: ${(irr * 100).toFixed(2)}%`);
```

## Integration with Python Backend

This JavaScript simulation engine can be used standalone or in conjunction with the Python simulation engine for more advanced calculations. The `pythonSimulationAdapter.ts` file (not included in this folder) provides an interface for communicating with the Python backend.

## Performance Considerations

- The simulation worker uses Web Workers to run computationally intensive tasks in a separate thread
- Memoization is used to cache results and improve performance
- Typed arrays (Float64Array) are used for better performance with large datasets
- Chunked processing is implemented for better responsiveness during long-running simulations
