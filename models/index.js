"use strict";

const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

const User = require("./User")(sequelize, Sequelize.DataTypes);
const Products = require("./Products")(sequelize, Sequelize.DataTypes);
const PComment = require("./PComment")(sequelize, Sequelize.DataTypes);
const BComment = require("./BComment")(sequelize, Sequelize.DataTypes);
const Board = require("./Board")(sequelize, Sequelize.DataTypes);
const Email = require("./Email")(sequelize, Sequelize.DataTypes);

// User <-> Board through BComment (N:M)
User.belongsToMany(Board, {
  through: BComment,
  foreignKey: "userId",
  otherKey: "boardId",
});
Board.belongsToMany(User, {
  through: BComment,
  foreignKey: "boardId",
  otherKey: "userId",
});

// User hasMany Board (1:N)
User.hasMany(Board, {
  foreignKey: "userId",
  sourceKey: "userId",
});
Board.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
});

// Products hasMany PComments
Products.hasMany(PComment, {
  foreignKey: "pId",
  as: "comments",
  onDelete: "CASCADE",
});

// User hasMany PComments
User.hasMany(PComment, {
  foreignKey: "userId",
  as: "comments",
  onDelete: "CASCADE",
});

// PComment belongsTo Products and User
PComment.belongsTo(Products, {
  foreignKey: "pId",
  as: "product",
});
PComment.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

db.User = User;
db.Products = Products;
db.PComment = PComment;
db.BComment = BComment;
db.Board = Board;
db.Email = Email;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
