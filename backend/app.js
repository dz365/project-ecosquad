import cors from "cors";
import express from "express";
const app = express();

import {
  auth,
  InvalidTokenError,
  UnauthorizedError,
} from "express-oauth2-jwt-bearer";

const validateAccessToken = auth({
  audience: "https://ecosquad.com",
  issuerBaseURL: "https://dev-2lc3pcok5cpzon3p.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

app.use(cors());
app.use(validateAccessToken);

app.use((error, request, response, next) => {
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
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
