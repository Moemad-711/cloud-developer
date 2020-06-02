import 'source-map-support/register'
import * as uuid from 'uuid'
import * as AWS  from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'


import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { parseUserId } from '../../auth/utils'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'


const docClient: DocumentClient = new  AWS.DynamoDB.DocumentClient()
const TODOTable = process.env.TODO_TABLE
const bucketName = process.env.attachment_S3_BUCKET


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const todoId = uuid.v4()
  const userId = parseUserId(jwtToken)
  const createdAt = new Date().toISOString()


  const newItem = {
    userId,
    todoId,
    createdAt,
    ...newTodo,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${todoId}`
  }

  await docClient
    .put({
      TableName: TODOTable,
      Item: newItem
    })
    .promise()
  

    return {
      statusCode: 201,
      body: JSON.stringify({
        newItem: newItem,
      })
    }})


handler.use(
  cors({
    credentials: true
  })
)


