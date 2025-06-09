// models/PComment.js

const PComment = (sequelize, DataTypes) => {
  const Pcomments = sequelize.define(
    "Pcomments", // 테이블 이름 (복수형 권장)
    {
      commentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // 자동 증가
      },
      commentDetail: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      pId: {
        type: DataTypes.STRING, // 변경: INTEGER
        allowNull: false,
        references: {
          model: "Products", // 변경: 참조 모델 이름
          key: "id",
        },
        onDelete: "CASCADE", // 제품 삭제 시 관련 댓글도 삭제
      },
      userId: {
        type: DataTypes.STRING(20), // User 모델의 userId 타입과 일치
        allowNull: false,
        references: {
          model: "user", // 참조할 모델 이름 (대소문자 정확히)
          key: "userId",
        },
        onDelete: "CASCADE", // 사용자 삭제 시 관련 댓글도 삭제
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      freezeTableName: true, // 테이블 이름 고정
      timestamps: true, // createdAt, updatedAt 자동 관리
    },
  );

  Pcomments.associate = (models) => {
    // 댓글은 하나의 제품에 속함
    Pcomments.belongsTo(models.Products, {
      // 변경: Products로 변경
      foreignKey: "pId",
      as: "product",
    });

    // 댓글은 하나의 사용자에 속함
    Pcomments.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Pcomments;
};

module.exports = PComment;
