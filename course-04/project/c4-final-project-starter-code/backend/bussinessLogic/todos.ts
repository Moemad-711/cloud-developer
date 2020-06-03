import 'source-map-support/register'
import * as uuid from 'uuid'

import { TodoAccess } from "../dataLayer/todoAccess"
import { CreateTodoRequest } from '../src/requests/CreateTodoRequest'
import { parseUserId } from '../src/auth/utils'
import { TodoItem } from '../src/models/TodoItem'
import { createLogger } from '../src/utils/logger'
import { UpdateTodoRequest } from '../src/requests/UpdateTodoRequest'


const todoAccess = new TodoAccess()
const bucketName = process.env.ATTACH_S3_BUCKET

const logger = createLogger('todoLogger')

export async function createTodoItem(jwtToken, newTodo: CreateTodoRequest) : Promise<TodoItem>{
    
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
    
    todoAccess.createTodoItem(newItem)
    logger.info('user ${userId} created todo eith ID ${todoId}', newItem)

    return newItem as TodoItem
}

export async function getTodoItems(jwtToken) : Promise<TodoItem[]>{
    const userId = parseUserId(jwtToken)
    
    const items = await todoAccess.getTodoItems(userId)
    logger.info('get todo items for user ${userId}')

    return items 
}

export async function deleteTodoItem(jwtToken, todoId){
    const userId = parseUserId(jwtToken)

    await todoAccess.deleteTodoItem(userId, todoId)
    logger.info('user ${userId} deleted todo eith ID ${todoId}')
}

export async function updateTodoItem(jwtToken, todoId, updatedTodo: UpdateTodoRequest){
    const userId = parseUserId(jwtToken)

    await todoAccess.updateTodoItem(userId, todoId, updatedTodo)
    logger.info('user ${userId} updated todo eith ID ${todoId}')

}