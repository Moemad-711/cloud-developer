import 'source-map-support/register'
//import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
//import { parseUserId } from '../../auth/utils'
//import { createLogger } from '../../utils/logger'
import { updateTodoItem } from '../../../bussinessLogic/todos'


//const XAWS = AWSXRay.captureAWS(AWS)

//const docClient = new XAWS.DynamoDB.DocumentClient()
//const TODOTable = process.env.TODO_TABLE

//const logger = createLogger('todoLogger')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  console.log('Caller event', event)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  /*
  const userId = parseUserId(jwtToken) 
  

  await docClient.update({
    TableName: TODOTable,
    Key: {
        todoId,
        userId
    },
    UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
    ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done
    },
    ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
    }
  }).promise();

  logger.info('user ${userId} updated todo eith ID ${todoId}')
  */
  await updateTodoItem(jwtToken, todoId, updatedTodo)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: ''
  }
}
