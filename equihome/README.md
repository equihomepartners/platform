# Equihome Platform

## Overview

Equihome's platform consists of three integrated systems with a hybrid architecture: a unified frontend web application with modular backend services. This architecture supports Equihome's AI-driven, data-intensive operations while maintaining security, scalability, and regulatory compliance.

## Directory Structure

```
equihome/
├── packages/           # Shared packages
│   ├── ui-components/  # Shared UI components
│   ├── api-client/     # Shared API client
│   └── utils/          # Shared utilities
├── apps/
│   ├── tls/            # Traffic Light System frontend
│   └── portfolio/      # Portfolio Management System frontend
└── services/
    ├── tls-api/        # TLS backend
    └── portfolio-api/  # Portfolio backend
```

## System Components

### 1. Traffic Light System (TLS)

**Purpose:** Classifies Sydney suburbs into Green/Orange/Red zones based on growth, volatility, equity, and other metrics.

**Frontend:** `apps/tls/`
- Interactive Sydney map visualization
- Zone filtering and exploration
- Detailed suburb metrics and analysis
- ML/AI model monitoring and configuration

**Backend:** `services/tls-api/`
- React-based web application
- Leaflet.js for map visualization
- XGBoost for initial modeling
- OpenAI integration for AI refinement
- Supabase for backend services

### 2. Portfolio Management System

**Purpose:** Strategic engine that analyzes TLS data, simulates portfolio scenarios, and directs the Underwriting system.

**Frontend:** `apps/portfolio/`
- Portfolio composition dashboard
- Fund metrics (size, IRR, zone distribution)
- Scenario modeling tools
- CIO parameter configuration

**Backend:** `services/portfolio-api/`
- AWS Lambda for simulations
- AWS RDS for metrics storage
- ML models for portfolio optimization
- Event-driven architecture for TLS integration

### 3. Underwriting/Pipeline System (Future)

**Purpose:** Processes deal approvals based on Portfolio Management directives.

## Shared Packages

### UI Components (`packages/ui-components/`)
Common UI elements shared across all applications:
- Navigation components
- Data visualization components
- Form elements
- Modal dialogs

### API Client (`packages/api-client/`)
Shared API communication layer:
- Authentication handling
- Request/response formatting
- Error handling
- WebSocket connections

### Utilities (`packages/utils/`)
Common utility functions:
- Data formatting
- Date/time handling
- Validation functions
- Analytics helpers

## Development Workflow

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Run tests: `npm test`
4. Build for production: `npm run build`

## Getting Started

See the README in each application directory for specific setup instructions.
