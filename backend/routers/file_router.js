import { Router } from "express";
import { File } from "../models/files.js";
import path from "path";

export const fileRouter = Router();

fileRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    return res.status(404).json({ error: "file not found." });
  }

  const file = await File.findByPk(id);

  if (!file) {
    return res.status(404).json({ error: "file not found." });
  }

  if (!file.metadata) {
    return res.status(404).json({ error: "file does not have an avatar" });
  }
  res.setHeader("Content-Type", file.metadata.mimetype);
  res.sendFile(file.metadata.path, { root: path.resolve("/") });
});
