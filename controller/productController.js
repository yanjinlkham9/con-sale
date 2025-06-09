// controllers/productController.js
const productService = require("../services/productService");

/**
 * 비밀번호 입력 폼 렌더링
 */
const renderCrawlForm = (req, res) => {
  res.render("crawlForm", { error: null });
};

/**
 * 크롤링 시작
 */
const startCrawl = async (req, res) => {
  const { password } = req.body;

  // 비밀번호 검증 (예시: '123456'으로 설정)
  const VALID_PASSWORD = "123456"; // 실제 애플리케이션에서는 환경 변수이나 안전한 저장소 사용 권장

  if (password !== VALID_PASSWORD) {
    return res
      .status(401)
      .render("crawlForm", { error: "비밀번호가 올바르지 않습니다." });
  }

  try {
    console.log("크롤링 작업 시작...");

    // 크롤링 작업 시작
    const products = await productService.crawlProducts();

    console.log(`\n총 수집된 제품 수: ${products.length}`);

    // 크롤링 완료 후 상품 페이지 렌더링
    res.render("index", { products });
  } catch (error) {
    console.error("크롤링 작업 중 오류 발생:", error);
    res
      .status(500)
      .render("crawlForm", { error: "크롤링 작업 중 오류가 발생했습니다." });
  }
};

/**
 * 태그 업데이트
 */
const updateProductTags = async (req, res) => {
  const productId = req.params.productId;
  const { tags } = req.body;

  try {
    await productService.updateProductTags(productId, tags);
    console.log(`DB 태그 업데이트 성공, productId=${productId}`);
    res.json({ success: true });
  } catch (error) {
    console.error("DB 태그 업데이트 오류:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "태그 업데이트 중 오류가 발생했습니다.",
    });
  }
};

/**
 * DB에 제품 삽입/업데이트
 */
const sendProductToDB = async (req, res) => {
  const productId = req.params.productId;
  const product = req.body;

  if (!product) {
    return res
      .status(400)
      .json({ success: false, error: "제품 정보를 찾을 수 없습니다." });
  }

  try {
    await productService.sendProductToDB(productId, product);
    res.json({ success: true });
  } catch (error) {
    console.error("DB 전송 중 오류 발생:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "DB 전송 중 오류가 발생했습니다.",
    });
  }
};

/**
 * DB에서 제품 삭제
 */
const deleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    await productService.deleteProduct(productId);
    res.json({ success: true });
  } catch (error) {
    console.error("DB 삭제 오류:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "DB 삭제 중 오류가 발생했습니다.",
    });
  }
};

/**
 * 모든 제품 조회
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json({ success: true, products });
  } catch (error) {
    console.error("DB 전체 제품 조회 오류:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "DB 조회 중 오류가 발생했습니다.",
    });
  }
};

/**
 * 특정 상품에 댓글 추가
 */
const addCommentToProduct = async (req, res) => {
  const { productId } = req.params;
  const { commentDetail } = req.body;

  // **User Authentication Placeholder**
  // In a real application, you would get the userId from the authenticated user (e.g., from req.user)
  // For this example, let's assume you have middleware that sets req.userId after authentication
  if (!req.userId) {
    return res
      .status(401)
      .json({ success: false, error: "User not authenticated." });
  }
  const userId = req.userId;

  try {
    const newComment = await productService.addCommentToProduct(
      productId,
      userId,
      commentDetail,
    );
    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    console.error("댓글 추가 오류:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "댓글 추가 중 오류가 발생했습니다.",
    });
  }
};

/**
 * 특정 상품의 모든 댓글 조회
 */
const getCommentsForProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const comments = await productService.getCommentsForProduct(productId);
    res.json({ success: true, comments });
  } catch (error) {
    console.error("상품 댓글 조회 오류:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "상품 댓글 조회 중 오류가 발생했습니다.",
    });
  }
};

/**
 * 특정 댓글 삭제
 */
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  // **Authorization Placeholder**
  // In a real application, you would check if the user is authorized to delete the comment
  // (e.g., if they are the author or an admin)

  try {
    await productService.deleteComment(commentId);
    res.json({ success: true });
  } catch (error) {
    console.error("댓글 삭제 오류:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "댓글 삭제 중 오류가 발생했습니다.",
    });
  }
};

module.exports = {
  renderCrawlForm, // 새로 추가된 함수
  startCrawl, // 새로 추가된 함수
  // 기존 함수들...
  // crawlProducts, // 기존에 있던 함수는 이제 사용되지 않을 수 있음
  updateProductTags,
  sendProductToDB,
  deleteProduct,
  getAllProducts,
  addCommentToProduct,
  getCommentsForProduct,
  deleteComment,
};
