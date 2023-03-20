import { auth } from "express-oauth2-jwt-bearer";

export const validateAccessToken = auth({
  audience: "https://ecosquad.com",
  issuerBaseURL: "https://dev-2lc3pcok5cpzon3p.us.auth0.com/",
  tokenSigningAlg: "RS256",
});
