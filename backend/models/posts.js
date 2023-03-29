import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";

export const Post = sequelize.define("Post", {
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  geometry: {
    type: DataTypes.GEOMETRY("POINT"),
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
  location_en: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
});

Post.belongsTo(User);
User.hasMany(Post);
