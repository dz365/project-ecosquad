import {
  InvalidTokenError,
  UnauthorizedError,
} from "express-oauth2-jwt-bearer";

export const authError = (error, request, response, next) => {
  let message = "Internal Server Error";
  let status = 500;

  if (error instanceof InvalidTokenError) {
    message = "Bad credentials";
    status = error.status;
  } else if (error instanceof UnauthorizedError) {
    message = "Requires authentication";
    status = error.status;
  }
  return response.status(status).json({ error: message });
};
