const BComment = function (sequelize, DataTypes) {
  return sequelize.define(
    "bComment",
    {
      bcId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      boardId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      bcDetail: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      bcDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { freezeTableName: true, timestamps: false },
  );
};
module.exports = BComment;
