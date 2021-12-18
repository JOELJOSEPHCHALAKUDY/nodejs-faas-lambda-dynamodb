export default {
  LeadsTable: {
    Type: "AWS::DynamoDB::Table",
    DeletionPolicy: "Retain",
    Properties: {
      TableName: "${self:provider.environment.LEADS_TABLE}",
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "email", AttributeType: "S" },
        { AttributeName: "phone", AttributeType: "S" },
      ],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      ProvisionedThroughput: {
        ReadCapacityUnits: "${self:custom.table_throughput}",
        WriteCapacityUnits: "${self:custom.table_throughput}",
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: "emai_index",
          KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
          Projection: {
            // attributes to project into the index
            ProjectionType: "ALL", // (ALL | KEYS_ONLY | INCLUDE)
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: "${self:custom.table_throughput}",
            WriteCapacityUnits: "${self:custom.table_throughput}",
          },
        },
        {
          IndexName: "phone_index",
          KeySchema: [{ AttributeName: "phone", KeyType: "HASH" }],
          Projection: {
            // attributes to project into the index
            ProjectionType: "ALL", // (ALL | KEYS_ONLY | INCLUDE)
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: "${self:custom.table_throughput}",
            WriteCapacityUnits: "${self:custom.table_throughput}",
          },
        },
      ],
    },
  },
  InterestsTable: {
    Type: "AWS::DynamoDB::Table",
    DeletionPolicy: "Retain",
    Properties: {
      TableName: "${self:provider.environment.INTERESTS_TABLE}",
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "leadId", AttributeType: "S" },
      ],
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" },
        { AttributeName: "leadId", KeyType: "RANGE" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: "${self:custom.table_throughput}",
        WriteCapacityUnits: "${self:custom.table_throughput}",
      },
      GlobalSecondaryIndexes: [
        {
          IndexName: "lead_index",
          KeySchema: [{ AttributeName: "leadId", KeyType: "HASH" }],
          Projection: {
            // attributes to project into the index
            ProjectionType: "ALL", // (ALL | KEYS_ONLY | INCLUDE)
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: "${self:custom.table_throughput}",
            WriteCapacityUnits: "${self:custom.table_throughput}",
          },
        },
      ],
    },
  },
};
