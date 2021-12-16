export default {
  jwtAuth: {
    handler: "handler.jwtAuth",
  },
  basicAuth: {
    handler: "handler.basicAuth",
  },
  createList: {
    handler: "handler.createLead",
    events: [
      {
        http: {
          method: "POST",
          path: "lead/create",
          authorizer: {
            name: "jwtAuth",
          },
          cors: true,
        },
      },
    ],
  },
  getLeads: {
    handler: "handler.getLeads",
    events: [
      {
        http: {
          method: "get",
          path: "leads",
          authorizer: {
            name: "jwtAuth",
          },
          cors: true,
        },
      },
    ],
  },
  updateLead: {
    handler: "handler.updateLead",
    events: [
      {
        http: {
          method: "POST",
          path: "lead/update",
          authorizer: {
            name: "jwtAuth",
          },
          cors: true,
        },
      },
    ],
  },
  createInterest: {
    handler: "handler.createInterest",
    events: [
      {
        http: {
          method: "POST",
          path: "interest/create",
          authorizer: {
            name: "jwtAuth",
          },
          cors: true,
        },
      },
    ],
  },
  deleteTask: {
    handler: "handler.deleteInterest",
    events: [
      {
        http: {
          method: "POST",
          path: "interest/delete",
          authorizer: {
            name: "jwtAuth",
          },
          cors: true,
        },
      },
    ],
  },
  getTask: {
    handler: "handler.getInterest",
    events: [
      {
        http: {
          method: "POST",
          path: "interest",
          authorizer: {
            name: "jwtAuth",
          },
          cors: true,
        },
      },
    ],
  },
  updateTask: {
    handler: "handler.updateInterest",
    events: [
      {
        http: {
          method: "POST",
          path: "interest/update",
          authorizer: {
            name: "jwtAuth",
          },
          cors: true,
        },
      },
    ],
  },
};
