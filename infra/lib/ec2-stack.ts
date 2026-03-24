import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface EC2StackProps extends cdk.StackProps {
  instanceName: string;
}

export class EC2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EC2StackProps) {
    super(scope, id, props);

    // VPC (default)
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2, // 2 availability zones
    });

    // Security group
    const sg = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc,
      description: 'Allow SSH access',
      allowAllOutbound: true,
    });
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH');

    // EC2 Instance
    new ec2.Instance(this, 'MyEC2Instance', {
      instanceName: props.instanceName,
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux(), // Amazon Linux 2
      securityGroup: sg,
      keyName: 'KP-CDK', // replace with your key pair name
    });
  }
}
