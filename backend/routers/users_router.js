import { Router } from "express";
import { User } from "../models/users.js";
import { Follow } from "../models/follows.js";
import multer from "multer";
import path from "path";
import { validateAccessToken } from "../middleware/auth.js";

export const usersRouter = Router();

const avatar = multer({ dest: "./pictures/avatars/" });

// create a new user
usersRouter.post(
  "/",
  validateAccessToken,
  avatar.single("avatar"),
  async (req, res) => {
    try {
      const user = await User.create({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        avatarMetadata: req.file,
        about: req.body.about,
        privateProfile: req.body.privateProfile,
      });
      return res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(422).json({ error: "User creation failed." });
    }
  }
);

// get a specific user's profile
usersRouter.get("/:id", validateAccessToken, async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.json(user);
});

usersRouter.get("/:id/avatar", async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  if (!user.avatarMetadata) {
    return res.status(404).json({ error: "User does not have an avatar" });
  }
  res.setHeader("Content-Type", user.avatarMetadata.mimetype);
  res.sendFile(user.avatarMetadata.path, { root: path.resolve() });
});

// update a specific user's profile (except their profile picture)
usersRouter.patch(
  "/:id",
  validateAccessToken,
  avatar.single("avatar"),
  async (req, res) => {
    const user = await User.findByPk(req.params.id);
    const name = req.body.name;
    const avatarMetadata = req.file;
    const about = req.body.about;
    const privateProfile = req.body.privateProfile;
    const update = {};

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (name) update.name = name;
    if (avatarMetadata) update.avatarMetadata = avatarMetadata;
    if (about) update.about = about;
    if (privateProfile) update.privateProfile = privateProfile;

    await user.update(update);
    await user.reload();
    return res.json(user);
  }
);

// delete a specific user
usersRouter.delete("/:id", validateAccessToken, async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (user) {
    await user.destroy();
  } else {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(204).end();
});

// user follows another user
usersRouter.post("/:id/follows", validateAccessToken, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  const following = await User.findByPk(req.body.followingId);

  if (user.id === following.id) {
    return res.status(422).json({ error: "Cannot follow yourself." });
  }

  if (!user || !following) {
    return res.status(404).json({ error: "User(s) not found." });
  }

  await Follow.findOrCreate({
    where: {
      UserId: req.params.id,
      following: req.body.followingId,
    },
  });

  return res.status(204).end();
});

// user unfollows another user
usersRouter.post("/:id/unfollows", validateAccessToken, async (req, res) => {
  const userId = req.params.id;
  const followingId = req.body.followingId;
  const follow = await Follow.findOne({
    where: {
      UserId: userId,
      following: followingId,
    },
  });

  if (follow) {
    await follow.destroy();
  } else {
    return res.status(404).json({ error: "User(s) not found." });
  }

  return res.status(204).end();
});
