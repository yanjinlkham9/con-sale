// models/Products.js

const { DataTypes } = require("sequelize");

const Products = (sequelize) => {
  return sequelize.define(
    "Products",
    {
      // Primary Key
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      // 이름 필드 (기존 pName과 name 통합)
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      // 가격 필드 (기존 Products의 STRING과 aProducts의 INTEGER 통합)
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // 이벤트 필드 (기존 Products에만 존재)
      event: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      // 편의점 이름 필드 (기존 Products의 cName과 aProducts의 convini 통합)
      convenienceName: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      // 이미지 URL 필드 (기존 Products의 imagePath와 aProducts의 imageUrl 통합)
      imageUrl: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      // 태그 필드 (aProducts에서 추가)
      tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      // 생성일 필드 (aProducts에서 추가)
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      // 수정일 필드
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      freezeTableName: true,
      timestamps: true, // createdAt 및 updatedAt 자동 관리
    },
  );
};

module.exports = Products;
