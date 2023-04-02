import { Router } from "express";
import { User } from "../models/users.js";
import multer from "multer";
import path from "path";
import { validateAccessToken } from "../middleware/auth.js";
import { reverseGeoSearch } from "../reverseGeosearch.js";
export const usersRouter = Router();

const avatar = multer({ dest: "/usr/src/app/avatars" });

const validCoordinates = (coordinates) => {
  return (
    coordinates &&
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    !Number.isNaN(coordinates[0]) &&
    !Number.isNaN(coordinates[1])
  );
};

// create a new user
usersRouter.post(
  "/",
  validateAccessToken,
  avatar.single("avatar"),
  async (req, res) => {
    try {
      if (!req.body.name || !req.body.email || !req.body.coordinates) {
        return res.status(422).json({ error: "Missing request parameters." });
      }

      const coordinates = JSON.parse(req.body.coordinates);

      if (!validCoordinates(coordinates)) {
        return res
          .status(422)
          .json({ error: "User creation failed. Invalid coordinates." });
      }

      if (req.file && !req.file.mimetype.startsWith("image/")) {
        return res.status(422).json({
          error: "User creation failed. Avatar file type not supported.",
        });
      }

      const preferences = req.body.preferences
        ? JSON.parse(req.body.preferences)
        : null;

      const user = await User.create({
        id: req.auth.payload.sub,
        name: req.body.name,
        email: req.body.email,
        avatarMetadata: req.file,
        about: req.body.about,
        geometry: {
          type: "Point",
          coordinates: coordinates,
        },
        location: await reverseGeoSearch(coordinates[0], coordinates[1]),
        preferences: preferences,
      });
      return res.json(user);
    } catch (e) {
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

// get a specific user's avatar
usersRouter.get("/:id/avatar", async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  if (!user.avatarMetadata) {
    return res.status(404).json({ error: "User does not have an avatar" });
  }

  res.setHeader("Content-Type", user.avatarMetadata.mimetype);
  res.sendFile(user.avatarMetadata.path, { root: path.resolve("/") });
});

// update a specific user's profile
usersRouter.patch(
  "/:id",
  validateAccessToken,
  avatar.single("avatar"),
  async (req, res) => {
    if (req.auth.payload.sub !== req.params.id) {
      return res
        .status(403)
        .json({ error: "User profile update unauthorized." });
    }

    const user = await User.findByPk(req.params.id);
    const name = req.body.name;
    const avatarMetadata = req.file;
    const about = req.body.about;
    const coordinates = req.body.coordinates
      ? JSON.parse(req.body.coordinates)
      : null;

    const preferences = req.body.preferences
      ? JSON.parse(req.body.preferences)
      : null;
    const update = {};

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (name) update.name = name;
    if (about) update.about = about;
    if (avatarMetadata) {
      if (avatarMetadata.mimetype.startsWith("image/")) {
        update.avatarMetadata = avatarMetadata;
      } else {
        return res.status(422).json({
          error: "User update failed. Avatar file type not supported.",
        });
      }
    }

    if (coordinates) {
      if (!validCoordinates(coordinates)) {
        return res
          .status(422)
          .json({ error: "User update failed. Invalid coordinates." });
      }

      update.geometry = {
        type: "Point",
        coordinates: coordinates,
      };
      update.location = await reverseGeoSearch(coordinates[0], coordinates[1]);
    }

    if (preferences) update.preferences = preferences;

    await user.update(update);
    await user.reload();
    return res.json(user);
  }
);

// delete a specific user
usersRouter.delete("/:id", validateAccessToken, async (req, res) => {
  if (req.auth.payload.sub !== req.params.id) {
    return res.status(403).json({ error: "User deletion unauthorized." });
  }

  const user = await User.findByPk(req.params.id);

  if (user) {
    await user.destroy();
  } else {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(204).end();
});
