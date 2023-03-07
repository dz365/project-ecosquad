import cors from "cors";
import express from "express";
import { sequelize } from "./datasource.js";
import bodyParser from "body-parser";
import { usersRouter } from "./routers/users_router.js";
import { postsRouter } from "./routers/posts_router.js";

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

app.use(bodyParser.json());

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
