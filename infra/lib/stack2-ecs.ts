import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as iam from "aws-cdk-lib/aws-iam";
import { Regions } from "./common/regions";

interface EcsStackProps extends cdk.StackProps {
  regionEnum: Regions;
  taskRole: iam.Role;
}

export class EcsStack extends cdk.Stack {
  public readonly albDnsName: string;

  constructor(scope: Construct, id: string, props: EcsStackProps) {
    super(scope, id, props);

    // 1️⃣ Create VPC
    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 2,
      natGateways: 1, // private subnets still need NAT for ECS tasks to reach internet
    });

    // 2️⃣ ECS Cluster
    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc,
      clusterName: `cluster-${props.regionEnum}`,
    });

    // 3️⃣ Task Definition
    const taskDef = new ecs.FargateTaskDefinition(this, "TaskDef", {
      cpu: 256,
      memoryLimitMiB: 512,
      taskRole: props.taskRole,
    });

    taskDef.addContainer("AppContainer", {
      image: ecs.ContainerImage.fromRegistry("nginx"), // replace with your app image
      portMappings: [{ containerPort: 80 }],
    });

    // 4️⃣ Fargate Service
    const service = new ecs.FargateService(this, "Service", {
      cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
      assignPublicIp: false, // tasks stay private
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_NAT },
    });

    // 5️⃣ Create Public ALB
    const alb = new elbv2.ApplicationLoadBalancer(this, "ALB", {
      vpc,
      internetFacing: true, // key: public ALB
      loadBalancerName: `ecs-alb-${props.regionEnum}`,
    });

    // 6️⃣ Add listener on port 80
    const listener = alb.addListener("Listener", {
      port: 80,
      open: true, // allow internet access
    });

    // 7️⃣ Attach ECS service to target group
    listener.addTargets("ECS", {
      port: 80,
      targets: [service],
      healthCheck: {
        path: "/", // adjust to your app health endpoint
        interval: cdk.Duration.seconds(30),
      },
    });

    // 8️⃣ Output DNS
    new cdk.CfnOutput(this, "ALBDns", {
      value: alb.loadBalancerDnsName,
      description: "Public DNS for your ECS service",
    });

    this.albDnsName = alb.loadBalancerDnsName;
  }
}
