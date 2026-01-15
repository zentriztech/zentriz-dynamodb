"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marshallItem = marshallItem;
/**
 * Marshall JavaScript object to DynamoDB format
 * This is a simple implementation - AWS SDK handles this automatically
 */
function marshallItem(item) {
    // AWS SDK v3 handles marshalling automatically via DynamoDBDocumentClient
    // This is kept for compatibility or custom transformations
    return item;
}
