const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const response = require('../utils/response');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

exports.register = async (req, res) => {
    try {
        // 1. Ambil role dari body, default 0 kalau gak diisi
        const { email, password, role } = req.body;
        const userRole = role !== undefined ? role : 0; 

        const hash = await argon2.hash(password);
        
        // 2. Pastikan di model User.createUser, kamu juga nambahin parameter role
        await User.createUser(email, hash, userRole); 
        
        response.success(res, null, "User berhasil dibuat");
    } catch (err) {
        response.error(res, "Email sudah terdaftar");
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (user.rows.length === 0)
        return response.error(res, "User tidak ditemukan", 404);

    const userData = user.rows[0];

    const valid = await argon2.verify(userData.password, password);
    if (!valid)
        return response.error(res, "Password salah", 401);

    // 3. Masukkan role ke dalam payload JWT (PENTING!)
    const accessToken = jwt.sign(
        { id: userData.id, role: userData.role }, // Tambah role di sini
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { id: userData.id, role: userData.role }, // Tambah role di sini juga
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    await User.saveRefreshToken(refreshToken, userData.id);

    // 4. Kirim role ke frontend agar bisa disimpan di localStorage
    response.success(res, { 
        accessToken, 
        refreshToken, 
        role: userData.role 
    }, "Login berhasil");
};

exports.refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token)
        return response.error(res, "Token diperlukan", 401);

    const user = await User.findByRefreshToken(token);
    if (user.rows.length === 0)
        return response.error(res, "Token tidak valid", 403);

    jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err)
            return response.error(res, "Token expired", 403);

        // 5. Masukkan role kembali saat refresh token
        const accessToken = jwt.sign(
            { id: decoded.id, role: decoded.role }, 
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        response.success(res, { accessToken }, "Token diperbarui");
    });
};