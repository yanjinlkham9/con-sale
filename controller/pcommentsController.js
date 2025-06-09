// controllers/pcommentsController.js

const { PComment, Products, User } = require("../models");

// 댓글 조회
exports.getComments = async (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    return res.status(400).json({ message: "productId가 필요합니다." });
  }

  try {
    const comments = await PComment.findAll({
      where: { pId: productId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["userId", "nickname"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyComments = async (req, res) => {
  // Assuming userId is stored in req.session.user.userId
  const userId = req.session.user.userId;

  try {
    const myComments = await PComment.findAll({
      where: { userId },
      include: [
        {
          model: Products,
          as: "product",
          attributes: ["id", "name"], // <-- Corrected here
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ comments: myComments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 댓글 생성
exports.createComment = async (req, res) => {
  const { pId, commentDetail, userId } = req.body;

  try {
    // 제품 존재 여부 확인
    const product = await Products.findByPk(pId);
    if (!product) {
      return res.status(404).json({ message: "제품을 찾을 수 없습니다." });
    }

    // 사용자 존재 여부 확인
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 댓글 생성
    const comment = await PComment.create({ pId, commentDetail, userId });

    // 새로 생성된 댓글을 반환 (사용자 정보 포함)
    const newComment = await PComment.findByPk(comment.commentId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["userId", "nickname"],
        },
      ],
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { commentDetail } = req.body;

  try {
    const comment = await PComment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자만 수정 가능하도록 추가 검증 필요 (예: req.session.user.userId === comment.userId)
    // 여기서는 단순히 수정

    comment.commentDetail = commentDetail;
    comment.updatedAt = new Date();
    await comment.save();

    // 수정된 댓글 반환
    const updatedComment = await PComment.findByPk(comment.commentId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["userId", "nickname"],
        },
      ],
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await PComment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자만 삭제 가능하도록 추가 검증 필요 (예: req.session.user.userId === comment.userId)
    // 여기서는 단순히 삭제

    await comment.destroy();
    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
