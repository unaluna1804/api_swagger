const pool = require('../config/db');

exports.getAll = () =>
  pool.query(`
    SELECT posts.*, categories.nama AS category_nama
    FROM posts
    LEFT JOIN categories ON posts.category_id = categories.id
    ORDER BY posts.id DESC
  `);

exports.getById = (id) => {
    return pool.query('SELECT * FROM posts WHERE id = $1', [id]);
};

exports.create = (judul, isi, gambar, category_id) => {
  return pool.query(
    "INSERT INTO posts(judul, isi, gambar, category_id) VALUES($1,$2,$3,$4) RETURNING *",
    [judul, isi, gambar, category_id]
  );
};

exports.update = (id, judul, isi, gambar) => {
    if (gambar) {
        return pool.query(
            'UPDATE posts SET judul=$1, isi=$2, gambar=$3 WHERE id=$4',
            [judul, isi, gambar, id]
        );
    }
    return pool.query(
        'UPDATE posts SET judul=$1, isi=$2 WHERE id=$3',
        [judul, isi, id]
    );
};

exports.remove = (id) => {
    return pool.query('DELETE FROM posts WHERE id=$1', [id]);
};