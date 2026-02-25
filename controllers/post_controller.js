const Post = require('../models/post');
const response = require('../utils/response');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // Tambahan
const minioClient = require('../config/minio'); // Tambahan
const { v4: uuidv4 } = require('uuid'); // Tambahan

// ================= GET ALL =================
exports.getAll = async (req, res) => {
    const data = await Post.getAll();
    const result = data.rows.map(item => ({
        ...item,
        gambar_url: item.gambar ? `http://localhost:9000/posts/${item.gambar}` : null
    }));
    response.success(res, result);
};

// ================= GET BY ID =================
exports.getById = async (req, res) => {
    const data = await Post.getById(req.params.id);
    const item = data.rows[0];
    if(item?.gambar){
        item.gambar_url = `http://localhost:9000/posts/${item.gambar}`;
    }
    response.success(res, item);
};

// ================= CREATE (Integrasi MinIO) =================
exports.create = async (req, res) => {
    try {
        const { judul, isi, category_id } = req.body;
        let gambarName = null;

        if (req.file) {
            // 1. Proses gambar dengan Sharp
            const resized = await sharp(req.file.buffer)
                .resize(800)
                .jpeg({ quality: 80 })
                .toBuffer();

            gambarName = uuidv4() + '.webp';

            // 2. Upload ke MinIO
            await minioClient.putObject(
                'posts', 
                gambarName, 
                resized, 
                resized.length, 
                { 'Content-Type': 'image/jpeg' }
            );
        }

        // 3. Simpan ke Database (tetap pakai fungsi Post.create kamu)
        const data = await Post.create(judul, isi, gambarName, category_id);
        const result = data.rows[0];

        if (result.gambar) {
            result.gambar_url = `http://localhost:9000/posts/${result.gambar}`;
        }

        response.success(res, result, "Post berhasil dibuat dan disimpan ke MinIO");
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
    const { id } = req.params;
    const { judul, isi, category_id } = req.body; // tambahkan category_id jika perlu
    const gambar = req.file ? req.file.filename : null; 
    // Catatan: Jika update juga ingin ke MinIO, logikanya harus disamakan dengan Create

    await Post.update(id, judul, isi, gambar, category_id);
    response.success(res, null, 'Post berhasil diupdate');
};

// ================= DELETE =================
exports.remove = async (req, res) => {
    const { id } = req.params;
    const post = await Post.getById(id);

    // Jika ingin hapus di MinIO juga gunakan minioClient.removeObject
    await Post.remove(id);
    response.success(res, null, 'Post berhasil dihapus');
};