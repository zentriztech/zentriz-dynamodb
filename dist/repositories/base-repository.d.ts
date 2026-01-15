import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { BaseRepositoryOptions } from '../types/dynamodb.types';
export declare class BaseRepository<T extends Record<string, any> = Record<string, any>> {
    protected client: DynamoDBDocumentClient;
    protected tableName: string;
    constructor(options: BaseRepositoryOptions);
    /**
     * Get item by key
     */
    get(key: Record<string, any>): Promise<T | null>;
    /**
     * Put item
     */
    put(item: T): Promise<void>;
    /**
     * Delete item by key
     */
    delete(key: Record<string, any>): Promise<void>;
    /**
     * Query items
     */
    query(keyConditionExpression: string, expressionAttributeValues: Record<string, any>, options?: {
        indexName?: string;
        filterExpression?: string;
        limit?: number;
        exclusiveStartKey?: Record<string, any>;
    }): Promise<{
        items: T[];
        lastEvaluatedKey?: Record<string, any>;
    }>;
    /**
     * Scan items
     */
    scan(options?: {
        filterExpression?: string;
        expressionAttributeValues?: Record<string, any>;
        limit?: number;
        exclusiveStartKey?: Record<string, any>;
    }): Promise<{
        items: T[];
        lastEvaluatedKey?: Record<string, any>;
    }>;
    /**
     * Batch get items
     */
    batchGet(keys: Record<string, any>[]): Promise<T[]>;
    /**
     * Batch write items
     */
    batchWrite(puts?: T[], deletes?: Record<string, any>[]): Promise<void>;
}
