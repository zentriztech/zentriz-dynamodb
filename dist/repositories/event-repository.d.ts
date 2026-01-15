import { BaseRepository } from './base-repository';
import { DomainEvent } from '../types/event.types';
export declare class EventRepository extends BaseRepository<DomainEvent> {
    /**
     * Save event
     */
    saveEvent(event: DomainEvent): Promise<void>;
    /**
     * Get events by aggregate ID
     */
    getEventsByAggregateId(aggregateId: string): Promise<DomainEvent[]>;
    /**
     * Get events by aggregate type
     */
    getEventsByAggregateType(aggregateType: string): Promise<DomainEvent[]>;
    /**
     * Get events by event type
     */
    getEventsByEventType(eventType: string): Promise<DomainEvent[]>;
}
