class TokenError extends Error {
  constructor (errors) {
    super("errors.api.token.error");

    this.errors = errors;
    this.name = "TokenError";

    Error.captureStackTrace && Error.captureStackTrace(this, TokenError);
  }
}

export default TokenError;
