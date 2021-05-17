import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class DbManager extends cdk.Construct {
  private _todosTable: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this._todosTable = new dynamodb.Table(this, 'TodosTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: {
        name: 'todoId',
        type: dynamodb.AttributeType.STRING,
      },
      tableName: 'todos',
    });
  }

  get todosTable(): dynamodb.Table {
    return this._todosTable;
  }
}
