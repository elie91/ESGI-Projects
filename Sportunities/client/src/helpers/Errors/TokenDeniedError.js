import TokenError from "./TokenError";

class TokenDeniedError extends TokenError {
  constructor (errors) {
    super("errors.api.token.denied");

    this.errors = errors;

    this.name = "TokenDeniedError";

    Error.captureStackTrace && Error.captureStackTrace(this, TokenDeniedError);
  }
}

export default TokenDeniedError;
