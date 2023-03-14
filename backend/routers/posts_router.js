import { Router } from "express";
import multer from "multer";
import { Post } from "../models/posts.js";

export const postsRouter = Router();

const postFiles = multer({ dest: "/posts" });

// create a new post
postsRouter.post("/", postFiles.array("files"), async (req, res) => {
  try {
    console.log(req.files);

    const post = await Post.create({
      description: req.body.description,
      longitude: req.body.longitude,
      latitude: req.body.longitude,
      discoveryTime: req.body.discoveryTime,
      type: req.body.type,
      filesMetadata: req.files,
      tags: req.body.tags,
      UserId: req.body.userId,
    });
    return res.json(post);
  } catch (e) {
    console.log(e);
    return res.status(422).json({ error: "Post creation failed." });
  }
});

// get a single post
postsRouter.get("/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (!post) {
    return res.status(404).json({ error: "Post not found." });
  }

  return res.json(post);
});

// update a specific post
postsRouter.patch("/:id", postFiles.array("files"), async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  const description = req.body.description;
  const longitude = req.body.longitude;
  const latitude = req.body.longitude;
  const discoveryTime = req.body.discoveryTime;
  const type = req.body.type;
  const filesMetadata = req.files;
  const tags = req.body.tags;
  const update = {};

  if (!post) {
    return res.status(404).json({ error: "Post not found." });
  }

  if (description) update.description = description;
  if (longitude) update.longitude = longitude;
  if (latitude) update.latitude = latitude;
  if (discoveryTime) update.discoveryTime = discoveryTime;
  if (type) update.type = type;
  if (filesMetadata) update.filesMetadata = filesMetadata;
  if (tags) update.tags = tags;

  await post.update(update);
  await post.reload();
  return res.json(post);
});

// delete a specific post and all the related tags and files
postsRouter.delete("/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (post) {
    await post.destroy();
  } else {
    return res.status(404).json({ error: "Post not found" });
  }

  return res.status(204).end();
});
