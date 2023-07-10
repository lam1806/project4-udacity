import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {deleteToDo} from "../../helpers/DeleteTodo";
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

//import { deleteTodo } from '../../businessLogic/todos'
//import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    const deleteData = await deleteToDo(todoId, jwtToken);
    // TODO: Remove a TODO item by id
    const result = {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: deleteData,
  }
  return result
  }
)

handler.use(httpErrorHandler()).use(
    cors({
      credentials: true
    })
  )
