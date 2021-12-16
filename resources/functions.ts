export default {
  jwtAuth: {
    handler: "handler.jwtAuth",
  },
  basicAuth: {
    handler: "handler.basicAuth",
  },
  createLead: {
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
  getLead: {
    handler: "handler.getLead",
    events: [
      {
        http: {
          method: "GET",
          path: "lead",
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
  deleteInterest: {
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
  getInterest: {
    handler: "handler.getInterest",
    events: [
      {
        http: {
          method: "GET",
          path: "interest",
          authorizer: {
            name: "jwtAuth",
          },
          cors: true,
        },
      },
    ],
  },
  updateInterest: {
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
