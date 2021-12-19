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
          method: "POST",
          path: "lead",
          authorizer: {
            name: "jwtAuth",
          },
          cors: true,
        },
      },
    ],
  },
  listLead: {
    handler: "handler.listLead",
    events: [
      {
        http: {
          method: "POST",
          path: "lead/list",
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
  getInterest: {
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
  submitLeadForm: {
    handler: "handler.submitLeadForm",
    events: [
      {
        http: {
          method: "POST",
          path: "form/lead-form",
          cors: true,
        },
      },
    ],
  },
};
