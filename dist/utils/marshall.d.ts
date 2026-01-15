/**
 * Marshall JavaScript object to DynamoDB format
 * This is a simple implementation - AWS SDK handles this automatically
 */
export declare function marshallItem(item: Record<string, any>): Record<string, any>;
