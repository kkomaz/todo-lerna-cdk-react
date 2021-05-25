import * as uuid from 'uuid';
import { buildResponse } from '../../../../utils/buildResponse';
import { createTodoDb } from '../data/todos';

export const handler = async (event: any) => {
  const userId = uuid.v4(); // Remove later
  const todoId = uuid.v4();
  const date = new Date();
  const dateTime = date.getTime();

  const data = JSON.parse(event.body);

  const todo = {
    userId,
    todoId,
    created_on: dateTime,
    updated_on: dateTime,
    description: data.description,
    completed: false,
  };
  try {
    await createTodoDb(todo);
    return buildResponse(200, { todo });
  } catch (e) {
    console.error(e);
    return buildResponse(500, e.response);
  }
};
