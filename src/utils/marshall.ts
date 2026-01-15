/**
 * Marshall JavaScript object to DynamoDB format
 * This is a simple implementation - AWS SDK handles this automatically
 */
export function marshallItem(item: Record<string, any>): Record<string, any> {
  // AWS SDK v3 handles marshalling automatically via DynamoDBDocumentClient
  // This is kept for compatibility or custom transformations
  return item;
}
