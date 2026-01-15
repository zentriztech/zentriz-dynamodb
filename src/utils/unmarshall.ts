/**
 * Unmarshall DynamoDB format to JavaScript object
 * This is a simple implementation - AWS SDK handles this automatically
 */
export function unmarshallItem(item: Record<string, any>): Record<string, any> {
  // AWS SDK v3 handles unmarshalling automatically via DynamoDBDocumentClient
  // This is kept for compatibility or custom transformations
  return item;
}
