import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useCategories, useCreateCategory, useDeleteCategory } from "../hooks/useCategories";

function Categories() {
  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // --- PROTEKSI LOGIN ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const { data: categoriesData, isLoading, isError } = useCategories();
  const createMutation = useCreateCategory();
  const deleteMutation = useDeleteCategory();

  const categories = categoriesData?.data || (Array.isArray(categoriesData) ? categoriesData : []);

  const filteredCategories = categories.filter((cat: any) =>
    cat.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- HANDLE ADD DENGAN VALIDASI & NOTIFIKASI BERHASIL ---
  const handleAdd = () => {
    // 1. Validasi Frontend (Cek input kosong)
    if (!newCategory.trim()) {
      alert("Ups! Nama kategori tidak boleh kosong, ya.");
      return;
    }

    createMutation.mutate(
      { nama: newCategory } as any,
      {
        onSuccess: () => {
          setNewCategory(""); // Kosongkan input
          alert("Kategori berhasil ditambahkan!"); // <-- NOTIFIKASI BERHASIL
        },
        onError: (error: any) => {
          // 2. Read Validation Message dari Server/Swagger
          const serverError = error.response?.data?.message || "Terjadi kesalahan server.";
          alert("Gagal menambah: " + serverError);
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Yakin ingin menghapus kategori ini?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          alert("Kategori berhasil dihapus!");
        },
        onError: (error: any) => {
          const serverError = error.response?.data?.message || "Gagal menghapus.";
          alert("Error: " + serverError);
        }
      });
    }
  };

  if (isLoading) return (
    <div className="flex min-h-screen bg-[#fff5f7]">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-400"></div>
      </div>
    </div>
  );

  if (isError) return <div className="p-10 text-red-400 font-bold">Gagal memuat data.</div>;

  return (
    <div className="flex min-h-screen bg-[#fff5f7]">
      <Sidebar />

      <div className="flex-1 p-8">
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-pink-600 tracking-tight">Kategori Management</h1>
            <p className="text-pink-400 font-medium">Total: <span className="font-bold">{categories.length} Kategori</span> ditemukan.</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari kategori..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border-2 border-pink-100 rounded-2xl outline-none focus:border-pink-300 transition-all w-full md:w-64 shadow-sm text-pink-600 placeholder-pink-200"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-pink-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FORM TAMBAH */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-pink-50 sticky top-8">
              <h2 className="text-xl font-bold text-pink-500 mb-6">Tambah Baru</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-pink-300 uppercase tracking-widest ml-1 mb-2 block">Nama Kategori</label>
                  <input
                    type="text"
                    placeholder="E.g. Kartun, Lucu..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border-pink-50 border-2 p-4 rounded-2xl focus:border-pink-200 outline-none transition-all bg-pink-50/30 focus:bg-white text-pink-700"
                  />
                </div>
                <button
                  onClick={handleAdd}
                  disabled={createMutation.isPending}
                  className="w-full bg-pink-400 hover:bg-pink-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-100 transition-all disabled:bg-pink-100"
                >
                  {createMutation.isPending ? "Simpan..." : "Simpan Kategori"}
                </button>
              </div>
            </div>
          </div>

          {/* LIST DATA */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-pink-50/50 border-b border-pink-100">
                  <tr>
                    <th className="p-6 text-pink-400 font-black uppercase text-[10px] tracking-widest">Nama Kategori</th>
                    <th className="p-6 text-pink-400 font-black uppercase text-[10px] tracking-widest text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat: any) => (
                    <tr key={cat.id} className="hover:bg-pink-50/20 transition-all group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-sm">
                            {cat.nama?.charAt(0).toUpperCase() || "!"}
                          </div>
                          <span className="font-bold text-pink-700">
                            {cat.nama || "Tanpa Nama"}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={deleteMutation.isPending}
                          className="text-pink-300 hover:text-red-500 font-bold text-xs transition-all uppercase tracking-tighter"
                        >
                          {deleteMutation.isPending ? "..." : "Hapus"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="p-20 text-center text-pink-200 italic">
                      Data tidak ditemukan...
                    </td>
                  </tr>
                )}
              </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Categories;