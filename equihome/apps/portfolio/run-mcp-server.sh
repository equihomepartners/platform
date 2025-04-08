#!/bin/bash

# Start the Playwright MCP server
npx -y @executeautomation/playwright-mcp-server \
  --port 9323 \
  --host localhost \
  --project-name "Equihome Portfolio" \
  --test-match "**/*.spec.ts" \
  --headed
