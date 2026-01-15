# @zentriztech/dynamodb

Zentriz DynamoDB Package - DynamoDB client for Event Store (CQRS).

## Installation

```bash
npm install @zentriztech/dynamodb
```

## Usage

### Basic CRUD Operations

```typescript
import { BaseRepository } from '@zentriztech/dynamodb';

const repository = new BaseRepository({
  tableName: 'users',
});

// Get item
const user = await repository.get({ id: '123' });

// Put item
await repository.put({
  id: '123',
  name: 'John',
  email: 'john@example.com',
});

// Delete item
await repository.delete({ id: '123' });

// Query items
const result = await repository.query(
  'id = :id',
  { ':id': '123' }
);

// Scan items
const scanResult = await repository.scan({
  filterExpression: 'status = :status',
  expressionAttributeValues: { ':status': 'active' },
});
```

### Event Store (CQRS)

```typescript
import { EventStore } from '@zentriztech/dynamodb';

const eventStore = new EventStore({
  tableName: 'events',
  streamEnabled: true,
});

// Append event
const event = await eventStore.appendEvent(
  'user-123',
  'User',
  'UserCreated',
  { name: 'John', email: 'john@example.com' },
  { userId: 'admin-1' }
);

// Get events for aggregate
const events = await eventStore.getAggregateEvents('user-123');

// Get events by type
const userEvents = await eventStore.getEventsByAggregateType('User');
```

### Projections

```typescript
import { Projection } from '@zentriztech/dynamodb';

const userProjection = new Projection(
  'user-projections',
  async (event, currentState) => {
    if (event.eventType === 'UserCreated') {
      return {
        id: event.aggregateId,
        ...event.payload,
        version: event.eventVersion,
      };
    }
    
    if (event.eventType === 'UserUpdated') {
      return {
        ...currentState,
        ...event.payload,
        version: event.eventVersion,
      };
    }
    
    return currentState || {};
  }
);

// Process event
await userProjection.processEvent(event, { id: event.aggregateId });

// Get projection state
const state = await userProjection.getState({ id: 'user-123' });
```

### Batch Operations

```typescript
// Batch get
const items = await repository.batchGet([
  { id: '1' },
  { id: '2' },
  { id: '3' },
]);

// Batch write
await repository.batchWrite(
  [{ id: '1', name: 'John' }], // puts
  [{ id: '2' }] // deletes
);
```

## Configuration

Set environment variables:

```bash
AWS_REGION=us-east-1
DYNAMODB_ENDPOINT=http://localhost:8000  # For local development
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Clean
npm run clean
```

## License

MIT
