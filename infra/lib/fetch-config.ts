import AWS from "aws-sdk";

const regionSource = "us-east-1";
const existingBucketName = "my-unique-cdk-bucket-12345-ayswarjya";
const existingLambdaName = "MyHelloLambda";

async function main() {
  // S3 client
  const s3Client = new AWS.S3({ region: regionSource });
  const versioning = await s3Client.getBucketVersioning({ Bucket: existingBucketName }).promise();

  // Lambda client
  const lambdaClient = new AWS.Lambda({ region: regionSource });
  const lambdaConfig = await lambdaClient
    .getFunctionConfiguration({ FunctionName: existingLambdaName })
    .promise();

  console.log(JSON.stringify({
    s3: {
      versioning: versioning.Status === "Enabled",
    },
    lambda: {
      runtime: lambdaConfig.Runtime,
      handler: lambdaConfig.Handler,
      memorySize: lambdaConfig.MemorySize,
      timeout: lambdaConfig.Timeout,
      environment: lambdaConfig.Environment?.Variables || {},
    },
  }, null, 2));
}

main();
