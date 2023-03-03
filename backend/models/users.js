import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture: {
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
