import { DomainEvent, EventStoreOptions } from '../types/event.types';
export declare class EventStore {
    private repository;
    constructor(options: EventStoreOptions);
    /**
     * Append event to store
     */
    appendEvent(aggregateId: string, aggregateType: string, eventType: string, payload: Record<string, any>, metadata?: DomainEvent['metadata']): Promise<DomainEvent>;
    /**
     * Get events for aggregate
     */
    getAggregateEvents(aggregateId: string): Promise<DomainEvent[]>;
    /**
     * Get events by aggregate type
     */
    getEventsByAggregateType(aggregateType: string): Promise<DomainEvent[]>;
    /**
     * Get events by event type
     */
    getEventsByEventType(eventType: string): Promise<DomainEvent[]>;
}
