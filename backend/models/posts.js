import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";

export const Post = sequelize.define("Post", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: "",
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: "",
    allowNull: false,
  },
  weather: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  discoveryTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  discoveryType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Post.belongsTo(User);
User.hasMany(Post);
