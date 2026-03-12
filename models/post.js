const pool = require('../config/db');

// --- FITUR POST ---
exports.getAll = (limit, offset, search = '') => {
  const searchTerm = `%${search}%`;
  return pool.query(`
    SELECT posts.*, categories.nama AS category_nama
    FROM posts
    LEFT JOIN categories ON posts.category_id = categories.id
    WHERE posts.judul ILIKE $3 OR posts.isi ILIKE $3
    ORDER BY posts.id DESC
    LIMIT $1 OFFSET $2
  `, [limit, offset, searchTerm]);
};

exports.countAll = (search = '') => {
  const searchTerm = `%${search}%`;
  return pool.query(
    'SELECT COUNT(*) FROM posts WHERE judul ILIKE $1 OR isi ILIKE $1', 
    [searchTerm]
  );
};

exports.getById = (id) => {
  return pool.query(`
    SELECT posts.*, categories.nama AS category_nama 
    FROM posts 
    LEFT JOIN categories ON posts.category_id = categories.id 
    WHERE posts.id = $1
  `, [id]);
};

exports.create = (judul, isi, gambar, category_id) => {
  return pool.query(
    "INSERT INTO posts(judul, isi, gambar, category_id, created_at) VALUES($1, $2, $3, $4, NOW()) RETURNING *",
    [judul, isi, gambar, category_id]
  );
};

exports.update = (id, judul, isi, gambar, category_id) => {
    if (gambar) {
        return pool.query(
            'UPDATE posts SET judul=$1, isi=$2, gambar=$3, category_id=$4 WHERE id=$5',
            [judul, isi, gambar, category_id, id]
        );
    } else {
        return pool.query(
            'UPDATE posts SET judul=$1, isi=$2, category_id=$3 WHERE id=$4',
            [judul, isi, category_id, id]
        );
    }
};

exports.remove = (id) => {
    return pool.query('DELETE FROM posts WHERE id=$1', [id]);
};
