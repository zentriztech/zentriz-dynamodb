import { BaseRepository } from './base-repository';
import { DomainEvent } from '../types/event.types';
import { getLogger } from '@zentriztech/core';

const logger = getLogger({ functionName: 'EventRepository' });

export class EventRepository extends BaseRepository<DomainEvent> {
  /**
   * Save event
   */
  async saveEvent(event: DomainEvent): Promise<void> {
    await this.put(event);
    logger.info({ msg: 'Event saved', aggregateId: event.aggregateId, eventType: event.eventType });
  }

  /**
   * Get events by aggregate ID
   */
  async getEventsByAggregateId(aggregateId: string): Promise<DomainEvent[]> {
    const result = await this.query(
      'aggregateId = :aggregateId',
      { ':aggregateId': aggregateId },
      {
        limit: 1000, // Adjust as needed
      }
    );

    return result.items.sort((a, b) => a.eventVersion - b.eventVersion);
  }

  /**
   * Get events by aggregate type
   */
  async getEventsByAggregateType(aggregateType: string): Promise<DomainEvent[]> {
    // This would typically use a GSI (Global Secondary Index)
    // For now, using scan with filter
    const result = await this.scan({
      filterExpression: 'aggregateType = :aggregateType',
      expressionAttributeValues: { ':aggregateType': aggregateType },
    });

    return result.items.sort((a, b) => a.eventVersion - b.eventVersion);
  }

  /**
   * Get events by event type
   */
  async getEventsByEventType(eventType: string): Promise<DomainEvent[]> {
    // This would typically use a GSI
    const result = await this.scan({
      filterExpression: 'eventType = :eventType',
      expressionAttributeValues: { ':eventType': eventType },
    });

    return result.items;
  }
}
