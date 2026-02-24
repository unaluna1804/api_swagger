module.exports = {
  tags: [
    {
      name: "Categories",
      description: "Management category untuk post"
    }
  ],

  paths: {

    "/api/categories": {

      get: {
        tags: ["Categories"],
        summary: "Ambil semua category",
        security: [],
        responses: {
          200: { description: "Berhasil mengambil category" }
        }
      },

      post: {
        tags: ["Categories"],
        summary: "Tambah category baru",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nama"],
                properties: {
                  nama: { type: "string", example: "Teknologi" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Category berhasil dibuat" }
        }
      }
    },

    "/api/categories/{id}": {

  put: {
    tags: ["Categories"],
    summary: "Update category",
    description: "Mengubah nama category berdasarkan ID",
    security: [{ bearerAuth: [] }],

    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: {
          type: "integer"
        }
      }
    ],

    requestBody: {   // 🔥 INI YANG KURANG
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              nama: {
                type: "string",
                example: "Category Update"
              }
            }
          }
        }
      }
    },

    responses: {
      200: {
        description: "Category berhasil diupdate"
      }
    }
  },

      delete: {
        tags: ["Categories"],
        summary: "Hapus category",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" }
          }
        ],
        responses: {
          200: { description: "Category berhasil dihapus" }
        }
      }

    }

  }
};