"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unmarshallItem = unmarshallItem;
/**
 * Unmarshall DynamoDB format to JavaScript object
 * This is a simple implementation - AWS SDK handles this automatically
 */
function unmarshallItem(item) {
    // AWS SDK v3 handles unmarshalling automatically via DynamoDBDocumentClient
    // This is kept for compatibility or custom transformations
    return item;
}
