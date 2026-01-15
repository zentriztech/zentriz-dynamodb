import { DomainEvent } from '../types/event.types';
import { BaseRepository } from '../repositories/base-repository';
import { getLogger } from '@zentriztech/core';

const logger = getLogger({ functionName: 'Projection' });

export type ProjectionHandler<T = any> = (event: DomainEvent, currentState: T | null) => Promise<T> | T;

export class Projection<T extends Record<string, any> = Record<string, any>> {
  private repository: BaseRepository<T>;
  private handler: ProjectionHandler<T>;

  constructor(
    tableName: string,
    handler: ProjectionHandler<T>
  ) {
    this.repository = new BaseRepository<T>({ tableName });
    this.handler = handler;
  }

  /**
   * Process event and update projection
   */
  async processEvent(event: DomainEvent, aggregateKey: Record<string, any>): Promise<T> {
    try {
      // Get current projection state
      const currentState = await this.repository.get(aggregateKey);

      // Apply event handler
      const newState = await this.handler(event, currentState);

      // Save updated projection
      await this.repository.put(newState);

      logger.info({
        msg: 'Projection updated',
        aggregateId: event.aggregateId,
        eventType: event.eventType,
      });

      return newState;
    } catch (error: any) {
      logger.error({
        msg: 'Projection processing error',
        aggregateId: event.aggregateId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get projection state
   */
  async getState(key: Record<string, any>): Promise<T | null> {
    return this.repository.get(key);
  }
}
