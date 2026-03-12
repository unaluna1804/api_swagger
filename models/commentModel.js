const pool = require('../config/db'); // Sesuaikan dengan path konfigurasi database Anda

const Comment = {
  // Membuat komentar baru
  create: async (postId, userId, content, score) => {
    const query = `
      INSERT INTO comments (post_id, user_id, content, score)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [postId, userId, content, score];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Mengambil semua komentar untuk post tertentu
  getByPostId: async (postId) => {
    const query = `
      SELECT * FROM comments 
      WHERE post_id = $1 
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [postId]);
    return rows;
  },

  // Menghapus komentar berdasarkan ID
  delete: async (id) => {
    const query = 'DELETE FROM comments WHERE id = $1 RETURNING *;';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
};

module.exports = Comment;