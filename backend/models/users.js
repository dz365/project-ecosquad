import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  avatarMetadata: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  about: {
    type: DataTypes.STRING,
    defaultValue: "",
    allowNull: false,
  },
  privateProfile: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});
