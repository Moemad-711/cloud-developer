import 'source-map-support/register'
//import * as uuid from 'uuid'
//import * as AWS  from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
//import { parseUserId } from '../../auth/utils'
//import { createLogger } from '../../utils/logger'
import { createTodoItem } from '../../../bussinessLogic/todos'

/*
const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const TODOTable = process.env.TODO_TABLE
const bucketName = process.env.ATTACH_S3_BUCKET
*/
//const logger = createLogger('todoLogger')


export const handler : APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  console.log('Caller event', event)


  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  /*
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
    }).promise()
  
  logger.info('user ${userId} created todo eith ID ${todoId}', newItem)

  */
  const newItem = await createTodoItem(jwtToken, newTodo)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: {
          todoId: newItem.todoId,
          createdAt: newItem.createdAt,
          name: newItem.name,
          dueDate: newItem.dueDate,
          done: newItem.done,
          attachmentUrl: newItem.attachmentUrl
        }
      })
    }}


