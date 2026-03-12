const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");

router.post("/comments", commentController.createComment);
router.get("/posts/:postId/comments", commentController.getCommentsByPost);

module.exports = router;