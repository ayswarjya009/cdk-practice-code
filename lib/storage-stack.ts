import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

// ✅ Step 1: define custom props interface
export interface StorageStackProps extends cdk.StackProps {
  bucketName: string;
}

export class StorageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: StorageStackProps) {
    super(scope, id, props); // ✅ pass props here

    new s3.Bucket(this, 'MyBucket', {
      bucketName: props.bucketName,   // 👈 dynamic
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
