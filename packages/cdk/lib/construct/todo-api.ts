import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs';

import { postTodoModel } from '../models/todo';
import { postTodoRequestValidator } from '../validator/todo';
interface TodoApiProps {
  todosTable: dynamodb.Table;
}

export class TodoApi extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: TodoApiProps) {
    super(scope, id);

    const { todosTable } = props;

    // 1. Setup Gateway Rest API
    const todoApi = new apigateway.RestApi(this, 'todo-api', {
      restApiName: 'Todo API',
      description: 'This manages the TODO API and routes',
      defaultCorsPreflightOptions: {
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });

    // 2. Add Resource
    const todosResource = todoApi.root.addResource('todos');

    // 3. Setup lambda handlers
    // Get Todos
    const getTodos = new lambdaNodejs.NodejsFunction(this, 'GetTodos', {
      entry: path.join(__dirname, '../lambda/api/todos/routes/get-todos.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TODO_TABLE_NAME: todosTable.tableName,
      },
    });

    // Create Todo
    const createTodo = new lambdaNodejs.NodejsFunction(this, 'CreateTodo', {
      entry: path.join(__dirname, '../lambda/api/todos/routes/create-todo.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TODO_TABLE_NAME: todosTable.tableName,
      },
    });

    // Delete Todo
    const deleteTodo = new lambdaNodejs.NodejsFunction(this, 'DeleteTodo', {
      entry: path.join(__dirname, '../lambda/api/todos/routes/delete-todo.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TODO_TABLE_NAME: todosTable.tableName,
      },
    });

    // Update Todo
    const updateTodo = new lambdaNodejs.NodejsFunction(this, 'UpdateTodo', {
      entry: path.join(__dirname, '../lambda/api/todos/routes/update-todo.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TODO_TABLE_NAME: todosTable.tableName,
      },
    });

    // 4. Allow read and write data
    todosTable.grantReadData(getTodos);
    todosTable.grantReadWriteData(createTodo);
    todosTable.grantReadWriteData(deleteTodo);

    // 5. Add Resources /todos
    todosResource.addMethod('GET', new apigateway.LambdaIntegration(getTodos));
    todosResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createTodo),
      {
        requestValidator: postTodoRequestValidator(this, todoApi),
        requestModels: {
          'application/json': postTodoModel(todoApi),
        },
      }
    );
    todosResource.addMethod(
      'DELETE',
      new apigateway.LambdaIntegration(deleteTodo)
    );

    // 6. Add Resources /todos/${todoId}
    const todoResource = todosResource.addResource('{todoId}');

    todoResource.addMethod('PUT', new apigateway.LambdaIntegration(updateTodo));

    todosTable.grantReadWriteData(updateTodo);
  }
}
