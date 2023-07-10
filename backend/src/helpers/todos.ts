//import { TodosAccess } from './todosAcess'
//import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { AllToDoAccess } from './TodosAcess'
import { parseUserId } from '../auth/utils'
//import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import { createLogger } from '../utils/logger'
//import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic

const allToDoAccess = new AllToDoAccess()
export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken)
    return allToDoAccess.getAllToDo(userId)
  }
