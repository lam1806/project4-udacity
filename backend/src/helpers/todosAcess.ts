import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { S3 } from 'aws-sdk'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class AllToDoAccess {
  private readonly docClient: DocumentClient
  private readonly s3Client: S3
  private readonly todoTable: string
  private readonly s3BucketName: string

  constructor(
    docClient?: DocumentClient,
    s3Client?: S3,
    todoTable?: string,
    s3BucketName?: string
  ) {
    this.docClient = docClient || new DocumentClient()
    this.s3Client = s3Client || new S3({ signatureVersion: 'v4' })
    this.todoTable = todoTable || process.env.TODOS_TABLE || ''
    this.s3BucketName =
      s3BucketName || process.env.ATTACHMENT_S3_BUCKET_VALUE || ''
  }

  public async getAllToDo(userId: string): Promise<TodoItem[]> {
    console.log('Getting all item todos ')

    const params: DocumentClient.QueryInput = {
      TableName: this.todoTable,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.docClient.query(params).promise()

    const items: TodoItem[] = result.Items as TodoItem[]
    return items
  }

  public async createToDo(todoItem: TodoItem): Promise<TodoItem> {
    console.log('Creating new todo')

    const params: DocumentClient.PutItemInput = {
      TableName: this.todoTable,
      Item: todoItem
    }

    await this.docClient.put(params).promise()
    console.log('Todo created successfully')

    return todoItem
  }

  public async updateToDo(
    update: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<TodoUpdate> {
    console.log('Updating todo')

    const params: DocumentClient.UpdateItemInput = {
      TableName: this.todoTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set #nameItem = :nameItem, #dueDateItem = :dueDateItem, #doneITem = :doneItem',
      ExpressionAttributeNames: {
        '#nameItem': 'name',
        '#doneITem': 'done',
        '#dueDateItem': 'dueDate'
      },
      ExpressionAttributeValues: {
        ':nameItem': update.name,
        ':doneITem': update.done,
        ':dueDateItem': update.dueDate
      },
      ReturnValues: 'ALL_NEW'
    }

    const result = await this.docClient.update(params).promise()
    console.log(result)

    const updatedTodo: TodoUpdate = result.Attributes as TodoUpdate
    return updatedTodo
  }

  async uploadUrlImage(todoId: string): Promise<string> {
    console.log('Generating URL')

    const url = this.s3Client.getSignedUrl('putObject', {
      Bucket: this.s3BucketName,
      Key: todoId,
      Expires: 1000
    })
    console.log(url)

    return url as string
  }

  async deleteToDo(todoId: string, userId: string): Promise<string> {
    console.log('Deleting todo')

    const params = {
      Key: {
        userId: userId,
        todoId: todoId
      },
      TableName: this.todoTable
    }

    const result = await this.docClient.delete(params).promise()
    console.log(result)

    return '' as string
  }
}
