import HttpStatusCode from "./httpStatusCode.js"; // ваш enum

interface HttpErrorMeta {
  status: HttpStatusCode;
  i18nKey: string;
}

const httpResponseMap: Record<string, HttpErrorMeta> = {
  BAD_REQUEST: {
    status: HttpStatusCode.BadRequest,
    i18nKey: "Invalid data provided",
  },
  WORKLOG_NOT_FOUND: {
    status: HttpStatusCode.NotFound,
    i18nKey: "Nothing found",
  },
  INSUFFICIENT_PERMISSIONS: {
    status: HttpStatusCode.Forbidden,
    i18nKey: "Access denied",
  },
  CONFLICT: {
    status: HttpStatusCode.Conflict,
    i18nKey: "A user with this email already exists",
  },
  INTERNAL_SERVER_ERROR: {
    status: HttpStatusCode.InternalServerError,
    i18nKey: "An error occurred on the server",
  },
  UNAUTHORIZED: {
    status: HttpStatusCode.Unauthorized,
    i18nKey: "Authorization required",
  },
  FORBIDDEN: {
    status: HttpStatusCode.Forbidden,
    i18nKey: "Access denied",
  },
};

export default httpResponseMap;
