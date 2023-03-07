import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { Post } from "./posts.js";

export const Tag = sequelize.define("Tag", {
  tagName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Tag.belongsTo(Post);
Post.hasMany(Tag);
