// service/productService.js
const { crawlCU } = require("../crawlers/cuCrawlers");
const { crawlSeven } = require("../crawlers/sevenCrawlers");
const { crawlGS25 } = require("../crawlers/gsCrawlers");

const db = require("../models");
const pLimit = require("p-limit"); 

// p-limit를 사용하여 최대 동시 크롤링 수를 제한
const limit = pLimit.default(3); // 3개의 크롤러만 동시에 실행되도록 설정

// 메모리에 저장할 데이터
let productsData = [];
let sentProductIds = [];
let dbProducts = [];

/**
 * 병렬 크롤링 수행 및 DB 데이터 확인
 * 각 크롤러의 오류를 개별적으로 처리
 */
async function crawlProducts() {
  try {
    // 병렬로 크롤링을 수행하며, 각 크롤러의 오류를 개별적으로 처리합니다.
    const [cuProducts, sevenElevenProducts, gs25Products] = await Promise.all([
      limit(() =>
        crawlCU().catch((err) => {
          console.error("CU 크롤링 실패:", err);
          return []; // 실패 시 빈 배열 반환
        }),
      ),
      limit(() =>
        crawlSeven().catch((err) => {
          console.error("Seven Eleven 크롤링 실패:", err);
          return []; // 실패 시 빈 배열 반환
        }),
      ),
      limit(() =>
        crawlGS25().catch((err) => {
          console.error("GS25 크롤링 실패:", err);
          return []; // 실패 시 빈 배열 반환
        }),
      ),
    ]);

    // DB에서 제품 정보 조회
    dbProducts = await db.Products.findAll();

    // 크롤링한 데이터와 DB를 비교하여 중복 여부 및 상태를 갱신
    productsData = [...cuProducts, ...sevenElevenProducts, ...gs25Products].map(
      (product) => {
        const dbProduct = dbProducts.find((p) => p.id === product.id);

        if (dbProduct) {
          return {
            ...product,
            tags: dbProduct.tags,
            sent: true,
            isDuplicate: true,
          };
        } else {
          return {
            ...product,
            tags: [],
            sent: false,
            isDuplicate: false,
          };
        }
      },
    );

    // 이미 DB에 있는 제품들의 ID
    sentProductIds = dbProducts.map((product) => product.id);

    console.log(`📦 크롤링 완료: 총 ${productsData.length}개의 상품 수집`);

    return productsData;
  } catch (err) {
    console.error("❌ 크롤링 중 오류 발생:", err);
    return []; // 다른 오류가 발생하면 빈 배열 반환
  }
}

/**
 * 특정 제품의 태그를 업데이트
 */
async function updateProductTags(productId, tags) {
  const product = await db.Products.findByPk(productId);

  if (!product) {
    throw new Error("해당 ID의 제품을 찾을 수 없습니다.");
  }

  product.tags = tags;
  await product.save();

  return product;
}

/**
 * DB에 제품을 추가(또는 업데이트)하고, 메모리에 저장된 데이터도 동기화
 */
async function sendProductToDB(productId, productData) {
  const existingProduct = await db.Products.findOne({
    where: { id: productId },
  });

  if (existingProduct) {
    // 이미 존재하는 제품인 경우 업데이트
    existingProduct.imageUrl = productData.imageUrl;
    existingProduct.tags = productData.tags;
    await existingProduct.save();

    // productsData 배열도 업데이트
    const updatedProductIndex = productsData.findIndex(
      (p) => p.id === productId,
    );
    if (updatedProductIndex !== -1) {
      productsData[updatedProductIndex].imageUrl = productData.imageUrl;
      productsData[updatedProductIndex].tags = productData.tags;
      productsData[updatedProductIndex].sent = true;
      productsData[updatedProductIndex].isDuplicate = true;
    }

    return existingProduct;
  } else {
    // 새 제품인 경우 삽입
    const newProduct = await db.Products.create({
      id: productData.id, // 크롤링된 ID 사용
      name: productData.name,
      price: productData.price,
      imageUrl: productData.imageUrl,
      convenienceName: productData.convini,
      tags: productData.tags,
    });

    sentProductIds.push(newProduct.id);

    // productsData 배열 업데이트
    const updatedProductIndex = productsData.findIndex(
      (p) => p.id === productId,
    );
    if (updatedProductIndex !== -1) {
      productsData[updatedProductIndex].sent = true;
      productsData[updatedProductIndex].isDuplicate = true;
    }

    return newProduct;
  }
}

/**
 * 특정 제품을 DB 및 메모리에서 삭제
 */
async function deleteProduct(productId) {
  // 메모리에서 제거
  const productIndex = productsData.findIndex((p) => p.id === productId);
  if (productIndex !== -1) {
    productsData.splice(productIndex, 1);
  }

  const product = await db.Products.findByPk(productId);
  if (!product) {
    throw new Error("해당 ID의 제품을 찾을 수 없습니다.");
  }

  await product.destroy();

  // 이미 전송된 목록에서도 제거
  const sentIdIndex = sentProductIds.indexOf(productId);
  if (sentIdIndex !== -1) {
    sentProductIds.splice(sentIdIndex, 1);
  }

  return product;
}

/**
 * 모든 제품을 조회
 */
async function getAllProducts() {
  const products = await db.Products.findAll();
  return products;
}

/**
 * 특정 상품에 댓글 추가
 */
async function addCommentToProduct(pId, userId, commentDetail) {
  // Use commentDetail
  try {
    const newComment = await db.PComment.create({
      commentDetail: commentDetail, // Use commentDetail
      pId: pId,
      userId: userId,
    });
    return newComment;
  } catch (error) {
    throw new Error(`댓글 추가 중 오류 발생: ${error.message}`);
  }
}

/**
 * 특정 상품의 모든 댓글 조회 (작성자 정보 포함)
 */
async function getCommentsForProduct(pId) {
  try {
    const comments = await db.PComment.findAll({
      where: { pId: pId },
      include: [
        {
          model: db.User,
          attributes: ["userId", "username"], // Include user's userId and username (adjust as needed)
          as: "user", // Match the alias in models/index.js
        },
      ],
      order: [["createdAt", "DESC"]], // Display latest comments first
    });
    return comments;
  } catch (error) {
    throw new Error(`상품 댓글 조회 중 오류 발생: ${error.message}`);
  }
}

/**
 * 특정 댓글 삭제
 */
async function deleteComment(commentId) {
  // Use commentId
  try {
    const comment = await db.PComment.findByPk(commentId); // Use commentId
    if (!comment) {
      throw new Error("해당 ID의 댓글을 찾을 수 없습니다.");
    }
    await comment.destroy();
  } catch (error) {
    throw new Error(`댓글 삭제 중 오류 발생: ${error.message}`);
  }
}

module.exports = {
  crawlProducts,
  updateProductTags,
  sendProductToDB,
  deleteProduct,
  getAllProducts,
  addCommentToProduct,
  getCommentsForProduct,
  deleteComment,
};
