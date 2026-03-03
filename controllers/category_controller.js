const Category = require('../models/category');

exports.getAll = async (req, res) => {
  try {
    const data = await Category.getAll();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Category.getById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const { nama } = req.body;
    const data = await Category.create(nama);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const { nama } = req.body;
    const data = await Category.update(req.params.id, nama);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.remove = async (req, res) => {
  try {
    await Category.remove(req.params.id);
    res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};