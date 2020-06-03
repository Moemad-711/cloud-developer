import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

import {TodoItem} from '../src/models/TodoItem'
import { UpdateTodoRequest } from '../src/requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)


export class TodoAccess {

    constructor(
        private readonly docClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly TODOTable = process.env.TODO_TABLE) {}

    async getTodoItems(userId) : Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.TODOTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            },
            ScanIndexForward: false
          }).promise()
        
        return result.Items as TodoItem[];
    } 

    async createTodoItem(newTodoItem){
        await this.docClient.put({
            TableName: this.TODOTable,
            Item: newTodoItem
        }).promise()

    }

    async updateTodoItem(userId, todoId, updatedTodo: UpdateTodoRequest) {
        await this.docClient.update({
            TableName: this.TODOTable,
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
    }

    async deleteTodoItem(userId, todoId){
        await this.docClient.delete({
            TableName: this.TODOTable,
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
    }




}
