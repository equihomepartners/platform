# Equihome UI Components

Shared UI components for the Equihome Platform. These components are used across all applications to ensure a consistent look and feel.

## Components

- **Navigation**: Header, sidebar, tabs
- **Data Visualization**: Charts, maps, indicators
- **Forms**: Inputs, selectors, sliders
- **Feedback**: Notifications, modals, alerts
- **Layout**: Cards, panels, grids

## Usage

Import components directly in your application:

```jsx
import { Button, Card, Notification } from '@equihome/ui-components';

function MyComponent() {
  return (
    <Card>
      <h2>My Component</h2>
      <Button onClick={() => showNotification('Hello!')}>Click Me</Button>
    </Card>
  );
}
```

## Development

### Adding a new component

1. Create a new file in the appropriate directory
2. Implement the component with TypeScript and styled-components
3. Add tests
4. Export the component from the index file

### Testing

```
npm test
```

### Building

```
npm run build
```

## Design Principles

- **Consistency**: All components follow the Equihome design system
- **Accessibility**: Components meet WCAG 2.1 AA standards
- **Responsiveness**: Components work on all screen sizes
- **Performance**: Components are optimized for performance
- **Reusability**: Components are designed to be reused across applications
