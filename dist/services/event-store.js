"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStore = void 0;
const event_repository_1 = require("../repositories/event-repository");
const core_1 = require("@zentriztech/core");
const logger = (0, core_1.getLogger)({ functionName: 'EventStore' });
class EventStore {
    repository;
    constructor(options) {
        this.repository = new event_repository_1.EventRepository({
            tableName: options.tableName,
        });
    }
    /**
     * Append event to store
     */
    async appendEvent(aggregateId, aggregateType, eventType, payload, metadata) {
        // Get current events to determine version
        const existingEvents = await this.repository.getEventsByAggregateId(aggregateId);
        const nextVersion = existingEvents.length > 0
            ? Math.max(...existingEvents.map(e => e.eventVersion)) + 1
            : 1;
        const event = {
            id: (0, core_1.newId)(),
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
    async getAggregateEvents(aggregateId) {
        return this.repository.getEventsByAggregateId(aggregateId);
    }
    /**
     * Get events by aggregate type
     */
    async getEventsByAggregateType(aggregateType) {
        return this.repository.getEventsByAggregateType(aggregateType);
    }
    /**
     * Get events by event type
     */
    async getEventsByEventType(eventType) {
        return this.repository.getEventsByEventType(eventType);
    }
}
exports.EventStore = EventStore;
