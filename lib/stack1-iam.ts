import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import { Regions } from "./common/regions";

interface IamStackProps extends cdk.StackProps {
  regionEnum: Regions;
}

export class IamStack extends cdk.Stack {
  public readonly ecsTaskRole: iam.Role;

  constructor(scope: Construct, id: string, props: IamStackProps) {
    super(scope, id, props);

    this.ecsTaskRole = new iam.Role(this, "EcsTaskRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      roleName: `ecsTaskRole-${props.regionEnum}`, // ecsTaskRole-us-east-1
    });

    this.ecsTaskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AmazonECSTaskExecutionRolePolicy"
      )
    );
  }
}
