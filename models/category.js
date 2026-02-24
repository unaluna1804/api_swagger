const db = require('../config/db');

exports.getAll = () => db.query("SELECT * FROM categories ORDER BY id DESC");

exports.getById = (id) =>
  db.query("SELECT * FROM categories WHERE id=$1", [id]);

exports.create = (nama) =>
  db.query("INSERT INTO categories(nama) VALUES($1) RETURNING *", [nama]);

exports.update = (id, nama) =>
  db.query("UPDATE categories SET nama=$1 WHERE id=$2 RETURNING *", [nama, id]);

exports.remove = (id) =>
  db.query("DELETE FROM categories WHERE id=$1", [id]);