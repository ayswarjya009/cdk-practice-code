import * as cdk from 'aws-cdk-lib';
import { StorageStack } from '../lib/stacks/storage-stack';

const app = new cdk.App();

new StorageStack(app, 'StorageStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
