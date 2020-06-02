import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { parseUserId } from '../../auth/utils'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWS from 'aws-sdk'

const docClient: DocumentClient = new  AWS.DynamoDB.DocumentClient()
const TODOTable = process.env.TODO_TABLE


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const userId = parseUserId(jwtToken)  

  await docClient.delete({
    TableName: TODOTable,
    ConditionExpression:'userId = :userId AND todoId = :todoId',
    ExpressionAttributeValues:{
      ':userId': userId,
      ':todoId': todoId
    }, 
    Key:{
      userId: userId,
      todoId: todoId
    }
  })


  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'Item Deleted'
      
    })
  }
}
