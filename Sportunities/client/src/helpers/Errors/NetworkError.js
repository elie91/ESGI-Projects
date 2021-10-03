class NetworkError extends Error {
  constructor (errors) {
    super("errors.api.network");

    this.errors = errors;

    this.name = "NetworkError";

    Error.captureStackTrace && Error.captureStackTrace(this, NetworkError);
  }
}

export default NetworkError;
