"use strict";

const BaseExceptionHandler = use("BaseExceptionHandler");

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { response }) {
    switch (error.code) {
      case "ER_NO_DEFAULT_FOR_FIELD":
        return response.badRequest({ message: error.sqlMessage });
      case "ER_DUP_ENTRY":
        return response.badRequest({ message: error.sqlMessage });
      case "E_JWT_TOKEN_EXPIRED":
        return response.unauthorized({ message: "JWT Token Expired" });
      case "E_USER_NOT_FOUND":
        return response.notFound({ message: "Invalid Email" });
      case "E_PASSWORD_MISMATCH":
        return response.unauthorized({ message: "Invalid Password" });
      case "ER_DATA_TOO_LONG":
        return response.internalServerError({ message: error.sqlMessage });
      case "UNAUTHORIZED":
        return response.unauthorized({ message: "Unauthorized" });
      case "E_INVALID_JWT_TOKEN":
        return response.unauthorized({ message: error.message });
      case "ER_NO_REFERENCED_ROW_2":
        return response.internalServerError({ message: error.sqlMessage });
      case "NO_PRODUCT":
        return response.internalServerError({ message: "Depleted stock" });
      case "E_ROUTE_NOT_FOUND":
        return response.internalServerError({ message: "Route not found" });
      case "NOT_COVERED":
        return response.serviceUnavailable({
          message: "Your location is not covered by this store",
        });
      case "E_VALIDATION_FAILED":
        return response.badRequest({
          [error.messages[0].field]: error.messages[0].message,
        });
      default:
        return response.internalServerError({
          message: "Internal Server error",
        });
    }
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  // async report(error, { request }) {}
}

module.exports = ExceptionHandler;
