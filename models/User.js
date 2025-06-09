const User = function (sequelize, DataTypes) {
  return sequelize.define(
    "user",
    {
      userId: {
        type: DataTypes.STRING(20),
        primaryKey: true,
      },
      hashedPassword: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      profilePath: {
        type: DataTypes.STRING(70),
        allowNull: true,
        defaultValue: "static/image/default-profile.jpg",
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    },
  );
};

module.exports = User;
