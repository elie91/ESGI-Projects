import TokenError from "./TokenError";

class NotFoundError extends TokenError {
  constructor (errors) {
    super("errors.api.notFound");

    this.errors = errors;

    this.name = "NotFoundError";

    Error.captureStackTrace && Error.captureStackTrace(this, NotFoundError);
  }
}

export default NotFoundError;
