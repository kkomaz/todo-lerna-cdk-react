import { buildResponse } from '../../../../utils/buildResponse';
import { deleteTodoDb } from '../data/todos';

export const handler = async (event: any) => {
  const data = JSON.parse(event.body);
  const { todoId, userId } = data;

  const params = {
    todoId,
    userId,
  };

  try {
    await deleteTodoDb(params);
    return buildResponse(200, `Successfully Deleted`);
  } catch (e) {
    console.error(e);
    return buildResponse(500, e.response);
  }
};
