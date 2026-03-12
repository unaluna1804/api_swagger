const Comment = require('../models/commentModel');

const createComment = async (req, res) => {
  try {
    const { post_id, user_id, content, score } = req.body;

    // Validasi sederhana untuk skor (sesuai constraint di DB)
    if (score < 1 || score > 5) {
      return res.status(400).json({ message: "Score harus antara 1 sampai 5" });
    }

    const newComment = await Comment.create(post_id, user_id, content, score);
    
    res.status(201).json({
      status: 'success',
      data: newComment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.getByPostId(postId);
    
    res.status(200).json({
      status: 'success',
      results: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getPostComments
};