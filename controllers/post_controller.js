const Post = require('../models/post');
const response = require('../utils/response');
const sharp = require('sharp');
const minioClient = require('../config/minio');
const { v4: uuidv4 } = require('uuid');

const BASE_URL = "http://localhost:9000/posts"; 

// ================= GET ALL (DENGAN PAGINATION) =================
exports.getAll = async (req, res) => {
    try {
        // 1. Tangkap parameter dari URL query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const offset = (page - 1) * limit;

        // 2. Ambil data limit DAN total count secara paralel agar lebih cepat
        const [data, totalCountResult] = await Promise.all([
            Post.getAll(limit, offset),
            Post.countAll() // Memanggil fungsi count untuk total data asli
        ]);

        // 3. Mapping URL gambar
        const result = data.rows.map(item => ({
            ...item,
            gambar: item.gambar ? `${BASE_URL}/${item.gambar}` : null
        }));

        // 4. Hitung total halaman berdasarkan total data asli di database
        const totalItems = parseInt(totalCountResult.rows[0].count); 
        const totalPages = Math.ceil(totalItems / limit) || 1;

        // Return dalam bentuk object terstruktur untuk Frontend
        res.status(200).json({
            status: "success",
            data: result,
            current_page: page,
            last_page: totalPages,
            total_items: totalItems
        });
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
            return res.status(404).json({ status: "error", message: "Post tidak ditemukan" });
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
            return res.status(400).json({ status: "error", message: "Judul, isi, dan category_id wajib diisi" });
        }
        let gambarName = null;
        if (req.file) {
            const resized = await sharp(req.file.buffer).resize({ width: 800 }).webp({ quality: 80 }).toBuffer();
            gambarName = uuidv4() + ".webp";
            await minioClient.putObject("posts", gambarName, resized, resized.length, { "Content-Type": "image/webp" });
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
        const oldData = await Post.getById(id);
        if (oldData.rows.length === 0) {
            return res.status(404).json({ status: "error", message: "Post tidak ditemukan" });
        }
        let gambarName = oldData.rows[0].gambar; 
        if (req.file) {
            const resized = await sharp(req.file.buffer).resize({ width: 800 }).webp({ quality: 80 }).toBuffer();
            gambarName = uuidv4() + ".webp";
            await minioClient.putObject("posts", gambarName, resized, resized.length, { "Content-Type": "image/webp" });
            if (oldData.rows[0].gambar) {
                await minioClient.removeObject("posts", oldData.rows[0].gambar);
            }
        }
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
            return res.status(404).json({ status: "error", message: "Post tidak ditemukan" });
        }
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