export interface DomainEvent {
  id: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  eventVersion: number;
  payload: Record<string, any>;
  metadata?: {
    timestamp: string;
    userId?: string;
    correlationId?: string;
    causationId?: string;
    [key: string]: any;
  };
}

export interface EventStoreOptions {
  tableName: string;
  streamEnabled?: boolean;
}
