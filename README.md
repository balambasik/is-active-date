# is-active-date

A simple and flexible TypeScript utility to check if a date (or the current moment) falls within a specified range.

## Features

- Support for various input types: `Date`, `string` (ISO), `number` (timestamp).
- Ability to check with different precision: milliseconds or day.
- Handling of open-ended ranges (start only or stop only).
- Written in TypeScript with full typing.

## Installation

```bash
npm install is-active-date
```

## Usage

### Basic Example

```typescript
import { isActiveDate } from 'is-active-date';

// Check if a promotion is currently active
const active = isActiveDate({
  start: '2025-01-01',
  stop: '2025-12-31'
});

console.log(active); // true or false depending on the current date
```

### Entity Example (Promotion)

You can easily use the function to check objects that have date fields.

```typescript
// Define the structure of our promotion object
interface Promotion {
  name: string;
  startDate: string;
  endDate: string;
}

// Create a sample promotion instance
const promo: Promotion = {
  name: 'Summer Sale',
  startDate: '2025-06-01',
  endDate: '2025-08-31'
};

// Check if the current date falls within the promotion's range
const isPromoActive = isActiveDate({
  start: promo.startDate,
  stop: promo.endDate
});

// Display a message if the promotion is active
if (isPromoActive) {
  console.log(`Promotion "${promo.name}" is active!`);
}
```

### Open Ranges

```typescript
// Active from a certain date onwards
isActiveDate({ start: '2025-01-01' });

// Active until a certain date
isActiveDate({ stop: '2025-12-31' });
```

### Using Precision

By default, comparison is done with millisecond precision. You can change this to `'day'` to compare only calendar days.

```typescript
const start = '2025-05-20T20:00:00.000Z';
const now = '2025-05-20T08:00:00.000Z';

// Returns false because 08:00 is earlier than 20:00
isActiveDate({ start, now, precision: 'millisecond' });

// Returns true because it is the same day
isActiveDate({ start, now, precision: 'day' });
```

## API

### `isActiveDate(options: IsActiveDateOptions): boolean`

The main function to check the date.

#### Options (`IsActiveDateOptions`)

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `start` | `Date \| string \| number \| null` | Start date (inclusive). |
| `stop` | `Date \| string \| number \| null` | End date (inclusive). |
| `now` | `Date \| string \| number` | The date to check (defaults to `new Date()`). |
| `precision` | `'millisecond' \| 'day'` | Comparison precision (defaults to `'millisecond'`). |

## Testing

```bash
npm test
```

## License

MIT
