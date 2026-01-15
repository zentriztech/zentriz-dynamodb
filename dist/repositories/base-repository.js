"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const connection_1 = require("../connection");
const core_1 = require("@zentriztech/core");
const logger = (0, core_1.getLogger)({ functionName: 'BaseRepository' });
class BaseRepository {
    client;
    tableName;
    constructor(options) {
        this.tableName = options.tableName;
        this.client = options.client || (0, connection_1.getDynamoDBClient)();
    }
    /**
     * Get item by key
     */
    async get(key) {
        try {
            const command = new lib_dynamodb_1.GetCommand({
                TableName: this.tableName,
                Key: key,
            });
            const result = await this.client.send(command);
            return result.Item || null;
        }
        catch (error) {
            logger.error({ msg: 'DynamoDB get error', table: this.tableName, key, error: error.message });
            throw error;
        }
    }
    /**
     * Put item
     */
    async put(item) {
        try {
            const command = new lib_dynamodb_1.PutCommand({
                TableName: this.tableName,
                Item: item,
            });
            await this.client.send(command);
        }
        catch (error) {
            logger.error({ msg: 'DynamoDB put error', table: this.tableName, error: error.message });
            throw error;
        }
    }
    /**
     * Delete item by key
     */
    async delete(key) {
        try {
            const command = new lib_dynamodb_1.DeleteCommand({
                TableName: this.tableName,
                Key: key,
            });
            await this.client.send(command);
        }
        catch (error) {
            logger.error({ msg: 'DynamoDB delete error', table: this.tableName, key, error: error.message });
            throw error;
        }
    }
    /**
     * Query items
     */
    async query(keyConditionExpression, expressionAttributeValues, options = {}) {
        try {
            const command = new lib_dynamodb_1.QueryCommand({
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
                items: result.Items || [],
                lastEvaluatedKey: result.LastEvaluatedKey,
            };
        }
        catch (error) {
            logger.error({ msg: 'DynamoDB query error', table: this.tableName, error: error.message });
            throw error;
        }
    }
    /**
     * Scan items
     */
    async scan(options = {}) {
        try {
            const command = new lib_dynamodb_1.ScanCommand({
                TableName: this.tableName,
                FilterExpression: options.filterExpression,
                ExpressionAttributeValues: options.expressionAttributeValues,
                Limit: options.limit,
                ExclusiveStartKey: options.exclusiveStartKey,
            });
            const result = await this.client.send(command);
            return {
                items: result.Items || [],
                lastEvaluatedKey: result.LastEvaluatedKey,
            };
        }
        catch (error) {
            logger.error({ msg: 'DynamoDB scan error', table: this.tableName, error: error.message });
            throw error;
        }
    }
    /**
     * Batch get items
     */
    async batchGet(keys) {
        try {
            const command = new lib_dynamodb_1.BatchGetCommand({
                RequestItems: {
                    [this.tableName]: {
                        Keys: keys,
                    },
                },
            });
            const result = await this.client.send(command);
            return result.Responses?.[this.tableName] || [];
        }
        catch (error) {
            logger.error({ msg: 'DynamoDB batchGet error', table: this.tableName, error: error.message });
            throw error;
        }
    }
    /**
     * Batch write items
     */
    async batchWrite(puts = [], deletes = []) {
        try {
            const requestItems = {};
            if (puts.length > 0 || deletes.length > 0) {
                requestItems[this.tableName] = [
                    ...puts.map(item => ({ PutRequest: { Item: item } })),
                    ...deletes.map(key => ({ DeleteRequest: { Key: key } })),
                ];
            }
            if (Object.keys(requestItems).length === 0) {
                return;
            }
            const command = new lib_dynamodb_1.BatchWriteCommand({
                RequestItems: requestItems,
            });
            await this.client.send(command);
        }
        catch (error) {
            logger.error({ msg: 'DynamoDB batchWrite error', table: this.tableName, error: error.message });
            throw error;
        }
    }
}
exports.BaseRepository = BaseRepository;
