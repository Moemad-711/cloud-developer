import 'source-map-support/register'
//import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { parseUserId } from '../../auth/utils'
//import { createLogger } from '../../utils/logger'
import { getTodoItems } from '../../../bussinessLogic/todos'

//const XAWS = AWSXRay.captureAWS(AWS)

//const docClient = new  XAWS.DynamoDB.DocumentClient()
//const TODOTable = process.env.TODO_TABLE

//const logger = createLogger('todoLogger')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Caller event', event)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  /*
  const userId = parseUserId(jwtToken)  

  const result = await docClient.query({
    TableName: TODOTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false
  }).promise()

  logger.info('get todo items for user ${userId}')
  */
  const items = await getTodoItems(jwtToken)
  return{
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: items
    })
  }
}
