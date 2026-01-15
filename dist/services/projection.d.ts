import { DomainEvent } from '../types/event.types';
export type ProjectionHandler<T = any> = (event: DomainEvent, currentState: T | null) => Promise<T> | T;
export declare class Projection<T extends Record<string, any> = Record<string, any>> {
    private repository;
    private handler;
    constructor(tableName: string, handler: ProjectionHandler<T>);
    /**
     * Process event and update projection
     */
    processEvent(event: DomainEvent, aggregateKey: Record<string, any>): Promise<T>;
    /**
     * Get projection state
     */
    getState(key: Record<string, any>): Promise<T | null>;
}
