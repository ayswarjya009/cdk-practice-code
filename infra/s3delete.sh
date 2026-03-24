#!/bin/bash

echo "🔍 Finding CDK bootstrap buckets..."

buckets=$(aws s3 ls | awk '{print $3}' | grep cdk-hnb659fds)

for bucket in $buckets; do
  echo "🗑 Deleting bucket: $bucket"
  
  # Delete all object versions (important)
  aws s3api list-object-versions --bucket $bucket \
    --query '{Objects: Versions[].{Key:Key,VersionId:VersionId}}' \
    --output json > delete.json

  aws s3api delete-objects --bucket $bucket --delete file://delete.json 2>/dev/null

  # Delete remaining objects
  aws s3 rm s3://$bucket --recursive

  # Delete bucket
  aws s3 rb s3://$bucket --force

  echo "✅ Deleted $bucket"
done

echo "🎯 Cleanup completed"
