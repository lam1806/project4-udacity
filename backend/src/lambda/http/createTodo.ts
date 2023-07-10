import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createToDo } from '../../helpers/CreateTodo'
import { cors, httpErrorHandler } from 'middy/middlewares'
//import { getUserId } from '../utils';
//import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    const toDoItem = await createToDo(newTodo, jwtToken)
    const result = {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: toDoItem
      })
    }
    return result
  })

  handler.use(httpErrorHandler()).use(
    cors({
      credentials: true
    })
  )