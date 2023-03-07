import express from "express";
import { sequelize } from "./datasource.js";
import bodyParser from "body-parser";
import { usersRouter } from "./routers/users_router.js";
import { postsRouter } from "./routers/posts_router.js";

const express = require("express");
const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
