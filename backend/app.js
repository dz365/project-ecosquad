import cors from "cors";
import express from "express";
import { sequelize } from "./datasource.js";
import bodyParser from "body-parser";
import { usersRouter } from "./routers/users_router.js";
import { postsRouter } from "./routers/posts_router.js";
import { authError } from "./middleware/auth_error.js";
import { fileRouter } from "./routers/file_router.js";
import http from "http";
import { socket } from "./socket.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(authError);

await sequelize.authenticate();
await sequelize.sync({ alter: { drop: false } });

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/files", fileRouter);

const server = http.createServer(app);
socket(server);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
