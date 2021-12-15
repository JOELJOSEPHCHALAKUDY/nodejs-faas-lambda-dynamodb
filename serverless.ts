import type { AWS } from '@serverless/typescript';

// DynamoDB
import dynamoDbTables from './resources/dynamodb-tables';

// Functions
import hello from '@functions/hello';

const serverlessConfiguration: AWS = {
  service: 'serverless-isd-app',
  frameworkVersion: '2',
  custom: {
    region: '${opt:region, self:provider.region}',
    stage: '${opt:stage, self:provider.stage}',
    prefix: '${self:service}-${self:custom.stage}',
    list_table: '${self:service}-list-table-${opt:stage, self:provider.stage}',
    tasks_table: '${self:service}-tasks-table-${opt:stage, self:provider.stage}',
    table_throughputs: {
      prod: 5,
      default: 1,
    },
    table_throughput: '${self:custom.table_throughputs.${self:custom.stage}, self:custom.table_throughputs.default}',
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 8008,
        inMemory: true,
        heapInitial: '200m',
        heapMax: '1g',
        migrate: true,
        seed: true,
        convertEmptyValues: true,
        // Uncomment only if you already have a DynamoDB running locally
        // noStart: true
      }
    },
    ['serverless-offline']: {
      httpPort: 3000,
      babelOptions: {
        presets: ["env"]
      }
    },
    profile: {
      prod: 'prodAccount',
      dev: 'devAccount'
    },
  },
  plugins: [
    'serverless-bundle',
    'serverless-dynamodb-local',
    'serverless-offline',
    'serverless-dotenv-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      REGION: '${self:custom.region}',
      STAGE: '${self:custom.stage}',
      LEADS_TABLE: '${self:custom.leads}',
      INTERESTS_TABLE: '${self:custom.interests}',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:DescribeTable',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem'
        ],
        Resource: [
          {"Fn::GetAtt": [ 'LeadsTable', 'Arn' ]},
          {"Fn::GetAtt": [ 'InterestsTable', 'Arn' ]}
        ]
      }
    ],
    profile: '${self:custom.profile.${self:custom.stage}}',
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { hello },
  package: { individually: true },
  resources: {
    Resources: dynamoDbTables,
  }
};

module.exports = serverlessConfiguration;
