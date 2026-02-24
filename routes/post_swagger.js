module.exports = {
  paths: {

    // ==========================
    // GET ALL & CREATE POST
    // ==========================
    '/posts': {

      get: {
        tags: ['Posts'],
        summary: 'Ambil semua post',
        security: [],
        responses: {
          200: {
            description: 'Berhasil mengambil data post'
          }
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

                  judul: {
                    type: 'string',
                    example: 'Judul Post'
                  },

                  isi: {
                    type: 'string',
                    example: 'Isi Post'
                  },

                  category_id: {
                    type: 'integer',
                    example: 1
                  },

                  gambar: {
                    type: 'string',
                    format: 'binary'
                  }

                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Post berhasil dibuat'
          }
        }
      }
    },


    // ==========================
    // UPDATE & DELETE POST
    // ==========================
    '/posts/{id}': {

      put: {
        tags: ['Posts'],
        summary: 'Update post',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer'
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {

                  judul: {
                    type: 'string',
                    example: 'Judul baru'
                  },

                  isi: {
                    type: 'string',
                    example: 'Isi baru'
                  },

                  category_id: {
                    type: 'integer',
                    example: 1
                  },

                  gambar: {
                    type: 'string',
                    format: 'binary'
                  }

                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Post berhasil diupdate'
          }
        }
      },

      delete: {
        tags: ['Posts'],
        summary: 'Hapus post',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer'
            }
          }
        ],
        responses: {
          200: {
            description: 'Post berhasil dihapus'
          }
        }
      }

    }

  }
};