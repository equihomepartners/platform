# Equihome Portfolio Simulation Engine - Calculations Documentation

This document provides a comprehensive overview of all calculations, algorithms, formulas, parameters, and variables used in the Equihome Portfolio Simulation Engine. It serves as a reference for understanding the mathematical foundations of the simulation engine and how different parameters affect the outputs.

## Table of Contents

1. [Input Parameters](#input-parameters)
2. [Core Financial Calculations](#core-financial-calculations)
3. [Waterfall Distribution Models](#waterfall-distribution-models)
4. [Loan and Portfolio Calculations](#loan-and-portfolio-calculations)
5. [Risk Metrics](#risk-metrics)
6. [Monte Carlo Simulation](#monte-carlo-simulation)
7. [Output Metrics](#output-metrics)

## Input Parameters

The simulation engine uses the following default parameters, which can be customized:

| Parameter | Default Value | Description | Units |
|-----------|---------------|-------------|-------|
| `initialInvestment` | 50,000,000 | Initial fund size | $ |
| `interestRate` | 5.0 | Annual interest rate | % |
| `propertyAppreciation` | 3.0 | Annual property appreciation rate | % |
| `defaultRate` | 1.0 | Annual default rate | % |
| `reinvestmentRate` | 70.0 | Percentage of returns reinvested | % |
| `targetLtv` | 60.0 | Target loan-to-value ratio | % |
| `avgTermLength` | 2.0 | Average loan term length | years |
| `initialDeploymentPeriod` | 3.0 | Initial capital deployment period | years |
| `lastReinvestmentYear` | 7.0 | Last year when capital can be reinvested | year |
| `managementFee` | 2.0 | Annual management fee | % |
| `performanceFee` | 20.0 | Performance fee on profits above hurdle | % |
| `hurdleRate` | 8.0 | Hurdle rate for performance fee | % |
| `upfrontFee` | 3.0 | Upfront fee on loan origination | % |
| `timeHorizon` | 10 | Fund lifetime | years |
| `volatility` | 2.0 | Volatility in simulation outcomes | % |
| `numSimulations` | 1000 | Number of Monte Carlo simulations | count |
| `earlyRepaymentRate` | 15.0 | Annual early repayment rate | % |
| `waterfallType` | 'european' | Waterfall structure | string |
| `zoneAllocation` | {'green': 60, 'orange': 30, 'red': 10} | Zone allocation | % |
| `geographyAllocation` | {'sydney': 70, 'melbourne': 20, 'brisbane': 10} | Geography allocation | % |

### Parameter Validation

All parameters are validated to ensure they are within reasonable bounds:
- Numerical parameters must be positive
- Percentage parameters must be between 0 and their respective maximum values
- Zone and geography allocations must sum to 100%

## Core Financial Calculations

### Internal Rate of Return (IRR)

**Purpose**: Calculates the discount rate that makes the net present value (NPV) of all cash flows equal to zero.

**Formula**:
```
NPV = Σ(Ct / (1 + IRR)^t) = 0
```
where:
- Ct is the cash flow at time t
- IRR is the internal rate of return

**Implementation**:
- Primary method: Uses numpy's IRR function
- Fallback method: Uses Newton's method to find the root of the NPV equation

**Output**: IRR as a decimal (e.g., 0.10 for 10%)

### Equity Multiple

**Purpose**: Measures the total cash distributions relative to the total cash invested.

**Formula**:
```
Equity Multiple = Total Cash Distributions / Total Cash Invested
```

**Implementation**:
- Sums all positive cash flows (distributions)
- Sums absolute values of all negative cash flows (investments)
- Divides distributions by investments

**Output**: Equity multiple as a decimal (e.g., 1.5 means 1.5x the initial investment)

### Sharpe Ratio

**Purpose**: Measures risk-adjusted return by comparing excess return to volatility.

**Formula**:
```
Sharpe Ratio = (Mean Return - Risk-Free Rate) / Standard Deviation of Returns
```
where:
- Risk-Free Rate defaults to 2%

**Implementation**:
- Calculates mean annual return
- Subtracts risk-free rate
- Divides by standard deviation of returns

**Output**: Sharpe Ratio (higher values indicate better risk-adjusted returns)

### Maximum Drawdown

**Purpose**: Measures the largest percentage drop from peak to trough in portfolio value.

**Formula**:
```
Max Drawdown = (Peak Value - Trough Value) / Peak Value
```

**Implementation**:
- Calculates cumulative value over time
- Tracks peak values
- Calculates drawdowns as (peak - current) / peak
- Returns maximum drawdown

**Output**: Max drawdown as a decimal (e.g., 0.2 for 20%)

### Value at Risk (VaR)

**Purpose**: Estimates the potential loss in value at a given confidence level.

**Formula**:
```
VaR = Percentile of Returns at (1 - Confidence Level)
```
where:
- Confidence Level defaults to 95%

**Implementation**:
- Sorts returns
- Finds the percentile at (1 - confidence level)

**Output**: VaR value (negative number indicating potential loss)

## Waterfall Distribution Models

The simulation engine supports three waterfall distribution models for calculating how returns are distributed between Limited Partners (LPs) and General Partners (GPs):

### European Waterfall

**Description**: LPs receive 100% of distributions until they've received their entire contributed capital plus the preferred return (hurdle). Only then does the GP start receiving carried interest.

**Implementation**:
1. Calculate total distributions over fund life
2. Calculate cumulative hurdle return (initial investment compounded at hurdle rate)
3. Calculate excess return above hurdle
4. Apply performance fee to excess return
5. Allocate performance fee to GP at the end of fund life

**Formula for Excess Return**:
```
Excess Return = max(0, Total Distributions - Cumulative Hurdle)
```

**Formula for Performance Fee**:
```
Performance Fee = Excess Return × Performance Fee Percentage
```

### American Waterfall

**Description**: Calculated on a deal-by-deal basis. GP can receive carried interest on profitable investments even if the overall fund hasn't returned all capital and preferred return.

**Implementation**:
1. Track cumulative invested capital and distributions
2. For each year with positive cash flow:
   - Calculate hurdle amount for invested capital up to that point
   - Calculate excess return above hurdle
   - Apply performance fee to excess return
   - Allocate performance fee to GP in that year

**Formula for Hurdle Amount in Year t**:
```
Hurdle Amount = Cumulative Invested × (1 + Hurdle Rate)^t
```

**Formula for Excess Return in Year t**:
```
Excess Return = max(0, Cumulative Distributed - Hurdle Amount)
```

### Hybrid Waterfall

**Description**: Combines elements of both European and American structures, typically with a mid-point transition.

**Implementation**:
1. Apply European-style for first half of fund life
2. Apply American-style for second half of fund life
3. Calculate and allocate performance fees accordingly

## Loan and Portfolio Calculations

### Loan Returns

**Purpose**: Calculates the returns from a single loan, adjusted for zone and geography risk.

**Inputs**:
- Loan amount
- Term in years
- Zone ('green', 'orange', 'red')
- Geography ('sydney', 'melbourne', 'brisbane')

**Adjustments**:
- Default rate is adjusted by zone multipliers:
  - Green: 0.5× default rate
  - Orange: 1.0× default rate
  - Red: 1.5× default rate
- Interest rate is adjusted by geography multipliers:
  - Sydney: 1.0× interest rate
  - Melbourne: 1.1× interest rate
  - Brisbane: 1.2× interest rate

**Calculations**:
1. **Property Value**: `Property Value = Loan Amount / Target LTV`
2. **Upfront Fee Revenue**: `Upfront Fee Revenue = Loan Amount × Upfront Fee`
3. **Interest Revenue**: `Interest Revenue = Loan Amount × Adjusted Interest Rate × Term Years`
4. **Property Appreciation**: `Appreciated Value = Property Value × (1 + Property Appreciation)^Term Years`
5. **Appreciation Revenue**: `Appreciation Revenue = (Appreciated Value - Property Value) × Target LTV`
6. **Total Return Before Default**: `Total Return = Upfront Fee Revenue + Interest Revenue + Appreciation Revenue`
7. **Expected Loss**: `Expected Loss = Loan Amount × Adjusted Default Rate × Term Years`
8. **Final Total Return**: `Total Return -= Expected Loss`
9. **Annual Return Rate**: `Annual Return Rate = (Total Return / Loan Amount) / Term Years`

**Outputs**:
- Total return
- Annual return rate

### Loan Portfolio Generation

**Purpose**: Generates a portfolio of loans based on the parameters, incorporating zone and geography allocations.

**Implementation**:
1. Determine number of loans (1 loan per million, minimum 10)
2. Calculate average loan size
3. Generate loans with:
   - Randomized loan amounts (based on volatility)
   - Randomized term lengths (based on volatility)
   - Zone and geography assignments based on allocation percentages
   - Expected returns calculated using the loan returns function

**Outputs**:
- List of loan dictionaries with amount, term, expected return, zone, and geography

### Portfolio Cash Flows

**Purpose**: Calculates the cash flows for the entire portfolio over time.

**Implementation**:
1. Initialize cash flows and portfolio values
2. Deploy capital over the deployment period
3. For each year in the time horizon:
   - Process each loan (check for defaults, early repayments, and maturities)
   - Add returns to cash flow
   - Apply reinvestment logic if within reinvestment period
   - Update portfolio value
   - Update capital metrics
4. Calculate LP and GP cash flows using waterfall distribution
5. Calculate actual early repayment rate

**Outputs**:
- Cash flows
- Portfolio values
- LP cash flows
- Capital metrics
- Actual early repayment rate

## Risk Metrics

### Correlation Analysis

**Purpose**: Calculates correlations between IRR, equity multiple, and final value (as a proxy for risk).

**Implementation**:
- Calculates correlation coefficients between:
  - IRR and equity multiple
  - IRR and risk (using negative final value as proxy)
  - Equity multiple and risk

**Outputs**:
- Dictionary of correlation coefficients

## Monte Carlo Simulation

**Purpose**: Runs multiple simulations with stochastic variations to generate a distribution of possible outcomes.

**Implementation**:
1. Validate parameters
2. Generate base loan portfolio
3. For each simulation:
   - Apply stochastic variation to key parameters
   - Run simulation
   - Calculate metrics (IRR, equity multiple, etc.)
   - Store results
4. Calculate statistics (mean, median, min, max) for key metrics
5. Calculate mean cash flows and time series data
6. Calculate IRR by year
7. Calculate mean capital metrics
8. Calculate revenue streams

**Outputs**:
- Statistics for key metrics
- Time series data
- Raw IRR values for histogram

## Output Metrics

### Final Portfolio Value

**Description**: The total value of the portfolio at the end of the simulation.

**Statistics Provided**:
- Mean
- Median
- Minimum
- Maximum

### IRR (Internal Rate of Return)

**Description**: The annualized rate of return that makes the net present value of all cash flows equal to zero.

**Statistics Provided**:
- Mean
- Median
- Minimum
- Maximum

### GP IRR

**Description**: The IRR calculated on the GP's cash flows.

**Statistics Provided**:
- Mean
- Median
- Minimum
- Maximum

### Equity Multiple

**Description**: The ratio of total cash distributions to total cash invested.

**Statistics Provided**:
- Mean
- Median
- Minimum
- Maximum

### Sharpe Ratio

**Description**: A measure of risk-adjusted return.

**Statistics Provided**:
- Mean

### Maximum Drawdown

**Description**: The largest percentage drop from peak to trough in portfolio value.

**Statistics Provided**:
- Mean

### Early Repayment Rate

**Description**: The percentage of loans that are repaid early.

**Statistics Provided**:
- Mean

### Revenue Streams

**Description**: Breakdown of GP revenue sources.

**Components**:
- Management Fee Revenue
- Upfront Fee Revenue
- Performance Fee Revenue
- Total GP Revenue

### Time Series Data

**Description**: Data points over time for various metrics.

**Components**:
- IRR by Year
- LP Cash Flows
- Portfolio Value
- Cash Flows (LP and GP)
- Capital Metrics (Invested, Available, Total)

### Risk Metrics

**Description**: Measures of portfolio risk.

**Components**:
- Value at Risk (95% confidence)
- Correlations between metrics

## Catch-Up and Clawback Provisions

### Catch-Up Provision

**Description**: After LPs receive their preferred return, the GP receives a disproportionate share of profits until they've "caught up" to their target carried interest percentage.

**Implementation**:
- Not explicitly modeled in the current code but can be added to the waterfall distribution calculation
- Would be applied after the hurdle is met but before the standard profit split

**Formula**:
```
Catch-Up Amount = (Excess Return × Target Carried Interest) / Catch-Up Percentage
```
where:
- Target Carried Interest is typically the performance fee percentage (e.g., 20%)
- Catch-Up Percentage determines how much of the catch-up zone goes to the GP (e.g., 100%)

### Clawback Provision

**Description**: Allows LPs to "claw back" excess carried interest that was paid to the GP if, by the end of the fund's life, the GP received more carried interest than they were entitled to based on the fund's overall performance.

**Implementation**:
- Not explicitly modeled in the current code but can be added as a post-processing step
- Would compare the GP's actual carried interest to what they should have received based on the fund's overall performance
- Any excess would be "clawed back" and returned to LPs

**Formula**:
```
Clawback Amount = Actual GP Carried Interest - Entitled GP Carried Interest
```
where:
- Entitled GP Carried Interest is calculated based on the fund's overall performance

## TLS Integration

The Traffic Light System (TLS) is integrated into the portfolio simulation through the zone allocation parameter. Each zone (Green, Orange, Red) has different risk-return characteristics:

### Zone Risk-Return Profiles

| Zone | Risk Level | Return Range | Default Rate Multiplier |
|------|------------|--------------|-------------------------|
| Green | Lower | 8-12% | 0.5× |
| Orange | Medium | 12-18% | 1.0× |
| Red | Higher | 15-25% | 1.5× |

### Implementation

The zone allocation affects the simulation in several ways:
1. **Loan Generation**: Loans are assigned to zones based on the allocation percentages
2. **Default Risk**: Default rates are adjusted based on the zone (higher for riskier zones)
3. **Return Expectations**: Expected returns are adjusted based on the zone
4. **Portfolio Optimization**: Different zone allocations can be tested to find optimal risk-return profiles

### Optimization Process

To find the optimal zone allocation:
1. Run simulations with different zone allocations
2. Compare key metrics (IRR, Sharpe ratio, etc.)
3. Select the allocation that best meets the investment objectives

## Advanced Features

### Sensitivity Analysis

**Purpose**: Determines how changes in input parameters affect output metrics.

**Implementation**:
- Run simulations with varying values for key parameters
- Track changes in output metrics
- Identify parameters with the greatest impact

### Scenario Comparison

**Purpose**: Compares different investment scenarios.

**Implementation**:
- Define multiple parameter sets representing different scenarios
- Run simulations for each scenario
- Compare results across scenarios

### 3D Visualization

**Purpose**: Visualizes the relationship between three variables.

**Implementation**:
- Select three parameters or metrics to visualize
- Plot in 3D space
- Identify patterns and optimal regions
