const express = require("express");
const router = express.Router();
const main = require("../controller/CMain.js");
// const product = require("../controller/Cproduct.js");
const user = require("../controller/CUser.js");
const pageController = require("../controller/pageController");
const productController = require("../controller/productController.js");
const upload = require("../utils/multer.js");
const pcommentsController = require("../controller/pcommentsController");
const boardController = require("../controller/Cboard");

// 메인 라우트
router.get("/", main.home);
router.get("/login", main.getLogin);
router.get("/register", main.getRegister);
// 로그아웃
router.get("/logout", main.getLogout);
// 마이페이지
router.get("/mypage", main.mypage);
// 회원정보 수정
router.get("/userview", main.userview);
// 상품검색 페이지
router.get("/search", main.search);
// 이메일 전송
router.post("/email", user.emailSend);
// 회원가입
router.post("/register", user.postRegister);
router.post("/login", user.postLogin);
router.post("/checkDuplication", user.postCheck);
// 회원정보 수정
router.post("/checkNickname", user.postCheckNickname);
router.post("/updateUser", user.postUpdateUser);
// 사진 업로드
router.post("/upload", upload.single("user"), user.upload);
router.get("/upload", (req, res) => {
  res.json({ message: "test" });
});

// 회원탈퇴
router.post("/deleteAccount", user.deleteAccount);

// setUserId 미들웨어 정의
const setUserId = (req, res, next) => {
  if (req.session.user) {
    const userId = req.session.user.userId;
    res.locals.userId = userId;
    console.log(`로그인한 사용자 ID: ${userId}`);
  } else {
    res.locals.userId = null;
    console.log("로그인하지 않은 사용자");
  }
  next();
};

// 로그인 체크 미들웨어 추가
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    // 로그인 상태일 때
    const userId = req.session.user.userId; // 수정: req.session.userId -> req.session.user.userId
    // res.locals에 사용자 ID 저장
    res.locals.userId = userId;

    // 콘솔에 사용자 ID 출력
    console.log(`로그인한 사용자 ID: ${userId}`);

    // 다음 단계로 진행
    next();
  } else {
    // 로그인 상태가 아니면 에러 처리
    res.status(401).json({ message: "로그인이 필요합니다." });
  }
};

router.get("/products/crawl", productController.renderCrawlForm);

// 크롤링을 시작하는 라우터
router.post("/products/crawl/start", productController.startCrawl);

// 모든 제품 조회
router.get("/products", setUserId, productController.getAllProducts);

// DB 전송 API
router.post("/products/:productId/send-db", productController.sendProductToDB);

// DB 삭제 API
router.delete("/products/:productId", productController.deleteProduct);

// 태그 업데이트 API
router.put(
  "/products/:productId/update-tags",
  productController.updateProductTags,
);

// 댓글 관련 라우트: /api/pcomments 하위로 이동
// 댓글 조회: 모든 사용자 접근 가능
router.get("/api/pcomments", pcommentsController.getComments);

// 댓글 생성: 인증된 사용자만 접근 가능
router.post(
  "/api/pcomments",
  isAuthenticated,
  pcommentsController.createComment,
);

router.get(
  "/api/mycomments",
  isAuthenticated, // Ensure the user is authenticated
  pcommentsController.getMyComments,
);

// 댓글 수정: 인증된 사용자만 접근 가능
router.put(
  "/api/pcomments/:commentId",
  isAuthenticated,
  pcommentsController.updateComment,
);

// 댓글 삭제: 인증된 사용자만 접근 가능
router.delete(
  "/api/pcomments/:commentId",
  isAuthenticated,
  pcommentsController.deleteComment,
);

// 기타 페이지
router.get("/about", setUserId, pageController.renderAboutPage);

router.get("/board", boardController.showBoard);
router.get("/board/write", boardController.showWriteForm);

// router.post(
//   "/board/write",
//   upload.single("boardPic"),
//   boardController.createPost,
// );

router.get("/board/view/:id", boardController.showPost);
router.post("/board/view/:id/comment", boardController.createComment);
router.put("/board/comment/:id/edit", boardController.editComment);
router.delete("/board/comment/:id", boardController.deleteComment);
router.delete("/board/view/:id/delete", boardController.deletePost);

module.exports = router;
