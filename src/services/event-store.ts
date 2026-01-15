import { EventRepository } from '../repositories/event-repository';
import { DomainEvent, EventStoreOptions } from '../types/event.types';
import { getLogger, newId } from '@zentriztech/core';

const logger = getLogger({ functionName: 'EventStore' });

export class EventStore {
  private repository: EventRepository;

  constructor(options: EventStoreOptions) {
    this.repository = new EventRepository({
      tableName: options.tableName,
    });
  }

  /**
   * Append event to store
   */
  async appendEvent(
    aggregateId: string,
    aggregateType: string,
    eventType: string,
    payload: Record<string, any>,
    metadata?: DomainEvent['metadata']
  ): Promise<DomainEvent> {
    // Get current events to determine version
    const existingEvents = await this.repository.getEventsByAggregateId(aggregateId);
    const nextVersion = existingEvents.length > 0 
      ? Math.max(...existingEvents.map(e => e.eventVersion)) + 1 
      : 1;

    const event: DomainEvent = {
      id: newId(),
      aggregateId,
      aggregateType,
      eventType,
      eventVersion: nextVersion,
      payload,
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    };

    await this.repository.saveEvent(event);
    logger.info({
      msg: 'Event appended',
      aggregateId,
      aggregateType,
      eventType,
      version: nextVersion,
    });

    return event;
  }

  /**
   * Get events for aggregate
   */
  async getAggregateEvents(aggregateId: string): Promise<DomainEvent[]> {
    return this.repository.getEventsByAggregateId(aggregateId);
  }

  /**
   * Get events by aggregate type
   */
  async getEventsByAggregateType(aggregateType: string): Promise<DomainEvent[]> {
    return this.repository.getEventsByAggregateType(aggregateType);
  }

  /**
   * Get events by event type
   */
  async getEventsByEventType(eventType: string): Promise<DomainEvent[]> {
    return this.repository.getEventsByEventType(eventType);
  }
}
