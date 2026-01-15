import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBOptions } from '../types/dynamodb.types';
/**
 * Get or create DynamoDB document client singleton
 */
export declare function getDynamoDBClient(options?: DynamoDBOptions): DynamoDBDocumentClient;
/**
 * Get current DynamoDB document client instance
 */
export declare function getCurrentDynamoDBClient(): DynamoDBDocumentClient | null;
/**
 * Close DynamoDB client
 */
export declare function closeDynamoDBClient(): void;
