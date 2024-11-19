export type Props = {
  env_file: string
  target_container: string
  image: string
  task_definition_file: string
}

interface TaskDefinition {
  taskDefinitionArn: string
  containerDefinitions: ContainerDefinition[]
  family: string
  executionRoleArn: string
  networkMode: string
  revision: number
  volumes: any[]
  status: string
  requiresAttributes: RequiresAttribute[]
  placementConstraints: any[]
  compatibilities: string[]
  requiresCompatibilities: string[]
  cpu: string
  memory: string
  registeredAt: string
  registeredBy: string
  tags: any[]
}

interface ContainerDefinition {
  name: string
  image: string
  cpu: number
  portMappings: PortMapping[]
  essential: boolean
  environment: EnvironmentVariable[]
  mountPoints: any[]
  volumesFrom: any[]
  logConfiguration: LogConfiguration
  systemControls: any[]
}

interface PortMapping {
  containerPort: number
  hostPort: number
  protocol: string
}

interface EnvironmentVariable {
  name: string
  value: string
}

interface LogConfiguration {
  logDriver: string
  options: LogOptions
}

interface LogOptions {
  'awslogs-group': string
  'awslogs-region': string
  'awslogs-stream-prefix': string
}

interface RequiresAttribute {
  name: string
}
