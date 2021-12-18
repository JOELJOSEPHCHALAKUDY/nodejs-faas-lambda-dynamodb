import { Context, APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";

// Models
import ResponseModel from "../../models/response.model";

// Services
import DatabaseService from "../../services/database.service";

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

/***
 * Get lead list
 *
 * @api {post} /lead-list
 * @apiName Get lead list
 * @apiGroup Leads 
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
 *          "phone": '+656888777'
 *        },
 *       "message": "Lead successfully retrieved"
 *       "status": "success"
 *     }
 *      *

 *  @apiErrorExample {json} Error-Response: Unknown Error
 *     HTTP/1.1 500 Internal Server Error
 *    {
 *      "data": {},
 *      "message": "Unknown error",
 *      "status": "error"
 *    }
 */
export async function listLead(
  _context: Context
): Promise<APIGatewayProxyResult> {
  // Initialize response variable
  let response;

  // Initialise database service
  const databaseService = new DatabaseService();

  // Destructure process.env
  const { LEADS_TABLE } = process.env;

  // Validate against constraints
  return databaseService
    .scan({ TableName: LEADS_TABLE, ScanIndexForward: true })
    .then(async (data) => {
      // Set Success Response with data
      response = new ResponseModel(
        {
          ...data,
        },
        StatusCode.OK,
        ResponseMessage.GET_LEAD_LIST_SUCCESS
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
              ResponseMessage.GET_LEAD_LIST_FAIL
            );
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
}
