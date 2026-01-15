"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamoDBClient = getDynamoDBClient;
exports.getCurrentDynamoDBClient = getCurrentDynamoDBClient;
exports.closeDynamoDBClient = closeDynamoDBClient;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const core_1 = require("@zentriztech/core");
const logger = (0, core_1.getLogger)({ functionName: 'DynamoDBConnection' });
let documentClient = null;
let client = null;
/**
 * Get or create DynamoDB document client singleton
 */
function getDynamoDBClient(options) {
    if (documentClient) {
        return documentClient;
    }
    const config = {
        region: options?.region || process.env.AWS_REGION || 'us-east-1',
        endpoint: options?.endpoint || process.env.DYNAMODB_ENDPOINT,
        credentials: options?.credentials || undefined,
    };
    client = new client_dynamodb_1.DynamoDBClient(config);
    documentClient = lib_dynamodb_1.DynamoDBDocumentClient.from(client, {
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
function getCurrentDynamoDBClient() {
    return documentClient;
}
/**
 * Close DynamoDB client
 */
function closeDynamoDBClient() {
    if (client) {
        client.destroy();
        client = null;
        documentClient = null;
        logger.info({ msg: 'DynamoDB client closed' });
    }
}
