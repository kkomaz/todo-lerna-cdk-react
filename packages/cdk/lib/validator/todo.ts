import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';

export function postTodoRequestValidator(
  self: cdk.Construct,
  api: apigateway.RestApi
) {
  return new apigateway.RequestValidator(self, 'RequestValidator', {
    validateRequestBody: true,
    validateRequestParameters: true,
    restApi: api,
  });
}
