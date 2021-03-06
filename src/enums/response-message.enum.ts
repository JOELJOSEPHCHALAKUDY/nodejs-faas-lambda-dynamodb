export enum ResponseMessage {
  CREATE_LEAD_SUCCESS = "Lead successfully created",
  CREATE_LEAD_FAIL = "Lead cannot be created",
  CREATE_LEAD_FAIL_DUPLICATE = "Lead cannot be created, as user already exisits",
  GET_LEAD_SUCCESS = "Lead successfully retrieved",
  GET_LEAD_FAIL = "Lead not found",
  GET_LEAD_LIST_SUCCESS = "Lead list successfully retrieved",
  GET_LEAD_LIST_FAIL = "Lead list cannot be retrieved",
  UPDATE_LEAD_SUCCESS = "Lead successfully updated",
  UPDATE_LEAD_FAIL = "Lead cannot be updated",
  GET_INTEREST_SUCCESS = "Interest successfully retrieved",
  GET_INTEREST_FAIL = "Interest not found",
  CREATE_INTEREST_SUCCESS = "Interest successfully added",
  CREATE_INTEREST_FAIL = "Interest could not be added",
  UPDATE_INTEREST_SUCCESS = "Interest successfully updated",
  UPDATE_INTEREST_FAIL = "Interest could not be updated",
  LEAD_FORM_SUCCESS = "Success, Thank you for contacting us",
  LEAD_FORM_LEAD_FAIL = "Someting went wrong",
  ERROR = "Unknown error.",
  INVALID_REQUEST = "Invalid Request!",
  //   GET_ITEM_ERROR = "Item does not exist",
}
