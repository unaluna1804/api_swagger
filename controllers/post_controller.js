const Post = require('../models/post');
const response = require('../utils/response');
const sharp = require('sharp');
const minioClient = require('../config/minio');
const { v4: uuidv4 } = require('uuid');

const BASE_URL = "http://localhost:9000/posts"; // bisa pindah ke .env nanti

// ================= GET ALL =================
exports.getAll = async (req, res) => {
    try {
        const data = await Post.getAll();

        const result = data.rows.map(item => ({
            ...item,
            gambar: item.gambar ? `${BASE_URL}/${item.gambar}` : null
        }));

        response.success(res, result);
    } catch (error) {
        console.error("GET ALL ERROR:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ================= GET BY ID =================
exports.getById = async (req, res) => {
    try {
        const data = await Post.getById(req.params.id);
        const item = data.rows[0];

        if (!item) {
            return res.status(404).json({
                status: "error",
                message: "Post tidak ditemukan"
            });
        }

        item.gambar = item.gambar ? `${BASE_URL}/${item.gambar}` : null;

        response.success(res, item);
    } catch (error) {
        console.error("GET BY ID ERROR:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ================= CREATE =================
exports.create = async (req, res) => {
    try {
        const { judul, isi, category_id } = req.body;

        if (!judul || !isi || !category_id) {
            return res.status(400).json({
                status: "error",
                message: "Judul, isi, dan category_id wajib diisi"
            });
        }

        let gambarName = null;

        if (req.file) {
            const resized = await sharp(req.file.buffer)
                .resize({ width: 800 })
                .webp({ quality: 80 })
                .toBuffer();

            gambarName = uuidv4() + ".webp";

            await minioClient.putObject(
                "posts",
                gambarName,
                resized,
                resized.length,
                { "Content-Type": "image/webp" }
            );
        }

        const data = await Post.create(judul, isi, gambarName, category_id);
        const result = data.rows[0];

        result.gambar = result.gambar ? `${BASE_URL}/${result.gambar}` : null;

        response.success(res, result, "Post berhasil dibuat");
    } catch (error) {
        console.error("CREATE ERROR:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ================= UPDATE =================
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, isi, category_id } = req.body;

        // 1. Ambil data lama dulu buat dapetin nama gambar lama
        const oldData = await Post.getById(id);
        if (oldData.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Post tidak ditemukan" });
        }
        
        // Gunakan gambar lama sebagai default
        let gambarName = oldData.rows[0].gambar; 

        // 2. Jika ada file baru, baru kita proses & ganti nama gambarnya
        if (req.file) {
            const resized = await sharp(req.file.buffer)
                .resize({ width: 800 })
                .webp({ quality: 80 })
                .toBuffer();

            gambarName = uuidv4() + ".webp";

            await minioClient.putObject(
                "posts",
                gambarName,
                resized,
                resized.length,
                { "Content-Type": "image/webp" }
            );
            
            // Opsional: Hapus gambar lama dari MinIO biar gak nyampah
            if (oldData.rows[0].gambar) {
                await minioClient.removeObject("posts", oldData.rows[0].gambar);
            }
        }

        // 3. Kirim ke model. Pastikan category_id di-convert ke Number/Int
        await Post.update(id, judul, isi, gambarName, Number(category_id));

        response.success(res, null, "Post berhasil diupdate");
    } catch (error) {
        console.error("UPDATE ERROR:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};
// ================= DELETE =================
exports.remove = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.getById(id);
        const item = post.rows[0];

        if (!item) {
            return res.status(404).json({
                status: "error",
                message: "Post tidak ditemukan"
            });
        }

        // Hapus file di MinIO kalau ada
        if (item.gambar) {
            await minioClient.removeObject("posts", item.gambar);
        }

        await Post.remove(id);

        response.success(res, null, "Post berhasil dihapus");
    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};