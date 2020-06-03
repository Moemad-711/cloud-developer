import 'source-map-support/register'
//import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
//import { parseUserId } from '../../auth/utils'
//import { createLogger } from '../../utils/logger'
import { deleteTodoItem } from '../../../bussinessLogic/todos'

//const XAWS = AWSXRay.captureAWS(AWS)

//const docClient = new  XAWS.DynamoDB.DocumentClient()
//const TODOTable = process.env.TODO_TABLE

//const logger = createLogger('todoLogger')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  console.log('Caller event', event)

  if(!todoId)
  {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: 'todoId Parameter is missing'
    }
  }
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  /*
  const userId = parseUserId(jwtToken)  

  await docClient.delete({
    TableName: TODOTable,
    Key:{
      userId: userId,
      todoId: todoId
    },
    ConditionExpression:'userId = :userId AND todoId = :todoId',
    ExpressionAttributeValues:{
      ':userId': userId,
      ':todoId': todoId
    }
  }).promise()

  logger.info('user ${userId} deleted todo eith ID ${todoId}')
  */
  await deleteTodoItem(jwtToken, todoId)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
