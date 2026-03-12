const Post = require('../models/post');
const response = require('../utils/response');
const sharp = require('sharp');
const minioClient = require('../config/minio');
const { v4: uuidv4 } = require('uuid');

const BASE_URL = "http://localhost:9000/posts"; 

// --- CONTROLLER POST ---
exports.getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const search = req.query.search || ''; 
        const offset = (page - 1) * limit;

        const [data, totalCountResult] = await Promise.all([
            Post.getAll(limit, offset, search),
            Post.countAll(search) 
        ]);

        const result = data.rows.map(item => ({
            ...item,
            gambar: item.gambar ? `${BASE_URL}/${item.gambar}` : null
        }));

        const totalItems = parseInt(totalCountResult.rows[0].count); 

        res.status(200).json({
            status: "success",
            data: result,
            current_page: page,
            total_items: totalItems
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const data = await Post.getById(req.params.id);
        const item = data.rows[0];
        if (!item) return res.status(404).json({ status: "error", message: "Post tidak ditemukan" });
        
        item.gambar = item.gambar ? `${BASE_URL}/${item.gambar}` : null;
        response.success(res, item);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { judul, isi, category_id } = req.body;
        let gambarName = null;
        
        if (req.file) {
            const resized = await sharp(req.file.buffer).resize({ width: 800 }).webp({ quality: 80 }).toBuffer();
            gambarName = uuidv4() + ".webp";
            await minioClient.putObject("posts", gambarName, resized, resized.length, { "Content-Type": "image/webp" });
        }

        const data = await Post.create(judul, isi, gambarName, category_id);
        response.success(res, data.rows[0], "Post berhasil dibuat");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { judul, isi, category_id } = req.body;
        const oldData = await Post.getById(id);
        
        if (oldData.rows.length === 0) return res.status(404).json({ status: "error", message: "Post tidak ditemukan" });

        let gambarName = oldData.rows[0].gambar; 
        if (req.file) {
            const resized = await sharp(req.file.buffer).resize({ width: 800 }).webp({ quality: 80 }).toBuffer();
            gambarName = uuidv4() + ".webp";
            await minioClient.putObject("posts", gambarName, resized, resized.length, { "Content-Type": "image/webp" });
            if (oldData.rows[0].gambar) await minioClient.removeObject("posts", oldData.rows[0].gambar).catch(() => {});
        }

        await Post.update(id, judul, isi, gambarName, Number(category_id));
        response.success(res, null, "Post berhasil diupdate");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.getById(id);
        if (post.rows.length === 0) return res.status(404).json({ message: "Post tidak ditemukan" });

        if (post.rows[0].gambar) await minioClient.removeObject("posts", post.rows[0].gambar);
        await Post.remove(id);
        response.success(res, null, "Post berhasil dihapus");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// --- CONTROLLER KOMENTAR ---
exports.getCommentsByPostId = async (req, res) => {
    try {
        const result = await Post.getCommentsByPostId(req.params.id);
        // Langsung pakai res.status, nggak usah pakai helper response.success
        return res.status(200).json({ status: "success", data: result.rows });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const post_id = req.params.id;
        const { content } = req.body;
        
        // Ambil ID dari middleware authenticateToken
        // Pastikan di token kamu nyimpennya 'id'. Kalau nyimpennya 'user_id', ganti jadi req.user.user_id
        if (!req.user || !req.user.id) {
            return res.status(401).json({ status: "error", message: "User tidak teridentifikasi dari token" });
        }
        
        const user_id = req.user.id; 

        if (!content) {
            return res.status(400).json({ status: "error", message: "Komentar tidak boleh kosong" });
        }

        const result = await Post.createComment(post_id, user_id, content);
        return res.status(201).json({ status: "success", data: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

// --- CONTROLLER RATING ---
exports.addRating = async (req, res) => {
    try {
        const post_id = req.params.id;
        const { score } = req.body;
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({ status: "error", message: "User tidak teridentifikasi dari token" });
        }
        
        const user_id = req.user.id; 

        if (!score) {
            return res.status(400).json({ status: "error", message: "Score wajib diisi" });
        }

        const result = await Post.createRating(post_id, user_id, score);
        return res.status(201).json({ status: "success", data: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};