import cors from "cors";
import express from "express";
import { sequelize } from "./datasource.js";
import bodyParser from "body-parser";
import { usersRouter } from "./routers/users_router.js";
import { postsRouter } from "./routers/posts_router.js";
import { authError } from "./middleware/auth_error.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(authError);

await sequelize.authenticate();
await sequelize.sync({ alter: { drop: false } });

app.use("/users", usersRouter);
app.use("/posts", postsRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
