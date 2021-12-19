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
import requestConstraints from "../../constraints/lead/update.constraint.json";

// Enums
import { StatusCode } from "../../enums/status-code.enum";
import { ResponseMessage } from "../../enums/response-message.enum";

/***
 * Updates to-do list and insert into database
 *
 * @api {post} /list/update
 * @apiName Update to-do list
 * @apiGroup Lead
 * @apiDescription Update lead
 *
 * @apiParam {string}           leadId        The id of the lead
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
 *       "leadId": "468c8094-a756-4000-a919-974a64b5be8e",
 *       "email": "joel2@mailinator.com",
 *       "phone": "+919809198160",
 *       "firstName":"Joel",
 *        "lastName":"Joseph"
 *    }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {},
 *       "message": "Lead successfully updated"
 *       "status": "success"
 *     }
 *      *
 *  @apiErrorExample {json} Error-Response: Validation Errors
 *     HTTP/1.1 400 Bad Request
 *    {
 *      "data": {
 *          "validation": {
 *              "leadId": [
 *                  "lead Id can't be blank"
 *              ]
 *              "email": [
 *                  "Email can't be blank"
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
export const updateLead: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  // Initialize response variable
  let response;

  // Parse request parameters
  const requestData = event.body ? JSON.parse(event.body) : event;

  // Initialise database service
  const databaseService = new DatabaseService();

  // Destructure environmental variable
  const { LEADS_TABLE } = process.env;

  // Destructure request data
  const { leadId, email, phone, firstName, lastName } = requestData;

  return Promise.all([
    // Validate against constraints
    validateAgainstConstraints(requestData, requestConstraints),
    // Item exists
    databaseService.getItem({ key: leadId, tableName: LEADS_TABLE }),
  ])
    .then(async () => {
      // Initialise DynamoDB UPDATE parameters
      const params = {
        TableName: LEADS_TABLE,
        Key: {
          id: leadId,
        },
        UpdateExpression:
          "set #email = :email, phone = :phone,fist_name = :firstName, lastName = :lastName, updatedAt = :date",
        ExpressionAttributeNames: {
          "#email": "email",
        },
        ExpressionAttributeValues: {
          ":email": email,
          ":phone": phone,
          ":firstName": firstName,
          ":lastName": lastName,
          ":date": new Date().getTime(),
        },
        ReturnValues: "UPDATED_NEW",
      };
      // Updates Item in DynamoDB table
      return await databaseService.update(params);
    })
    .then((results) => {
      // Set Success Response
      response = new ResponseModel(
        { ...results.Attributes },
        StatusCode.OK,
        ResponseMessage.UPDATE_LEAD_SUCCESS
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
              ResponseMessage.UPDATE_LEAD_FAIL
            );
    })
    .then(() => {
      // Return API Response
      return response.generate();
    });
};
