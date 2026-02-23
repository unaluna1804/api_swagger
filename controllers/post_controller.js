const Post = require('../models/post');
const response = require('../utils/response');
const fs = require('fs');
const path = require('path');


// ================= GET ALL =================
exports.getAll = async (req, res) => {
    const data = await Post.getAll();

    const result = data.rows.map(item => ({
        ...item,
        gambar_url: item.gambar
            ? `http://localhost:3000/images/${item.gambar}`
            : null
    }));

    response.success(res, result);
};


// ================= GET BY ID =================
exports.getById = async (req, res) => {
    const data = await Post.getById(req.params.id);
    const item = data.rows[0];

    if(item?.gambar){
        item.gambar_url = `http://localhost:3000/images/${item.gambar}`;
    }

    response.success(res, item);
};


// ================= CREATE =================
exports.create = async (req, res) => {

    const { judul, isi } = req.body;
    const gambar = req.file ? req.file.filename : null;

    const data = await Post.create(judul, isi, gambar);

    const result = data.rows[0];

    // tambah link gambar
    if(result.gambar){
        result.gambar_url = `http://localhost:3000/images/${result.gambar}`;
    }

    response.success(res, result, 'Post berhasil dibuat');
};


// ================= UPDATE =================
exports.update = async (req, res) => {

    const { id } = req.params;
    const { judul, isi } = req.body;
    const gambar = req.file ? req.file.filename : null;

    await Post.update(id, judul, isi, gambar);

    response.success(res, null, 'Post berhasil diupdate');
};


// ================= DELETE =================
exports.remove = async (req, res) => {

    const { id } = req.params;

    const post = await Post.getById(id);

    // hapus file gambar jika ada
    if (post.rows[0]?.gambar) {

        const filePath = path.join(
            __dirname,
            '../public/images',
            post.rows[0].gambar
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    await Post.remove(id);

    response.success(res, null, 'Post berhasil dihapus');
};