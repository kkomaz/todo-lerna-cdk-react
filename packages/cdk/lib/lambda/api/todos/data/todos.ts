import { DynamoDB } from 'aws-sdk';

const dynamo = new DynamoDB.DocumentClient();
const tableName = process.env.TODO_TABLE_NAME || '';

export interface Todo {
  userId: string;
  todoId: string;
}

export const getTodosDB = async () => {
  const scanResult = await dynamo
    .scan({
      TableName: tableName,
    })
    .promise();

  return scanResult;
};

export const updateTodoDb = async (todo: Todo) => {
  return await dynamo
    .put({
      TableName: tableName,
      Item: todo,
    })
    .promise();
};
