import { buildResponse } from '../../../../utils/buildResponse';
import { updateTodoDb } from '../data/todos';

export const handler = async (event: any) => {
  const { todoId } = event.pathParameters;
  console.log(event.pathParameters, '::pathParameters');
  console.log(todoId, '::todoId');
  const data = JSON.parse(event.body);

  const { userId, description, completed } = data;

  const todo = {
    userId,
    todoId,
    description,
    completed,
  };

  try {
    await updateTodoDb(todo);
    return buildResponse(200, { todo });
  } catch (e) {
    console.error(e);
    return buildResponse(500, e.response);
  }
};
