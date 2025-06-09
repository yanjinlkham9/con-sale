const { Board, BComment, User } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const showBoard = async (req, res) => {
  try {
    const boardList = await Board.findAll({
      order: [["boardId", "DESC"]],
    });

    return res.render("board", {
      isLogin: !!req.session.user,
      name: req.session.user ? req.session.user.userId : null,
      boardList,
    });
  } catch (error) {
    console.error("showBoard Error:", error);
    return res.status(500).send("서버 에러");
  }
};

const createPost = async (req, res) => {
  try {
    const { boardTitle, boardDetail, boardCategory } = req.body;

    if (!boardCategory) {
      return res.status(400).send("분류가 선택되지 않았습니다.");
    }

    const userId = req.session.user.userId;
    let boardPicPath = null;

    if (req.file) {
      boardPicPath = `/static/uploads/board/${req.file.filename}`;
    }

    await Board.create({
      boardTitle,
      boardDetail,
      boardCategory,
      userId,
      boardPicPath,
    });

    return res.redirect("/board");
  } catch (error) {
    console.error("createPost Error:", error);
    return res.status(500).send("서버 에러");
  }
};

const showWriteForm = (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  return res.render("write", {
    isLogin: true,
    name: req.session.user ? req.session.user.userId : null,
  });
};

const showPost = async (req, res) => {
  try {
    const boardId = req.params.id;

    const post = await Board.findOne({
      where: { boardId },
      include: [{ model: User }],
    });

    if (!post) {
      return res.status(404).send("게시글을 찾을 수 없습니다.");
    }

    const comments = await BComment.findAll({
      where: { boardId },
      order: [["bcId", "ASC"]],
    });

    return res.render("view", {
      isLogin: !!req.session.user,
      name: req.session.user ? req.session.user.userId : null,
      post,
      comments,
    });
  } catch (error) {
    console.error("showPost Error:", error);
    return res.status(500).send("서버 에러");
  }
};

const createComment = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).send("로그인이 필요합니다.");
    }

    const boardId = req.params.id;
    const { bcDetail } = req.body;
    const userId = req.session.user.userId;
    await BComment.create({
      boardId,
      bcDetail,
      userId,
    });
    return res.redirect(`/board/view/${boardId}`);
  } catch (error) {
    console.error("createComment Error:", error);
    return res.status(500).send("서버 에러");
  }
};

const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { bcDetail } = req.body;

    await BComment.update({ bcDetail }, { where: { bcId: id } });

    res.json({ success: true });
  } catch (error) {
    console.error("editComment Error:", error);
    res.json({ success: false });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    await BComment.destroy({
      where: { bcId: id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("deleteComment Error:", error);
    res.json({ success: false });
  }
};

const bcrypt = require("bcrypt");

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!req.session.user) {
      return res
        .status(401)
        .json({ success: false, message: "로그인이 필요합니다." });
    }

    const post = await Board.findOne({ where: { boardId: id } });
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "글을 찾을 수 없습니다." });
    }

    if (req.session.user.userId !== post.userId) {
      return res
        .status(403)
        .json({ success: false, message: "권한이 없습니다." });
    }

    await BComment.destroy({ where: { boardId: id } });
    await Board.destroy({ where: { boardId: id } });

    return res
      .status(200)
      .json({ success: true, message: "글이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("deletePost Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
};

module.exports = {
  createPost,
  showWriteForm,
  showPost,
  createComment,
  editComment,
  deleteComment,
  showBoard,
  deletePost,
};
