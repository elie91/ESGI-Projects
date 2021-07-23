class SubmissionError extends Error {
  constructor (errors) {
    super(errors[0].message);

    this.errors = errors;

    this.name = "SubmissionError";

    Error.captureStackTrace && Error.captureStackTrace(this, SubmissionError);
  }
}

export default SubmissionError;
