# Equihome API Client

Shared API client for the Equihome Platform. This package provides a unified way to interact with all Equihome backend services.

## Features

- **Authentication**: Handles authentication and token management
- **Request/Response**: Standardized request and response handling
- **Error Handling**: Consistent error handling across all services
- **WebSockets**: Real-time communication with backend services
- **Caching**: Intelligent caching of API responses

## Services

- **TLS API**: Interact with the Traffic Light System
- **Portfolio API**: Interact with the Portfolio Management System
- **Underwriting API**: Interact with the Underwriting System (future)

## Usage

```typescript
import { createClient } from '@equihome/api-client';

// Create a client instance
const client = createClient({
  baseUrl: 'https://api.equihome.ai',
  token: 'user-auth-token'
});

// Use the client to interact with services
async function fetchSuburbs() {
  try {
    const suburbs = await client.tls.getSuburbs({
      filter: 'green'
    });
    return suburbs;
  } catch (error) {
    console.error('Failed to fetch suburbs:', error);
    throw error;
  }
}
```

## Configuration

The API client can be configured with the following options:

```typescript
const client = createClient({
  // Base URL for API requests
  baseUrl: 'https://api.equihome.ai',
  
  // Authentication token
  token: 'user-auth-token',
  
  // Request timeout in milliseconds
  timeout: 30000,
  
  // Enable request retries
  retries: 3,
  
  // Enable response caching
  cache: true,
  
  // Custom headers
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

## Development

### Adding a new service

1. Create a new file in the `src/services` directory
2. Implement the service methods
3. Add tests
4. Export the service from the index file

### Testing

```
npm test
```

### Building

```
npm run build
```
