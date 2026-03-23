#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { StorageStack } from '../lib/storage-stack';
import { LambdaStack } from '../lib/lambda-stack';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { EC2Stack } from '../lib/ec2-stack';
import { IamStack } from "../lib/stack1-iam";
import { EcsStack } from "../lib/stack2-ecs";
import { Regions } from "../lib/common/regions";

const app = new cdk.App();

// Single region
const region = Regions.US_EAST_1;

// Stack 1: IAM
const iamStack = new IamStack(app, "IamStack", {
  env: { region },
  regionEnum: region,
});

// Stack 2: ECS (depends on IAM)
new EcsStack(app, "EcsStack", {
  env: { region },
  regionEnum: region,
  taskRole: iamStack.ecsTaskRole,
});

new StorageStack(app, 'StorageStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT!,
    region: process.env.CDK_DEFAULT_REGION!,
  },
  bucketName: 'my-unique-cdk-bucket-12345-ayswarjya', // 👈 passed here
});

new LambdaStack(app, 'LambdaStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT!,
    region: process.env.CDK_DEFAULT_REGION!,
  },
  functionName: 'MyHelloLambda',
  runtime: lambda.Runtime.NODEJS_18_X,
});

// EC2
new EC2Stack(app, 'EC2Stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT!,
    region: process.env.CDK_DEFAULT_REGION!,
  },
  instanceName: 'MyFirstEC2',
});
