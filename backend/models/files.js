import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { Post } from "./posts.js";

export const File = sequelize.define("File", {
  fileMetadata: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

File.belongsTo(Post);
Post.hasMany(File);
