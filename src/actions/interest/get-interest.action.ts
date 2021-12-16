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
import requestConstraints from "../../constraints/interest/get.constraint.json";

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

/***
 * Get interest
 *
 * @api {post} /interest
 * @apiName Get interest
 * @apiGroup Lead
 * @apiDescription Get task
 *
 * @apiParam {string}         leadId         The id of the lead
 * @apiParam {string}         interestId         The id of the interest
 *
 * @apiSuccess {object} data
 * @apiSuccess {string} message       The response message
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "leadId": "e784e0cb-ce5f-4ce5-8b9f-8fb243d332cf",
 *       "interestId": "468c8094-a756-4000-a919-974a64b5be8e",
 *    }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *           leadId: '3e790b70-d27c-49db-9fc4-b07d7e636c2e',
 *           message: 'Buy property',
 *           createdAt: 1609773184678,
 *           id: 'f17cfcee-a636-4a94-a6d4-818c86a6a450',
 *           updatedAt: 1609773184678
 *       },
 *       "message": "Task successfully retrieved"
 *       "status": "success"
 *     }
 *      *
 *  @apiErrorExample {json} Error-Response: Validation Errors
 *     HTTP/1.1 400 Bad Request
 *    {
 *      "data": {
 *          "validation": {
                "interestId": [
                    "Interest Id can't be blank"
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
export const getInterest: APIGatewayProxyHandler = async (
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
  const { interestId, leadId } = requestData;

  // Destructure process.env
  const { INTERESTS_TABLE } = process.env;

  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(() => {
      // Get item from the DynamoDB table
      // if it exists
      return databaseService.getItem({
        key: interestId,
        hash: "leadId",
        hashValue: leadId,
        tableName: INTERESTS_TABLE,
      });
    })
    .then((data) => {
      // Set Success Response
      response = new ResponseModel(
        { ...data.Item },
        StatusCode.OK,
        ResponseMessage.GET_INTEREST_SUCCESS
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
              ResponseMessage.GET_INTEREST_FAIL
            );
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
