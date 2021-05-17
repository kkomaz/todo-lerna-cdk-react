import * as cdk from '@aws-cdk/core';
import { DbManager } from './construct/db-mananger';
import { TodoApi } from './construct/todo-api';
/**
 * ReactShoppeAPI
 */
export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Setup the database
    const dbManager = new DbManager(this, 'DatabaseManager');

    // 1. Initialize the API
    const todoApi = new TodoApi(this, 'TodoEndpoint', {
      todosTable: dbManager.todosTable,
    });
  }
}
