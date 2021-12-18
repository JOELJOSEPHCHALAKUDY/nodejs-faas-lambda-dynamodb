import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";

// Models
import LeadModel from "../../models/lead.model";
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
 * Create lead and insert into database
 *
 * @api {post} /lead/create
 * @apiName Create lead
 * @apiGroup lead
 * @apiDescription Create lead
 *
 * @apiParam {string}           email          The email id of the lead
 * @apiParam {string}           phone          The phone number of the lead
 * @apiParam {string}           firstName     The first name of the lead
 * @apiParam {string}           lastName      The last name of the lead
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
 *      "lastName":"Joseph"
 *    }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": { "leadId": "468c8094-a756-4000-a919-974a64b5be8e" },
 *       "message": "Lead successfully created"
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
export const createLead: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(async () => {
      // Initialise database service
      const databaseService = new DatabaseService();

      // Initialise and hydrate model
      const leadModel = new LeadModel(requestData);

      // Get model data
      const data = leadModel.getEntityMappings();

      // Initialise DynamoDB PUT parameters
      const params = {
        TableName: process.env.LEADS_TABLE,
        IndexName: "emai_phone_index",
        Item: {
          id: data.id,
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        ConditionExpression:
          "attribute_not_exists(#email) AND attribute_not_exists(#phone)",
        ExpressionAttributeNames: {
          "#email": "email",
          "#phone": "phone",
        },
      };

      // check if lead is uneque
      // const unequeCheckParams = {
      //   TableName: process.env.LEADS_TABLE,
      //   ConditionExpression: "#email = :emailval OR #phone = :phoneval",
      //   ExpressionAttributeNames: {
      //     "#email": "email",
      //     "#phone": "phone",
      //   },
      //   ExpressionAttributeValues: {
      //     ":emailval": data.email,
      //     ":phoneval": data.phone,
      //   },
      // };

      // const isLead = await databaseService.query(unequeCheckParams);
      // if (isLead) {
      //   throw new ResponseModel(
      //     {},
      //     409,
      //     `create-error: ${ResponseMessage.CREATE_LEAD_FAIL_DUPLICATE}`
      //   );
      // }
      // Inserts item into DynamoDB table
      await databaseService.create(params);
      return data.id;
    })
    .then((leadId) => {
      // Set Success Response
      response = new ResponseModel(
        { leadId },
        StatusCode.OK,
        ResponseMessage.CREATE_LEAD_SUCCESS
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
              ResponseMessage.CREATE_LEAD_FAIL
            );
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
