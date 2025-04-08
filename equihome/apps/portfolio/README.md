# Portfolio Management System

The Portfolio Management System is a strategic engine within the Equihome Platform that bridges the Traffic Light System (TLS) and Underwriting systems. It analyzes TLS-zoned suburbs, simulates portfolio scenarios, and directs underwriting based on CIO-set parameters.

## Purpose

The Portfolio Management System is not just about tracking deals—it's the strategic engine that:

- Analyzes TLS-zoned suburbs and their data (growth, volatility, equity)
- Simulates and manages the current portfolio while modeling future scenarios
- Sets direction for the fund by sending prioritized deal parameters to Underwriting

## Features

- **Portfolio Analysis**: Track metrics (IRR, risk exposure) and adjust allocations
- **Scenario Modeling**: Simulate "what-if" scenarios (e.g., "What if we add 10% Orange?")
- **Parameter Management**: Apply CIO-defined rules (e.g., max 80% Green, 20% LTV cap)
- **Underwriting Direction**: Send prioritized deal targets to the Pipeline for approval
- **TLS Integration**: Pull zoning data directly from the Traffic Light System

## Technology Stack

- **Frontend**: React, D3.js/Chart.js for data visualization
- **Backend**: AWS Lambda, AWS RDS
- **Integration**: API Gateway, Event-driven architecture
- **Testing**: Playwright MCP

## Development Status

- **Current Phase**: Initial development
- **Next Steps**: 
  - Set up project structure
  - Implement core portfolio analysis features
  - Create TLS integration layer
  - Develop scenario modeling tools

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Run tests:
   ```
   npm test
   ```

## Testing with Playwright MCP

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
