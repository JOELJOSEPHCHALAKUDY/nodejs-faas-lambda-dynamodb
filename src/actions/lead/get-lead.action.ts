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
import requestConstraints from "../../constraints/lead/id.constraint.json";

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

/***
 * Get lead list
 *
 * @api {post} /lead
 * @apiName Get lead list
 * @apiGroup lead List
 * @apiDescription Get lead list
 *
 * @apiSuccess {object} data
 * @apiSuccess {string} message       The response message
 * @apiSuccess {string} status        The response status
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *      "leadId": "468c8094-a756-4000-a919-974a64b5be8e",
 *    }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": [{
 *          "email": "joel@mailinator.comt",
 *          "createdAt": 1609383835145,
 *          "id": "468c8094-a756-4000-a919-974a64b5be8e",
 *          "updatedAt": 1609468610216,
 *          "interests": [
 *              {
 *                "id": "c1219773-19b5-4228-ba7c-06309a0b00ee",
 *                "message": "To lease office space",
 *              },
 *              {
 *                "id": "e8b92a93-55c9-46d2-a39e-2fc11d314f71",
 *                "message": "Buy a plot",
 *              },
 *              {
 *                "id": "39662ac3-cd1c-4a7a-9b74-c1c6423ce800",
 *                "message": "Rent a house",
 *              },
 *           ]
 *        }],
 *       "message": "Lead list successfully retrieved"
 *       "status": "success"
 *     }
 *      *

 *  @apiErrorExample {json} Error-Response: Unknown Error
 *     HTTP/1.1 500 Internal Server Error
 *    {
 *      "data": [],
 *      "message": "Unknown error",
 *      "status": "error"
 *    }
 */
export const getLeads: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = JSON.parse(event.body);

  // Initialise database service
  const databaseService = new DatabaseService();

  // Destructure process.env
  const { LEADS_TABLE } = process.env;

  // Validate against constraints
  return validateAgainstConstraints(requestData, requestConstraints)
    .then(() => {
      // Get item from the DynamoDB table
      return databaseService.getAllData({ TableName: LEADS_TABLE });
    })
    .then(async (data) => {
      // Initialise DynamoDB QUERY parameters
      // const params = {
      //     TableName: INTERESTS_TABLE,
      //     IndexName : 'lead_index',
      //     KeyConditionExpression : 'leadId = :leadIdVal',
      //     ExpressionAttributeValues : {
      //         ':leadIdVal' : leadId
      //     }

      // };

      // Query table for interest with the leadId
      // const results = await databaseService.query(params);
      // const interests = results?.Items?.map((interest) => {
      //     return {
      //         id: interest.id,
      //         description: interest.message,
      //         createdAt: interest.createdAt,
      //         updatedAt: interest.updatedAt,
      //     }
      // });

      // Set Success Response with data
      response = new ResponseModel(
        {
          data,
          // interestCount: interests?.length,
          // interests: interests,
        },
        StatusCode.OK,
        ResponseMessage.GET_LEAD_SUCCESS
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
              ResponseMessage.GET_LEAD_FAIL
            );
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
