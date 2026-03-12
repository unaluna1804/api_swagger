module.exports = {
  paths: {
    '/posts': {
      get: {
        tags: ['Posts'],
        summary: 'Ambil semua post dengan pagination',
        security: [],
        parameters: [
          {
            name: 'page',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 9 }
          }
        ],
        responses: {
          200: { description: 'Berhasil' }
        }
      },
      post: {
        tags: ['Posts'],
        summary: 'Tambah post',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['judul', 'isi', 'gambar', 'category_id'],
                properties: {
                  judul: { type: 'string' },
                  isi: { type: 'string' },
                  category_id: { type: 'integer' },
                  gambar: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Created' }
        }
      }
    },
    '/posts/{id}': {
      get: {
        tags: ['Posts'],
        summary: 'Ambil detail post berdasarkan ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'ID Postingan'
          }
        ],
        responses: {
          200: { description: 'Berhasil ambil detail' },
          404: { description: 'Post tidak ditemukan' }
        }
      },
      put: {
        tags: ['Posts'],
        summary: 'Update post',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  judul: { type: 'string' },
                  isi: { type: 'string' },
                  category_id: { type: 'integer' },
                  gambar: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Updated' }
        }
      },
      delete: {
        tags: ['Posts'],
        summary: 'Hapus post',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Deleted' }
        }
      }
    },
    '/comments': {
      post: {
        tags: ['Comments'],
        summary: 'Menambahkan komentar baru',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['post_id', 'content', 'score'],
                properties: {
                  post_id: {
                    type: 'integer',
                    description: 'ID post yang dikomentari'
                  },
                  user_id: {
                    type: 'integer',
                    nullable: true,
                    description: 'ID user yang menulis komentar (boleh null)'
                  },
                  content: {
                    type: 'string',
                    description: 'Isi komentar'
                  },
                  score: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 5,
                    description: 'Rating komentar (1-5)'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Komentar berhasil dibuat'
          },
          400: {
            description: 'Input tidak valid'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    },

    '/posts/{postId}/comments': {
      get: {
        tags: ['Comments'],
        summary: 'Mengambil semua komentar berdasarkan ID Post',
        security: [],
        parameters: [
          {
            name: 'postId',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'ID post'
          }
        ],
        responses: {
          200: {
            description: 'Daftar komentar berhasil ditemukan'
          },
          404: {
            description: 'Post tidak ditemukan'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    }
  
  }
};