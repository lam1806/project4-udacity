import { parseUserId } from '../auth/utils'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate'
import { AllToDoAccess } from './TodosAcess'

const allToDoAccess = new AllToDoAccess()

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return allToDoAccess.updateToDo(updateTodoRequest, todoId, userId);
}