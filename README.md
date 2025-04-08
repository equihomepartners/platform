# Equihome Platform

## Overview

Equihome's platform consists of three integrated systems with a hybrid architecture: a unified frontend web application with modular backend services. This architecture supports Equihome's AI-driven, data-intensive operations while maintaining security, scalability, and regulatory compliance.

## Repository Structure

```
/
├── nsw_demo.html                # Current TLS implementation (alpha v0.1)
├── equihome/                    # New modular platform structure
│   ├── packages/                # Shared packages
│   │   ├── ui-components/       # Shared UI components
│   │   ├── api-client/          # Shared API client
│   │   └── utils/               # Shared utilities
│   ├── apps/                    # Frontend applications
│   │   ├── tls/                 # Traffic Light System frontend
│   │   └── portfolio/           # Portfolio Management System frontend
│   └── services/                # Backend services
│       ├── tls-api/             # TLS backend
│       └── portfolio-api/       # Portfolio backend
├── backend/                     # Current TLS backend
├── frontend/                    # Current TLS frontend components
└── tests/                       # Test files
```

## System Components

### 1. Traffic Light System (TLS)

**Current Implementation:** `nsw_demo.html` (alpha v0.1)

**Purpose:** AI/ML-powered zoning engine that classifies Sydney suburbs into Green, Orange, or Red zones based on fund-specific metrics (growth, volatility, equity).

**Features:**
- Interactive map visualization of Sydney suburbs
- Color-coded zoning (Green/Orange/Red)
- Detailed suburb metrics and analysis
- ML model monitoring and configuration
- AI layer for refinement of ML predictions
- System health monitoring

### 2. Portfolio Management System

**Implementation:** `equihome/apps/portfolio/`

**Purpose:** Strategic engine that analyzes TLS data, simulates portfolio scenarios, and directs the Underwriting system.

**Features:**
- Portfolio composition dashboard
- Fund metrics (size, IRR, zone distribution)
- Scenario modeling tools
- CIO parameter configuration
- TLS data integration
- Underwriting direction

### 3. Underwriting/Pipeline System (Future)

**Purpose:** Processes deal approvals based on Portfolio Management directives.

**Planned Features:**
- Deal queue visualization
- Approval workflow interface
- Documentation management
- Status tracking
- Portfolio feedback loop

## Architecture

### Unified Frontend

A single web application with modular components:

- **Technology:** React SPA with TypeScript
- **UI Framework:** Custom components with consistent design
- **Data Visualization:** Leaflet.js, D3.js, Chart.js
- **State Management:** Context API / Redux

### Modular Backend

Separate services for each system component:

- **TLS Backend:** Data processing, ML/AI models, zone classification
- **Portfolio Backend:** Portfolio analysis, scenario simulation, strategy engine
- **Underwriting Backend:** Deal processing, approval workflows, document management

### Integration

- **API Gateway:** Central entry point for frontend requests
- **Event Bus:** Real-time updates between services
- **Data Warehouse:** Centralized repository for analytics

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Git

### Running the TLS (Current Version)

1. Clone the repository:
   ```
   git clone https://github.com/equihomepartners/platform.git
   cd platform
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open in browser:
   ```
   http://localhost:8000
   ```

### Running the Portfolio Management System

1. Navigate to the portfolio app directory:
   ```
   cd equihome/apps/portfolio
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open in browser:
   ```
   http://localhost:8001
   ```

## Testing

The platform uses Playwright for automated testing, with MCP (Model Context Protocol) for visual testing:

1. Install Playwright MCP server:
   ```
   npx -y @executeautomation/playwright-mcp-server
   ```

2. Run tests:
   ```
   npm test
   ```

## Version History

- **TLS alpha v0.1:** Initial release with core functionality
  - Map visualization
  - Zone classification
  - Suburb details
  - Basic ML model integration

## Contact

For questions or issues regarding the platform, contact:
- **Technical Lead:** [Contact Information]
- **Project Manager:** [Contact Information]

## Project Structure

```
equihome-tls/
├── frontend/           # React frontend application
│   ├── src/            # Source code
│   │   ├── components/ # React components
│   │   ├── context/    # React context providers
│   │   ├── services/   # API services
│   │   ├── types/      # TypeScript type definitions
│   │   └── utils/      # Utility functions
│   └── public/         # Static assets
├── backend/            # Python backend application
│   ├── src/            # Source code
│   └── data/           # Data storage
├── tests/              # Automated tests
│   └── screenshots/    # Test screenshots
└── examples/           # Example code and documentation
```

## Features

- Interactive map showing Sydney suburbs color-coded by zone (Green, Orange, Red)
- Detailed metrics view when clicking on a suburb
- Search functionality to find specific suburbs
- Filter suburbs by zone (Green, Orange, Red)
- Statistics panel showing zone distribution
- AI reasoning for zone classification
- AI-based zoning using XGBoost model (with 5 additional models planned)
- Real-time updates via WebSocket or API

## Current Implementation

The current implementation includes:

1. **Interactive Map**: A Leaflet.js-based map showing Sydney suburbs with color-coded zones
2. **Real NSW Suburb Data**: Using GeoJSON data for NSW suburb boundaries
3. **Zone Classification**: Suburbs are classified into Green, Orange, or Red zones based on metrics
4. **Search Functionality**: Users can search for specific suburbs
5. **Zone Filtering**: Users can filter suburbs by zone
6. **Statistics Panel**: Shows the distribution of suburbs by zone
7. **Automated Testing**: Playwright tests for all major functionality

## Data Sources

The system uses free data sources including:
- NSW Suburb/Locality Boundaries GeoJSON
- Australian Bureau of Statistics (ABS) data
- NSW Bureau of Crime Statistics and Research
- Reserve Bank of Australia interest rates data

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm (comes with Node.js)
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/equihomepartners/equihome-tls.git
cd equihome-tls
```

2. Install dependencies
```bash
npm install
```

3. Start the server
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:8000
```

### Demo Version

A demo version of the TLS is available in the repository:

```bash
# Start the server
npm start

# Open in browser
http://localhost:8000/
```

The demo uses real NSW suburb boundaries from GeoJSON data and simulates the zoning engine with random metrics.

## ML Models

The TLS currently uses XGBoost for suburb classification. The following models are planned for future implementation:
- Random Forest
- Gradient Boosting
- Neural Network
- AdaBoost
- Ensemble

## Testing

The project includes automated testing using Playwright. For more information, see:

- [Testing Documentation](TESTING.md) - Instructions for setting up and running tests
- [Playwright MCP Documentation](PLAYWRIGHT-MCP.md) - Using Playwright MCP with Claude

### Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/tls.spec.js

# Show test report
npx playwright show-report
```

### Test Coverage

The tests cover the following functionality:

- Map display and loading
- Suburb details display when clicking on a suburb
- Zone coloring (Green, Orange, Red)
- Search functionality
- Zone filtering
- Statistics panel

## Examples

The `examples/` directory contains documentation and examples for:

- [Visual Testing](examples/visual-testing.md) - Using Playwright MCP for visual testing
- [Coding Loop Automation](examples/coding-loop.md) - Automating the coding loop with Playwright MCP
- [Performance Testing](examples/performance-testing.md) - Measuring and optimizing performance

## License

Proprietary - All rights reserved by Equihome Partners.
