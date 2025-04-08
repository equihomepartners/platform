# Equihome Portfolio Management System

## Overview

The Portfolio Management System is an AI-driven strategic engine within the Equihome Platform that bridges the Traffic Light System (TLS) and Underwriting systems. It analyzes TLS-zoned suburbs, simulates portfolio scenarios using advanced mathematical models, and directs underwriting based on CIO-set parameters.

## Purpose

The Portfolio Management System is not just about tracking deals—it's the strategic engine that:

- Analyzes TLS-zoned suburbs and their data (growth, volatility, equity)
- Simulates and manages the current portfolio while modeling future scenarios
- Sets direction for the fund by sending prioritized deal parameters to Underwriting
- Optimizes portfolio composition for maximum risk-adjusted returns
- Enforces CIO-defined constraints and parameters

## Mathematical Framework

### Return Calculations

- **Internal Rate of Return (IRR)**:
  - Formula: $0=\sum_{t=0}^{n} \frac{CF_t}{(1+IRR)^t}$, where $CF_t$ is cash flow at time $t$
  - Use: Measures fund profitability (e.g., 16% IRR target)

- **Return on Investment (ROI)**:
  - Formula: $ROI = \frac{\text{Net Profit}}{\text{Investment Cost}} \times 100$
  - Use: Tracks deal-level gains (e.g., $650k loan payout)

- **Cash-on-Cash Return (CoC)**:
  - Formula: $CoC = \frac{\text{Annual Cash Flow}}{\text{Cash Invested}} \times 100$
  - Use: Assesses cash yield (e.g., 5% CoC on Green Zone deals)

### Risk Metrics

- **Volatility**:
  - Formula: $\sigma = \sqrt{\frac{1}{n}\sum_{i=1}^{n}(r_i - \bar{r})^2}$, where $r_i$ is return, $\bar{r}$ is mean return
  - Use: Measures price fluctuation (e.g., 3% in Green Zones)

- **Maximum Drawdown (MDD)**:
  - Formula: $MDD = \frac{\text{Trough Value} - \text{Peak Value}}{\text{Peak Value}}$
  - Use: Gauges worst-case loss (e.g., 2% drop in Orange Zones)

- **Sharpe Ratio**:
  - Formula: $\text{Sharpe} = \frac{\text{Portfolio Return} - \text{Risk-Free Rate}}{\text{Portfolio Volatility}}$
  - Use: Balances return vs. risk (e.g., 2.5 target)

### Correlation Models

- **Correlation Coefficient**:
  - Formula: $\rho_{X,Y} = \frac{\text{Cov}(X,Y)}{\sigma_X \sigma_Y}$, where $\text{Cov}$ is covariance, $\sigma$ is standard deviation
  - Use: Assesses how suburb/zone returns relate (e.g., Freshwater vs. Redfern)
  - Purpose: Ensures diversification (e.g., low correlation between Northern Beaches Green and Inner West Orange)

### Diversification Algorithms

- **Modern Portfolio Theory (MPT)**:
  - Objective: Minimize variance $\sigma_p^2 = \sum_i w_i^2 \sigma_i^2 + \sum_{i \neq j} w_i w_j \rho_{ij} \sigma_i \sigma_j$, where $w_i$ is weight, $\sigma_i$ is volatility, $\rho_{ij}$ is correlation
  - Use: Optimizes allocation (e.g., 80% Green, 20% Orange)

- **Monte Carlo Simulations**:
  - Runs thousands of scenarios to find optimal weights
  - Use: Balances growth vs. risk across zones/geographies

### Constraint Satisfaction

- **Linear Programming**:
  - Formula: Maximize $R = \sum w_i r_i$ subject to $\sum w_i = 1$, $w_i \geq 0$, and CIO constraints (e.g., max 80% Green)
  - Use: Enforces rules like LTV <40%, 5+ geographies
  - Dynamic Adjustments: Updates weights as TLS zones shift (e.g., Green to Orange)

## System Variables

### TLS Zone Inputs (Per Suburb)

- Growth rate (e.g., 8% YoY)
- Volatility (e.g., 3% fluctuation)
- Equity availability (e.g., 60% avg.)
- Liquidity (e.g., 25 days on market)
- Crime rates (e.g., 2/1,000 residents)
- Market fundamentals (e.g., rental yield, vacancy rate)

### Deal-Level Variables

- Loan-to-Value (LTV) ratio (e.g., 30%)
- Loan amount (e.g., $650k)
- Property value (e.g., $2.5M)
- Homeowner exit timing (e.g., 3-10 years, randomized)
- Potential default rate (e.g., <0.5%, zone-dependent)

### Timing and Tranches

- **Exit Timings**:
  - Randomized homeowner exits (e.g., 20% exit at 3 years, 50% at 5 years, 30% at 10 years)
  - Property sale timing (e.g., 4-year avg. hold)

- **Tranches**:
  - Deployment periods (e.g., $10M Q1, $15M Q2)
  - Timing: Staggered rollout (e.g., 6-month tranches)

- **Payouts and Reinvestment**:
  - LP payouts (e.g., 20% of exits returned quarterly)
  - Reinvestment rate (e.g., 80% of payouts recycled)

