import TokenError from "./TokenError";

class TokenExpiredError extends TokenError {
  constructor (errors) {
    super("errors.api.token.expired");

    this.errors = errors;
    this.name = "TokenExpiredError";

    Error.captureStackTrace && Error.captureStackTrace(this, TokenExpiredError);
  }
}

export default TokenExpiredError;
