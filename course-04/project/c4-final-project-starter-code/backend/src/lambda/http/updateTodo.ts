import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWS from 'aws-sdk'
import { parseUserId } from '../../auth/utils'


const docClient: DocumentClient = new  AWS.DynamoDB.DocumentClient()
const TODOTable = process.env.TODO_TABLE



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const userId = parseUserId(jwtToken) 
  
  await docClient.update({
    TableName: TODOTable,
    Key:{
      userId: userId,
      todoId: todoId
    },
    ConditionExpression:'userId = :userId AND todoId = :todoId',
    UpdateExpression: 'SET name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeValues:{
      ':userId': userId,
      ':todoId': todoId,
      ':name': updatedTodo.name,
      ':dueDate' : updatedTodo.dueDate,
      ':done' : updatedTodo.done
    }
  })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
