# Traffic Light System (TLS)

## Overview

The Traffic Light System (TLS) is an AI/ML-powered zoning engine within the Equihome Platform, designed to analyze Sydney suburbs and assign them Green, Orange, or Red zones based on fund-specific metrics (growth, volatility, equity, etc.).

**Current Implementation:** The TLS is currently implemented as a single HTML file (`nsw_demo.html`) in the root directory. This README describes the future modular implementation that will replace it.

## Features

### Current Features (alpha v0.1)

- Interactive map visualization of Sydney suburbs
- Color-coded zoning (Green/Orange/Red)
- Detailed suburb metrics and analysis
- ML model monitoring and configuration
- AI layer for refinement of ML predictions
- System health monitoring
- Comprehensive settings
- Focus on Sydney and surrounding suburbs
- Green zones primarily in Eastern and Northern Sydney suburbs

### Planned Features

- Multiple ML models (XGBoost + 5 others)
- Configurable zoning parameters
- Real-time data updates
- Enhanced visualization options
- Integration with Portfolio Management System

## Technology Stack

- **Frontend**: React, Leaflet.js, Chart.js
- **Backend**: Supabase, Node.js
- **ML/AI**: XGBoost, OpenAI
- **Testing**: Playwright MCP
- **Data Sources**: Free APIs and public datasets

## Architecture

### ML Layer
- Processes data and makes initial predictions
- Uses XGBoost as the primary model
- Analyzes metrics like growth, volatility, equity

### AI Layer
- Refines ML predictions using OpenAI
- Applies business context and domain knowledge
- Makes final zoning decisions

### Visualization Layer
- Renders interactive map of Sydney suburbs
- Displays color-coded zones
- Provides detailed metrics and analysis

## Getting Started

### Running the Current Version

1. From the root directory, install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

3. Open in browser:
   ```
   http://localhost:8000
   ```

### Future Implementation

Once the modular implementation is complete:

1. Navigate to the TLS app directory:
   ```
   cd equihome/apps/tls
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Testing with Playwright MCP

The TLS uses Playwright MCP for automated testing:

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

## Version History

- **v0.1 (Alpha)**: Initial release with core functionality
  - Map visualization
  - Zone classification
  - Suburb details
  - ML model monitoring
  - AI layer integration
  - System health monitoring
  - Settings configuration
