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

exports.update = (id, judul, isi, gambar, category_id) => {
    if (gambar) {
        // Jika ada gambar baru
        return pool.query(
            'UPDATE posts SET judul=$1, isi=$2, gambar=$3, category_id=$4 WHERE id=$5',
            [judul, isi, gambar, category_id, id] // Sekarang pas 5 parameter!
        );
    } else {
        // Jika TIDAK ada gambar baru (gambar tetap pakai yang lama)
        // Tapi category_id TETAP harus diupdate di sini
        return pool.query(
            'UPDATE posts SET judul=$1, isi=$2, category_id=$3 WHERE id=$4',
            [judul, isi, category_id, id] // Pas 4 parameter
        );
    }
};

exports.remove = (id) => {
    return pool.query('DELETE FROM posts WHERE id=$1', [id]);
};