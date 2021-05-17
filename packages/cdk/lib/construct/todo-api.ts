import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';

export class TodoApi extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    // 1. Setup Gateway Rest API
    const todoApi = new apigateway.RestApi(this, 'todo-api', {
      restApiName: 'Todo API',
      description: 'This manages the TODO API and routes',
      defaultCorsPreflightOptions: {
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
      },
    });
    // 2. Setup lambda handlers
  }
}
