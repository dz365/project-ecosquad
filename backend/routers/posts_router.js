import { Router } from "express";
import multer from "multer";
import { Post } from "../models/posts.js";
import { File } from "../models/files.js";
import { validateAccessToken } from "../middleware/auth.js";
import { searchIndex } from "../meilisearch.js";
import { reverseGeoSearch } from "../reverseGeosearch.js";

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

    const newSearchDoc = [
      {
        id: post.id,
        type: "Feature",
        geometry: post.geometry,
        properties: {
          user: post.UserId,
          description: post.description,
          type: post.type,
          tags: post.tags,
          location: location,
        },
      },
    ];

    await searchIndex.addDocuments(newSearchDoc);

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
    attributes: ["id"],
    where: {
      PostId: post.id,
    },
  });

  let fileIds = [];

  files.forEach((file) => {
    fileIds.push(file.id);
  });

  return res.json({ post, fileIds });
});

// update a specific post
postsRouter.patch("/:id", postFiles.array("files"), async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  const description = req.body.description;
  const coordinates = req.body.coordinates
    ? JSON.parse(req.body.coordinates)
    : null;
  const type = req.body.type;
  const tags = req.body.tags ? JSON.parse(req.body.tags) : null;
  const deletedFileIds = req.body.deletedFiles
    ? JSON.parse(req.body.deletedFiles)
    : null;
  const addedFileMetadatas = req.files;
  const update = {};

  if (!post) {
    return res.status(404).json({ error: "Post not found." });
  }

  if (description) update.description = description;
  if (type) update.type = type;
  if (tags) update.tags = tags;
  if (coordinates) {
    update.geometry = { type: "Point", coordinates: coordinates };
  }

  if (deletedFileIds) {
    await File.destroy({
      where: {
        id: deletedFileIds,
        PostId: post.id,
      },
    });
  }

  if (addedFileMetadatas) {
    let fileMetadatas = [];

    addedFileMetadatas.forEach((file) => {
      fileMetadatas.push({ metadata: file, PostId: post.id });
    });

    await File.bulkCreate(fileMetadatas);
  }

  const files = await File.findAll({
    attributes: ["id"],
    where: {
      PostId: post.id,
    },
  });

  let fileIds = [];

  files.forEach((file) => {
    fileIds.push(file.id);
  });

  await post.update(update);
  await post.reload();
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
