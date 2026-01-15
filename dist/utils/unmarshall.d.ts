/**
 * Unmarshall DynamoDB format to JavaScript object
 * This is a simple implementation - AWS SDK handles this automatically
 */
export declare function unmarshallItem(item: Record<string, any>): Record<string, any>;
