const Board = function (sequelize, DataTypes) {
  return sequelize.define(
    "board",
    {
      boardId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      boardTitle: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      boardDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      boardDetail: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      boardPicPath: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      boardCategory: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    },
  );
};
module.exports = Board;
