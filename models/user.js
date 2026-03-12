const pool = require('../config/db');

// 1. Tambahkan parameter 'role' di sini
exports.createUser = (email, password, role) => {
    return pool.query(
        'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
        [email, password, role] // $3 adalah role (0 atau 1)
    );
};

exports.findByEmail = (email) => {
    return pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
};

exports.saveRefreshToken = (token, id) => {
    return pool.query(
        'UPDATE users SET refresh_token = $1 WHERE id = $2',
        [token, id]
    );
};

exports.findByRefreshToken = (token) => {
    return pool.query(
        'SELECT * FROM users WHERE refresh_token = $1',
        [token]
    );
};