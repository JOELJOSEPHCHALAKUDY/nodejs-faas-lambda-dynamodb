import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
import { v4 as UUID } from "uuid";

// Models
import LeadFormModel from "../../models/leadForm.model";
import ResponseModel from "../../models/response.model";

// Services
import DatabaseService from "../../services/database.service";

// utils
import { validateAgainstConstraints } from "../../utils/util";

// Define the request constraints
import requestConstraints from "../../constraints/lead/create.constraint.json";

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

/***
 * Submit form and insert leads database
 *
 * @api {post} /form/lead-form
 * @apiName Submit lead form
 * @apiGroup forms
 * @apiDescription submit lead form 
 *
 * @apiParam {string}           email          The email id of the lead
 * @apiParam {string}           phone          The phone number of the lead
 * @apiParam {string}           firstName     The first name of the lead
 * @apiParam {string}           lastName      The last name of the lead
 * @apiParam {string}           message      The message of the lead
 *
 * @apiSuccess {object}         data
 * @apiSuccess {string}         message       The response message
 * @apiSuccess {string}         status        The response status
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *      "email": "joeljosephchalakudy@gmail.com",
 *      "phone": "+919809198160",
 *      "firstName":"Joel",
 *      "lastName":"Joseph",
 *      "message":"Propery sale"
 *    }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": { "leadId": "468c8094-a756-4000-a919-974a64b5be8e" },
 *       "message": "Thank you for contacting us"
 *       "status": "success"
 *     }
 *      *
 *  @apiErrorExample {json} Error-Response: Validation Errors
 *     HTTP/1.1 400 Bad Request
 *    {
 *      "data": {
 *          "validation": {
                "email": [
                    "Email can't be blank"
                ]
            }
 *      },
 *      "message": "required fields are missing",
 *      "status": "bad request"
 *    }
 *
 *  @apiErrorExample {json} Error-Response: Unknown Error
 *     HTTP/1.1 500 Internal Server Error
 *    {
 *      "data": {},
 *      "message": "Unknown error",
 *      "status": "error"
 *    }
 */
export const submitLeadForm: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = event.body ? JSON.parse(event.body) : event;

  // Initialise database service
  const databaseService = new DatabaseService();

  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(async () => {
      // Initialise and hydrate model
      const leadModel = new LeadFormModel(requestData);

      // Get model data
      const data = leadModel.getEntityMappings();

      // Initialise DynamoDB PUT parameters
      const params = {
        TableName: process.env.LEADS_TABLE,
        Item: {
          id: data.id,
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
      };

      // check if lead is uneque
      const unequeEmailCheckParams = {
        TableName: process.env.LEADS_TABLE,
        IndexName: "emai_index",
        KeyConditionExpression: "email = :emailVal",
        ExpressionAttributeValues: {
          ":emailVal": data.email,
        },
      };

      // check if lead is uneque
      const unequePhoneCheckParams = {
        TableName: process.env.LEADS_TABLE,
        IndexName: "phone_index",
        KeyConditionExpression: "phone = :phoneVal",
        ExpressionAttributeValues: {
          ":phoneVal": data.email,
        },
      };

      const isLeadEmail = await databaseService.query(unequeEmailCheckParams);
      const isLeadPhone = await databaseService.query(unequePhoneCheckParams);
      if (isLeadEmail && isLeadEmail.Count > 0) {
        return isLeadEmail.Items[0];
      } else if (isLeadPhone && isLeadPhone.Count > 0) {
        return isLeadPhone.Items[0];
      }
      // Inserts item into DynamoDB table
      await databaseService.create(params);
      return data;
    })
    .then(async (data) => {
      // Initialise DynamoDB PUT parameters
      const params = {
        TableName: process.env.INTERESTS_TABLE,
        Item: {
          id: UUID(),
          leadId: data.id,
          message: data.message,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
      };
      // Inserts item into DynamoDB table
      await databaseService.create(params);
      // Set Success Response
      response = new ResponseModel(
        {},
        StatusCode.OK,
        ResponseMessage.LEAD_FORM_SUCCESS
      );
    })
    .catch((error) => {
      // Set Error Response
      response =
        error instanceof ResponseModel
          ? error
          : new ResponseModel(
              {},
              StatusCode.ERROR,
              ResponseMessage.LEAD_FORM_LEAD_FAIL
            );
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
