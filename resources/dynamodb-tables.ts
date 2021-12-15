export default {
    LeadsTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
            TableName: '${self:provider.environment.leads}',
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S' }
            ],
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: '${self:custom.table_throughput}',
                WriteCapacityUnits: '${self:custom.table_throughput}'
            }
        }
    },
    InterestsTable: {
        Type: 'AWS::DynamoDB::Table',
        DeletionPolicy: 'Retain',
        Properties: {
            TableName: '${self:provider.environment.interests}',
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S' },
                { AttributeName: 'Id', AttributeType: 'S' }
            ],
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' },
                { AttributeName: 'lead_id', KeyType: 'RANGE' }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: '${self:custom.table_throughput}',
                WriteCapacityUnits: '${self:custom.table_throughput}'
            },
            GlobalSecondaryIndexes: [
                {
                    IndexName: 'lead_index',
                    KeySchema: [
                        { AttributeName: 'lead_id', KeyType: 'HASH' },
                    ],
                    Projection: { // attributes to project into the index
                        ProjectionType: 'ALL' // (ALL | KEYS_ONLY | INCLUDE)
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: '${self:custom.table_throughput}',
                        WriteCapacityUnits: '${self:custom.table_throughput}'
                    },
                }
            ]
        }
    }
}
