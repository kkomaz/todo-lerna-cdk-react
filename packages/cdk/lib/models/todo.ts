import * as apigateway from '@aws-cdk/aws-apigateway';

export function postTodoModel(api: apigateway.RestApi) {
  return api.addModel('todo-response-model', {
    contentType: 'application/json',
    modelName: 'todoResponseModel',
    schema: {
      schema: apigateway.JsonSchemaVersion.DRAFT4,
      title: 'Todo',
      type: apigateway.JsonSchemaType.OBJECT,
      properties: {
        description: { type: apigateway.JsonSchemaType.STRING },
      },
      required: ['description'],
    },
  });
}
