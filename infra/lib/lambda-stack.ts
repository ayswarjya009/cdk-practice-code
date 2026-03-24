import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';

export interface LambdaStackProps extends cdk.StackProps {
  functionName: string;
  runtime: lambda.Runtime;
}

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    new lambda.Function(this, 'MyLambdaFunction', {
      functionName: props.functionName,
      runtime: props.runtime,
      handler: 'hello.handler',  // fileName.exportedFunction
      code: lambda.Code.fromAsset('lib/lambda'), // path to your lambda code
      logRetention: logs.RetentionDays.ONE_WEEK,

    });
  }
}
