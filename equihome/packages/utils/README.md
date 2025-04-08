# Equihome Utilities

Shared utility functions for the Equihome Platform. These utilities are used across all applications to provide common functionality.

## Utilities

- **Formatting**: Format numbers, dates, currencies, etc.
- **Validation**: Validate inputs, forms, data structures
- **Calculations**: Financial calculations, statistics, metrics
- **Data Transformation**: Transform data between different formats
- **Geospatial**: Work with geographic data, coordinates, distances
- **Analytics**: Track events, measure performance, gather insights

## Usage

```typescript
import { formatCurrency, calculateIRR, validateEmail } from '@equihome/utils';

// Format a currency value
const formattedPrice = formatCurrency(1500000, 'AUD'); // $1,500,000

// Calculate IRR
const irr = calculateIRR(cashflows, dates);

// Validate an email address
const isValid = validateEmail('user@example.com');
```

## Categories

### Formatting

```typescript
import { formatCurrency, formatPercentage, formatDate } from '@equihome/utils/formatting';

formatCurrency(1500000, 'AUD'); // $1,500,000
formatPercentage(0.0825); // 8.25%
formatDate(new Date(), 'DD/MM/YYYY'); // 15/04/2023
```

### Validation

```typescript
import { validateEmail, validatePostcode, validateABN } from '@equihome/utils/validation';

validateEmail('user@example.com'); // true
validatePostcode('2000', 'AU'); // true
validateABN('51824753556'); // true
```

### Calculations

```typescript
import { calculateIRR, calculateROI, calculateLTV } from '@equihome/utils/calculations';

calculateIRR(cashflows, dates); // 0.15 (15%)
calculateROI(investment, returns); // 0.22 (22%)
calculateLTV(loanAmount, propertyValue); // 0.75 (75%)
```

### Geospatial

```typescript
import { calculateDistance, isPointInPolygon } from '@equihome/utils/geospatial';

calculateDistance(
  { lat: -33.8688, lng: 151.2093 }, // Sydney
  { lat: -37.8136, lng: 144.9631 }  // Melbourne
); // 714 (kilometers)

isPointInPolygon(point, suburbPolygon); // true
```

## Development

### Adding a new utility

1. Create a new file in the appropriate directory
2. Implement the utility function with TypeScript
3. Add tests
4. Export the function from the index file

### Testing

```
npm test
```

### Building

```
npm run build
```
