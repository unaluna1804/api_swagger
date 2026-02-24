const pool = require('../config/db');

exports.getAll = () => {
  return pool.query('SELECT * FROM categories ORDER BY id DESC');
};

exports.getById = (id) => {
  return pool.query('SELECT * FROM categories WHERE id = $1', [id]);
};

exports.create = (nama) => {
  return pool.query(
    'INSERT INTO categories(nama) VALUES($1) RETURNING *',
    [nama]
  );
};

exports.update = (id, nama) => {
  return pool.query(
    'UPDATE categories SET nama=$1 WHERE id=$2 RETURNING *',
    [nama, id]
  );
};

exports.remove = (id) => {
  return pool.query(
    'DELETE FROM categories WHERE id=$1',
    [id]
  );
};