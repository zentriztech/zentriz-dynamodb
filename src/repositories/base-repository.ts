import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, QueryCommand, ScanCommand, BatchGetCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { BaseRepositoryOptions } from '../types/dynamodb.types';
import { getDynamoDBClient } from '../connection';
import { getLogger } from '@zentriztech/core';

const logger = getLogger({ functionName: 'BaseRepository' });

export class BaseRepository<T extends Record<string, any> = Record<string, any>> {
  protected client: DynamoDBDocumentClient;
  protected tableName: string;

  constructor(options: BaseRepositoryOptions) {
    this.tableName = options.tableName;
    this.client = options.client || getDynamoDBClient();
  }

  /**
   * Get item by key
   */
  async get(key: Record<string, any>): Promise<T | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: key,
      });

      const result = await this.client.send(command);
      return (result.Item as T) || null;
    } catch (error: any) {
      logger.error({ msg: 'DynamoDB get error', table: this.tableName, key, error: error.message });
      throw error;
    }
  }

  /**
   * Put item
   */
  async put(item: T): Promise<void> {
    try {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: item,
      });

      await this.client.send(command);
    } catch (error: any) {
      logger.error({ msg: 'DynamoDB put error', table: this.tableName, error: error.message });
      throw error;
    }
  }

  /**
   * Delete item by key
   */
  async delete(key: Record<string, any>): Promise<void> {
    try {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: key,
      });

      await this.client.send(command);
    } catch (error: any) {
      logger.error({ msg: 'DynamoDB delete error', table: this.tableName, key, error: error.message });
      throw error;
    }
  }

  /**
   * Query items
   */
  async query(
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, any>,
    options: {
      indexName?: string;
      filterExpression?: string;
      limit?: number;
      exclusiveStartKey?: Record<string, any>;
    } = {}
  ): Promise<{ items: T[]; lastEvaluatedKey?: Record<string, any> }> {
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        IndexName: options.indexName,
        FilterExpression: options.filterExpression,
        Limit: options.limit,
        ExclusiveStartKey: options.exclusiveStartKey,
      });

      const result = await this.client.send(command);
      return {
        items: (result.Items as T[]) || [],
        lastEvaluatedKey: result.LastEvaluatedKey,
      };
    } catch (error: any) {
      logger.error({ msg: 'DynamoDB query error', table: this.tableName, error: error.message });
      throw error;
    }
  }

  /**
   * Scan items
   */
  async scan(
    options: {
      filterExpression?: string;
      expressionAttributeValues?: Record<string, any>;
      limit?: number;
      exclusiveStartKey?: Record<string, any>;
    } = {}
  ): Promise<{ items: T[]; lastEvaluatedKey?: Record<string, any> }> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: options.filterExpression,
        ExpressionAttributeValues: options.expressionAttributeValues,
        Limit: options.limit,
        ExclusiveStartKey: options.exclusiveStartKey,
      });

      const result = await this.client.send(command);
      return {
        items: (result.Items as T[]) || [],
        lastEvaluatedKey: result.LastEvaluatedKey,
      };
    } catch (error: any) {
      logger.error({ msg: 'DynamoDB scan error', table: this.tableName, error: error.message });
      throw error;
    }
  }

  /**
   * Batch get items
   */
  async batchGet(keys: Record<string, any>[]): Promise<T[]> {
    try {
      const command = new BatchGetCommand({
        RequestItems: {
          [this.tableName]: {
            Keys: keys,
          },
        },
      });

      const result = await this.client.send(command);
      return (result.Responses?.[this.tableName] as T[]) || [];
    } catch (error: any) {
      logger.error({ msg: 'DynamoDB batchGet error', table: this.tableName, error: error.message });
      throw error;
    }
  }

  /**
   * Batch write items
   */
  async batchWrite(
    puts: T[] = [],
    deletes: Record<string, any>[] = []
  ): Promise<void> {
    try {
      const requestItems: any = {};

      if (puts.length > 0 || deletes.length > 0) {
        requestItems[this.tableName] = [
          ...puts.map(item => ({ PutRequest: { Item: item } })),
          ...deletes.map(key => ({ DeleteRequest: { Key: key } })),
        ];
      }

      if (Object.keys(requestItems).length === 0) {
        return;
      }

      const command = new BatchWriteCommand({
        RequestItems: requestItems,
      });

      await this.client.send(command);
    } catch (error: any) {
      logger.error({ msg: 'DynamoDB batchWrite error', table: this.tableName, error: error.message });
      throw error;
    }
  }
}
