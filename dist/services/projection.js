"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Projection = void 0;
const base_repository_1 = require("../repositories/base-repository");
const core_1 = require("@zentriztech/core");
const logger = (0, core_1.getLogger)({ functionName: 'Projection' });
class Projection {
    repository;
    handler;
    constructor(tableName, handler) {
        this.repository = new base_repository_1.BaseRepository({ tableName });
        this.handler = handler;
    }
    /**
     * Process event and update projection
     */
    async processEvent(event, aggregateKey) {
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
        }
        catch (error) {
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
    async getState(key) {
        return this.repository.get(key);
    }
}
exports.Projection = Projection;
