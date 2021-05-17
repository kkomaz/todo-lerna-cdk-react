import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs';
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

    const responseModel = todoApi.addModel('todo-response-model', {
      contentType: 'application/json',
      modelName: 'todoResponseModel',
      schema: {
        schema: apigateway.JsonSchemaVersion.DRAFT4,
        title: 'pollResponse',
        type: apigateway.JsonSchemaType.OBJECT,
        properties: {
          state: { type: apigateway.JsonSchemaType.STRING },
          greeting: { type: apigateway.JsonSchemaType.STRING },
        },
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

    // 4. Allow read and write data
    todosTable.grantReadData(getTodos);
    todosTable.grantReadWriteData(createTodo);

    // 5. Add Resources
    todosResource.addMethod('GET', new apigateway.LambdaIntegration(getTodos));
    todosResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(createTodo)
    );
  }
}
