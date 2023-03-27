import { Router } from "express";
import multer from "multer";
import { Post } from "../models/posts.js";
import { File } from "../models/files.js";
import { validateAccessToken } from "../middleware/auth.js";
import { searchIndex } from "../meilisearch.js";
import { reverseGeoSearch } from "../reverseGeosearch.js";
import { emitNewPostMessage } from "../socket.js";

export const postsRouter = Router();
//postsRouter.use(validateAccessToken);

const postFiles = multer({ dest: "./posts" });

// create a new post
postsRouter.post("/", postFiles.array("files"), async (req, res) => {
  try {
    const coordinates = JSON.parse(req.body.coordinates);
    const longitude = coordinates[0];
    const latitude = coordinates[1];
    const location = await reverseGeoSearch(longitude, latitude);

    const post = await Post.create({
      description: req.body.description,
      geometry: {
        type: "Point",
        coordinates: coordinates,
      },
      type: req.body.type,
      tags: JSON.parse(req.body.tags),
      UserId: req.body.userId,
      location: location,
    });

    let fileMetadatas = [];

    req.files.forEach((file) => {
      fileMetadatas.push({ metadata: file, PostId: post.id });
    });

    let fileIds = [];

    if (fileMetadatas.length !== 0) {
      await File.bulkCreate(fileMetadatas);
      const files = await File.findAll({
        attributes: ["id"],
        where: {
          PostId: post.id,
        },
      });

      files.forEach((file) => {
        fileIds.push(file.id);
      });
    }

    const newSearchDoc = {
      id: post.id,
      _geo: {
        lat: latitude,
        lng: longitude,
      },
      type: "Feature",
      geometry: post.geometry,
      properties: {
        user: post.UserId,
        description: post.description,
        type: post.type,
        tags: post.tags,
        location: location,
      },
    };

    await searchIndex.addDocuments([newSearchDoc]);

    emitNewPostMessage(post.id, post.geometry.coordinates);

    return res.json({ post, fileIds });
  } catch (e) {
    return res.status(422).json({ error: "Post creation failed." });
  }
});

// get a single post
postsRouter.get("/:id", async (req, res) => {
  const post = await Post.findByPk(+req.params.id);

  if (!post) {
    return res.status(404).json({ error: "Post not found." });
  }

  const files = await File.findAll({
    where: {
      PostId: post.id,
    },
  });

  return res.json({ post, files });
});

// update a specific post
postsRouter.patch("/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  const description = req.body.description;
  const coordinates = req.body.coordinates
    ? JSON.parse(req.body.coordinates)
    : null;
  const type = req.body.type;
  const tags = req.body.tags ? JSON.parse(req.body.tags) : null;
  const update = {};

  if (!post) {
    return res.status(404).json({ error: "Post not found." });
  }

  if (description) update.description = description;
  if (type) update.type = type;
  if (tags) update.tags = tags;
  if (coordinates) {
    update.geometry = { type: "Point", coordinates: coordinates };
    update.location = await reverseGeoSearch(longitude, latitude);
  }

  const files = await File.findAll({
    attributes: ["id"],
    where: {
      PostId: post.id,
    },
  });

  const fileIds = [];

  files.forEach((file) => {
    fileIds.push(file.id);
  });

  await post.update(update);
  await post.reload();

  const updateSearchDoc = {
    id: post.id,
    _geo: {
      lat: post.geometry.coordinates[0],
      lng: post.geometry.coordinates[1],
    },
    geometry: post.geometry,
    properties: {
      user: post.UserId,
      description: post.description,
      type: post.type,
      tags: post.tags,
      location: await reverseGeoSearch(
        post.geometry.coordinates[0],
        post.geometry.coordinates[1]
      ),
    },
  };

  await searchIndex.updateDocuments([updateSearchDoc]);
  return res.json({ post, fileIds });
});

// delete a specific post and all the related tags and files
postsRouter.delete("/:id", async (req, res) => {
  const post = await Post.findByPk(req.params.id);

  if (post) {
    await File.destroy({
      where: {
        PostId: post.id,
      },
    });
    await searchIndex.deleteDocument(post.id);
    await post.destroy();
  } else {
    return res.status(404).json({ error: "Post not found" });
  }

  return res.status(204).end();
});
