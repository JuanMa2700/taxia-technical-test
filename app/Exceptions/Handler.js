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
  async handle(error, { request, response }) {
    switch (error.code) {
      case "ER_NO_DEFAULT_FOR_FIELD":
        return response.internalServerError({ message: error.sqlMessage });
      case "ER_DUP_ENTRY":
        return response.internalServerError({ message: error.sqlMessage });
      case "E_JWT_TOKEN_EXPIRED":
        return response.internalServerError({ message: "JWT Token Expired" });
      case "E_USER_NOT_FOUND":
        return response.internalServerError({ message: "Invalid Email" });
      case "E_PASSWORD_MISMATCH":
        return response.internalServerError({ message: "Invalid Password" });
      case "ER_DATA_TOO_LONG":
        return response.internalServerError({ message: error.sqlMessage });
      case "UNAUTHORIZED":
        return response.internalServerError({ message: "Unauthorized" });
      default:
        break;
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
  async report(error, { request }) {}
}

module.exports = ExceptionHandler;
