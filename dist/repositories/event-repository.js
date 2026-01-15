"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRepository = void 0;
const base_repository_1 = require("./base-repository");
const core_1 = require("@zentriztech/core");
const logger = (0, core_1.getLogger)({ functionName: 'EventRepository' });
class EventRepository extends base_repository_1.BaseRepository {
    /**
     * Save event
     */
    async saveEvent(event) {
        await this.put(event);
        logger.info({ msg: 'Event saved', aggregateId: event.aggregateId, eventType: event.eventType });
    }
    /**
     * Get events by aggregate ID
     */
    async getEventsByAggregateId(aggregateId) {
        const result = await this.query('aggregateId = :aggregateId', { ':aggregateId': aggregateId }, {
            limit: 1000, // Adjust as needed
        });
        return result.items.sort((a, b) => a.eventVersion - b.eventVersion);
    }
    /**
     * Get events by aggregate type
     */
    async getEventsByAggregateType(aggregateType) {
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
    async getEventsByEventType(eventType) {
        // This would typically use a GSI
        const result = await this.scan({
            filterExpression: 'eventType = :eventType',
            expressionAttributeValues: { ':eventType': eventType },
        });
        return result.items;
    }
}
exports.EventRepository = EventRepository;