### Fund-Level Variables

- Total fund size (e.g., $50M)
- Current IRR (e.g., 16%)
- Zone allocation (e.g., 90% Green, 10% Orange)
- Geography split (e.g., 70% Northern Beaches)
- Risk tolerance (e.g., <5% volatility)
- Default impact (e.g., 0.2% loss rate)

### Fund Classifications

- Evergreen Fund: Continuous capital recycling, no fixed end
- Closed-End Fund: Fixed term (e.g., 7 years), payouts at exit
- Open-End Fund: Allows new investments over time

## AI Layer

The Portfolio Management System incorporates an AI layer that enhances decision-making beyond pure mathematical models:

- **Predictive Analytics**: Uses machine learning to forecast suburb performance beyond TLS classifications
- **Anomaly Detection**: Identifies unusual patterns in market data that may indicate opportunities or risks
- **Optimization Engine**: Continuously refines portfolio allocation based on changing market conditions
- **Natural Language Processing**: Generates human-readable explanations for portfolio recommendations
- **Reinforcement Learning**: Improves decision-making over time based on actual portfolio performance

## Features

### Portfolio Dashboard

- Real-time portfolio metrics (IRR, ROI, Sharpe ratio)
- Zone and geography distribution visualization
- Risk exposure analysis
- Performance tracking against targets

### Simulation Engine

- Interactive parameter controls (1,000+ variables)
- Monte Carlo simulations (thousands of scenarios)
- What-if scenario modeling
- Sensitivity analysis

### Parameter Management

- CIO-defined rules and constraints
- Dynamic parameter adjustment
- Constraint satisfaction algorithms
- Rule impact visualization

### Underwriting Direction

- Prioritized deal targets
- Allocation recommendations
- Risk-adjusted return optimization
- Geographic diversification guidance

### TLS Integration

- Real-time zone data consumption
- Suburb metric analysis
- Zone transition monitoring
- Correlation analysis between zones

## Technology Stack

### Frontend

- **Framework**: React with TypeScript
- **Visualization**: D3.js for advanced charts, Leaflet.js for maps
- **State Management**: Redux for global state, React Query for API data
- **Styling**: Styled Components with a custom design system

### Backend

- **Core**: Python for mathematical modeling and simulations
- **API**: FastAPI for high-performance endpoints
- **ML/AI**: PyTorch, XGBoost, scikit-learn for predictive models
- **Computation**: AWS Lambda for on-demand processing, SageMaker for ML training

### Data Storage

- **Database**: AWS RDS (PostgreSQL) for relational data
- **Time Series**: Amazon Timestream for performance metrics
- **Analytics**: AWS Redshift for data warehousing

### Integration

- **API Gateway**: Central entry point for frontend requests
- **Event Bus**: AWS EventBridge for real-time updates
- **Authentication**: Shared auth with TLS and Underwriting systems

## Development Status

- **Current Phase**: Initial development
- **Next Steps**: 
  - Set up project structure
  - Implement core portfolio analysis features
  - Create TLS integration layer
  - Develop simulation engine
  - Build AI layer

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python 3.9+
- AWS CLI configured

### Installation

1. Install frontend dependencies:
   ```
   npm install
   ```

2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Start the Python backend:
   ```
   python -m backend.app
   ```

### Testing

The Portfolio Management System uses Playwright MCP for automated testing:

1. Install Playwright MCP server globally:
   ```
   npx -y @executeautomation/playwright-mcp-server
   ```

2. Run the MCP server:
   ```
   ./run-mcp-server.sh
   ```

3. Run the tests:
   ```
   npm run test:e2e
   ```

## Architecture

```
Portfolio Management System
├── Frontend (React)
│   ├── Dashboard
│   ├── Simulation Engine
│   ├── Parameter Management
│   └── Visualization Components
├── Backend (Python)
│   ├── Mathematical Models
│   │   ├── Return Calculations
│   │   ├── Risk Metrics
│   │   ├── Correlation Models
│   │   └── Diversification Algorithms
│   ├── AI Layer
│   │   ├── Predictive Analytics
│   │   ├── Optimization Engine
│   │   └── Reinforcement Learning
│   └── Integration Layer
│       ├── TLS Connector
│       └── Underwriting Connector
└── Data Storage
    ├── Portfolio Data
    ├── Simulation Results
    └── Historical Performance
```

## Integration with TLS

The Portfolio Management System integrates with the Traffic Light System through:

1. **API Integration**: Pulls zone classifications and metrics
2. **Event-Driven Updates**: Receives real-time zone changes
3. **Shared Authentication**: Unified security model
4. **Consistent Data Model**: Compatible suburb and metric definitions

## Future Enhancements

- **Advanced AI Models**: Incorporate deep learning for complex pattern recognition
- **Natural Language Interface**: Allow CIOs to set parameters using natural language
- **Automated Rebalancing**: Implement autonomous portfolio optimization
- **Stress Testing**: Add comprehensive market stress scenarios
- **Mobile Interface**: Develop companion mobile app for on-the-go monitoring
