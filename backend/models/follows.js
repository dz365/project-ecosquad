import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";

export const Follow = sequelize.define("Follow", {
  following: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Follow.belongsTo(User);
User.hasMany(Follow);
