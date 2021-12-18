import {
  APIGatewayProxyHandler,
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";

// Models
import ResponseModel from "../../models/response.model";

// Services
import DatabaseService from "../../services/database.service";

// utils
import { validateAgainstConstraints } from "../../utils/util";

// Define the request constraints
import requestConstraints from "../../constraints/interest/update.constraint.json";

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

/***
 * Updates interest and insert into database
 *
 * @api {post} /interest/update
 * @apiName Updates interest
 * @apiGroup Leads
 * @apiDescription Update interest
 *
 * @apiParam {string}           leadId               The id of the lead
 * @apiParam {string}           interestId               The interest id
 * @apiParam {string}           description          The interest description
 *
 * @apiSuccess {object}         data
 * @apiSuccess {string}         message       The response message
 * @apiSuccess {string}         status        The response status
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "leadId": "468c8094-a756-4000-a919-974a64b5be8e",
 *       "interestId": "c1219773-19b5-4228-ba7c-06309a0b00ee",
 *       "description": "Clean the apartment",
 *       "completed": true,
 *    }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {},
 *       "message": "Interest successfully updated"
 *       "status": "success"
 *     }
 *      *
 *  @apiErrorExample {json} Error-Response: Validation Errors
 *     HTTP/1.1 400 Bad Request
 *    {
 *      "data": {
 *          "validation": {
 *              "leadId": [
 *                  "List Id can't be blank"
 *              ]
 *              "interestId": [
 *                  "Interest Id can't be blank"
 *              ]
 *              "description": [
 *                  "Description can't be blank"
 *              ]
 *          }
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
export const updateInterest: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Initialise database service
  const databaseService = new DatabaseService();

  // Destructure request data
  const { leadId, interestId, message } = requestData;

  // Destructure process.env
  const { LEADS_TABLE, INTERESTS_TABLE } = process.env;

  return Promise.all([
    // Validate against constraints
    validateAgainstConstraints(requestData, requestConstraints),
    // Get item from the DynamoDB table
    databaseService.getItem({ key: leadId, tableName: LEADS_TABLE }),
  ])
    .then(async () => {
      // Initialise the update-interest-lead expression
      const updateExpression = `set message = :message, updatedAt = :timestamp`;

      // Initialise DynamoDB UPDATE parameters
      const params = {
        TableName: INTERESTS_TABLE,
        Key: {
          id: interestId,
          leadId: leadId,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: {
          ":timestamp": new Date().getTime(),
          ":message": message,
        },
        ReturnValues: "UPDATED_NEW",
      };

      // Updates item in DynamoDB table
      return await databaseService.update(params);

      // Throws error if none of the optional parameters is present
      throw new ResponseModel(
        {},
        StatusCode.BAD_REQUEST,
        ResponseMessage.INVALID_REQUEST
      );
    })
    .then((results) => {
      // Set Success Response
      response = new ResponseModel(
        { ...results.Attributes },
        StatusCode.OK,
        ResponseMessage.UPDATE_INTEREST_SUCCESS
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
              ResponseMessage.UPDATE_INTEREST_FAIL
            );
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
