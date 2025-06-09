const Email = (sequelize, DataTypes) => {
  return sequelize.define(
    "email",
    {
      userEmail: {
        type: DataTypes.STRING(50),
        allowNULL: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    },
  );
};

module.exports = Email;
