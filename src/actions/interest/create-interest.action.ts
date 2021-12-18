import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";

// Models
import InterestModel from "../../models/interest.model";
import ResponseModel from "../../models/response.model";

// Services
import DatabaseService from "../../services/database.service";

// utils
import { validateAgainstConstraints } from "../../utils/util";

// Define the request constraints
import requestConstraints from "../../constraints/interest/create.constraint.json";

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

/***
 * Adds interest to lead
 *
 * @api {post} /interest/create
 * @apiName Create interest
 * @apiGroup Leads
 * @apiDescription Create interest on lead
 *
 * @apiParam {string}        leadId              The id of the lead
 * @apiParam {string}        message         The message of the interest
 *
 * @apiSuccess {object} data
 * @apiSuccess {string} message       The response message
 * @apiSuccess {string} status        The response status
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *      "leadId": "468c8094-a756-4000-a919-974a64b5be8e",
 *      "message": "plot",
 *    }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": { },
 *       "message": "Interest successfully added"
 *       "status": "success"
 *     }
 *      *
 *  @apiErrorExample {json} Error-Response: Validation Errors
 *     HTTP/1.1 400 Bad Request
 *    {
 *      "data": {
 *          "validation": {
                "leadId": [
                    "Lead Id can't be blank"
                ],
                "message": [
                    "Message can't be blank"
                ],
            }
 *      },
 *      "message": "required fields are missing",
 *      "status": "bad request"
 *    }
 *
 *  @apiErrorExample {json} Error-Response: Invalid Lead Id
 *     HTTP/1.1 500 Internal Server Error
 *    {
 *      "data": {
 *          "id": "468c8094-a756-4000-a919-example"
 *      },
 *      "message": "Item does not exist",
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
export const createInterest: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Initialise database service
  const databaseService = new DatabaseService();

  return Promise.all([
    // Validate against constraints
    validateAgainstConstraints(requestData, requestConstraints),
    // Get item from the DynamoDB table
    databaseService.getItem({
      key: requestData.leadId,
      tableName: process.env.LEADS_TABLE,
    }),
  ])
    .then(async () => {
      // Initialise and hydrate model
      const interestModel = new InterestModel(requestData);

      // Get model data
      const data = interestModel.getEntityMappings();

      // Initialise DynamoDB PUT parameters
      const params = {
        TableName: process.env.INTERESTS_TABLE,
        Item: {
          id: data.id,
          leadId: data.leadId,
          message: data.message,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
      };
      // Inserts item into DynamoDB table
      await databaseService.create(params);
      return data.id;
    })
    .then((taskId) => {
      // Set Success Response
      response = new ResponseModel(
        { taskId },
        StatusCode.OK,
        ResponseMessage.CREATE_INTEREST_SUCCESS
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
              ResponseMessage.CREATE_INTEREST_FAIL
            );
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
