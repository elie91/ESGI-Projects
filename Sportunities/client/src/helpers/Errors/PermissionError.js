class PermissionError extends Error {
  constructor (permission) {
    super("errors.api." + permission);
    this.permission = permission;

    this.name = "PermissionError";

    Error.captureStackTrace && Error.captureStackTrace(this, PermissionError);
  }
}

PermissionError.PERMISSION_IMAGE = "IMAGE";
PermissionError.PERMISSION_GEO = "GEO";

export default PermissionError;
