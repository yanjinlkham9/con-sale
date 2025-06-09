//controller\Cmain.js
// const  = require("../models");
const db = require("../models");
const sequelize = db.sequelize;
const { QueryTypes } = db.Sequelize;

const { Products, Board } = require("../models");
const { Op } = require("sequelize");

// 로그인이 안된 유저 > {isLogin:false}
// 로그인이 된 유저 > {isLogin:true, user:유저}
exports.home = async (req, res) => {
  try {
    const CU = await Products.findAll({
      where: {
        convenienceName: "CU",
      },
    });
    const GS25 = await Products.findAll({
      where: {
        convenienceName: "GS25",
      },
    });
    const ELEVEN = await Products.findAll({
      where: {
        convenienceName: "7ELEVEN",
      },
    });

    const user = req.session.user;

    if (user) {
      res.render("home", {
        name: user.nickname,
        isLogin: true,
        userId: user.userId, // userId 추가
        CU,
        GS25,
        ELEVEN,
      });
    } else {
      res.render("home", {
        isLogin: false,
        CU,
        GS25,
        ELEVEN,
        userId: null, // userId를 null로 전달
      });
    }
  } catch (error) {
    console.error("홈 페이지 로딩 중 오류 발생:", error);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};

exports.getLogin = (req, res) => {
  if (req.session.user) {
    res.render("home", {
      user: req.session.user,
      isLogin: true,
      userId: req.session.user.userId, // userId 추가
    });
  } else {
    res.render("login", { isLogin: false });
  }
};

exports.getRegister = (req, res) => {
  if (req.session.user) {
    res.render("home", {
      user: req.session.user,
      isLogin: true,
      userId: req.session.user.userId, // userId 추가
    });
  } else {
    res.render("register", { isLogin: false });
  }
};

exports.getLogout = (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) throw err;
      res.redirect("/");
    });
  } else {
    res.send(`
      <script>
      alert("세션이 만료되었습니다");
      document.location.href="/";
      </script>
      `);
  }
};

exports.mypage = async (req, res) => {
  const user = req.session.user;
  if (user) {
    let boards = await Board.findAll({
      where: { userId: user.userId },
      order: [["boardDate", "DESC"]],
      attributes: ["boardId", "boardTitle", "boardDate"],
    });

    for (let i = 0; i < boards.length; i++) {
      console.log(boards[i].boardDate);
      boards[i] = {
        boardId: boards[i].boardId,
        boardTitle: boards[i].boardTitle,
        boardDate: boards[i].boardDate.toISOString().split("T")[0],
      };
    }

    res.render("mypage", {
      name: user.nickname,
      userId: user.userId,
      nickname: user.nickname,
      profilePath: user.profilePath,
      isLogin: true,
      boards: boards,
      productReviews: [], // 초기 빈 배열로 전달
    });
    console.log("userID:::", user.userId);
  } else {
    res.send(
      '<script>alert("먼저 로그인 해주세요"); location.href="/login";</script>',
    );
  }
};

exports.getMyComments = async (req, res) => {
  const user = req.session.user;
  if (user) {
    try {
      const comments = await Comment.findAll({
        where: { userId: user.userId },
        include: [
          { model: Products, as: "product", attributes: ["id", "name"] },
        ],
        order: [["createdAt", "DESC"]],
      });

      const formattedComments = comments.map((comment) => ({
        commentId: comment.commentId,
        commentDetail: comment.commentDetail,
        pId: comment.pId,
        userId: comment.userId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        product: {
          id: comment.product.id,
          name: comment.product.name,
        },
      }));

      res.json({ comments: formattedComments });
    } catch (error) {
      console.error("Error fetching user comments:", error);
      res.status(500).json({ message: "Error fetching comments" });
    }
  } else {
    res.status(401).json({ message: "로그인이 필요합니다." });
  }
};

exports.userview = async (req, res) => {
  let user = req.session.user;

  if (user) {
    const updatedUser = await db.User.findOne({
      where: { userId: user.userId }, // where 절 수정
    });

    if (updatedUser) {
      user = {
        userId: updatedUser.userId,
        userPw: updatedUser.hashedPassword,
        nickname: updatedUser.nickname,
        profilePath: updatedUser.profilePath,
      };
      req.session.user = user;
    }

    res.render("userview", {
      name: user.nickname,
      userId: user.userId,
      userPw: user.hashedPassword,
      nickname: user.nickname,
      profilePath: user.profilePath,
      isLogin: true,
    });
    console.log("userID:::", user.userId);
  } else {
    res.send(
      `<script>alert("먼저 로그인 해주세요"); location.href="/login";</script>`,
      { isLogin: false },
    );
  }
};

exports.store = (req, res) => {
  console.log("req.query: ", req.query.query);
  console.log(req.query);
  res.render("store");
};

exports.search = async (req, res) => {
  const rawQuery = req.query.productName?.trim();
  const user = req.session.user;
  const name = user ? user.nickname : null;
  const userId = user ? user.userId : null;

  if (!rawQuery) return res.redirect("/");

  try {
    console.log("req.query>>>>", rawQuery);

    const products = await sequelize.query(
      `SELECT * FROM products WHERE MATCH(name) AGAINST (:query IN NATURAL LANGUAGE MODE)`,
      {
        replacements: { query: rawQuery },
        type: QueryTypes.SELECT,
      },
    );

    res.render("search", {
      isLogin: !!user,
      name,
      userId,
      product: products,
      insertQuery: rawQuery,
      isSearch: products.length > 0,
    });
  } catch (err) {
    console.error("err", err);
    res.status(500).send("서버 오류가 발생했습니다.");
  }
};
