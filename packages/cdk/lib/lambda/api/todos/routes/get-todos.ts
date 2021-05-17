import { buildResponse } from '../../../../utils/buildResponse';
import { getAllTodos } from '../data/todos';

export const handler = async () => {
  try {
    const todos = await getAllTodos();

    return buildResponse(200, {
      todos,
    });
  } catch (e) {
    console.error(e);
    return buildResponse(500, e.response);
  }
};
