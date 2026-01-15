import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBOptions } from '../types/dynamodb.types';
import { getLogger } from '@zentriztech/core';

const logger = getLogger({ functionName: 'DynamoDBConnection' });

let documentClient: DynamoDBDocumentClient | null = null;
let client: DynamoDBClient | null = null;

/**
 * Get or create DynamoDB document client singleton
 */
export function getDynamoDBClient(options?: DynamoDBOptions): DynamoDBDocumentClient {
  if (documentClient) {
    return documentClient;
  }

  const config = {
    region: options?.region || process.env.AWS_REGION || 'us-east-1',
    endpoint: options?.endpoint || process.env.DYNAMODB_ENDPOINT,
    credentials: options?.credentials || undefined,
  };

  client = new DynamoDBClient(config);
  documentClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      removeUndefinedValues: true,
      convertEmptyValues: false,
    },
    unmarshallOptions: {
      wrapNumbers: false,
    },
  });

  logger.info({ msg: 'DynamoDB client initialized', region: config.region });
  return documentClient;
}

/**
 * Get current DynamoDB document client instance
 */
export function getCurrentDynamoDBClient(): DynamoDBDocumentClient | null {
  return documentClient;
}

/**
 * Close DynamoDB client
 */
export function closeDynamoDBClient(): void {
  if (client) {
    client.destroy();
    client = null;
    documentClient = null;
    logger.info({ msg: 'DynamoDB client closed' });
  }
}
