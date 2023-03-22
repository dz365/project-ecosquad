import { Router } from "express";
import { File } from "../models/files.js";
import path from "path";

export const fileRouter = Router();
//postsRouter.use(validateAccessToken);

fileRouter.get("/:id", async (req, res) => {
  const file = await File.findByPk(+req.params.id);

  if (!file) {
    return res.status(404).json({ error: "file not found." });
  }

  if (!file.metadata) {
    return res.status(404).json({ error: "file does not have an avatar" });
  }
  res.setHeader("Content-Type", file.metadata.mimetype);
  res.sendFile(file.metadata.path, { root: path.resolve() });
});
