import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts, useCreatePost, useDeletePost } from "../hooks/usePosts";
import { useCategories } from "../hooks/useCategories";
import Sidebar from "../components/Sidebar";

// Library untuk Export
import ExcelJS from 'exceljs';
// @ts-ignore
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function Dashboard() {
  const navigate = useNavigate();

  // 1. Proteksi Route
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "1") {
      navigate("/login");
    }
  }, [navigate]);

  // 2. State UI
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // --- STATE UNTUK SELEKSI BANYAK (BATCH DELETE) ---
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 3. Form State (Untuk Tambah Data Baru)
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // 4. Data Fetching
  const { data: postsResponse, isLoading: loadingPosts } = usePosts(currentPage);
  const { data: categoriesResponse } = useCategories();

  const posts = postsResponse?.data || [];
  const totalPages = postsResponse?.last_page || 1;
  const categories = Array.isArray(categoriesResponse) 
    ? categoriesResponse 
    : categoriesResponse?.data || [];

  // 5. Mutation
  const createMutation = useCreatePost();
  const deleteMutation = useDeletePost();

  const resetForm = () => {
    setJudul(""); setIsi(""); setCategoryId(""); setFile(null); setShowModal(false);
  };

  // --- FUNGSI SELEKSI ---
  const handleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === posts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(posts.map((p: any) => p.id));
    }
  };

  // --- FUNGSI HAPUS BANYAK ---
  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Yakin ingin menghapus ${selectedIds.length} postingan ini?`)) {
      // Menjalankan delete untuk setiap ID yang dipilih
      selectedIds.forEach(id => {
        deleteMutation.mutate(id);
      });
      alert("Proses hapus massal sedang berjalan!");
      setSelectedIds([]);
    }
  };

  // --- 📊 FUNGSI EXPORT EXCEL ---
  const exportToExcel = async () => {
    if (posts.length === 0) return alert("Data kosong, Cok!");
    setIsExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data Postingan');
      worksheet.columns = [
        { header: 'No', key: 'no', width: 5 },
        { header: 'Judul', key: 'judul', width: 30 },
        { header: 'Isi Konten', key: 'isi', width: 50 },
        { header: 'Kategori', key: 'kategori', width: 20 },
      ];
      posts.forEach((item: any, index: number) => {
        worksheet.addRow({
          no: index + 1,
          judul: item.judul || "-",
          isi: item.isi || "-",
          kategori: item.category_nama || 'Uncategorized'
        });
      });
      worksheet.getRow(1).font = { bold: true };
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), `Laporan_Excel_DuniaKata.xlsx`);
    } catch (error) {
      alert("Gagal export Excel!");
    } finally {
      setIsExporting(false);
    }
  };

  // --- 📕 FUNGSI EXPORT PDF ---
  const exportToPDF = () => {
    if (posts.length === 0) return alert("Data kosong!");
    const doc = new jsPDF();
    const displayNama = localStorage.getItem("nama") || "Administrator";
    const role = localStorage.getItem("role");
    const pencetak = role === "1" ? `Admin (${displayNama})` : displayNama;

    doc.setFontSize(18);
    doc.text('LAPORAN DATA POSTINGAN', 14, 20); 
    doc.setFontSize(10);
    doc.text(`Dicetak oleh: ${pencetak} | Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);

    const tableRows = posts.map((item: any, index: number) => [
      index + 1,
      item.judul || "-",
      (item.isi || "").substring(0, 50) + "...",
      item.category_nama || 'Uncategorized'
    ]);

    autoTable(doc, {
      head: [["No", "Judul", "Isi Konten", "Kategori"]],
      body: tableRows,
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [244, 114, 182] },
    });
    doc.save(`Laporan_PDF_DuniaKata.pdf`);
  };

  const handleSubmit = () => {
    if (!judul || !isi || !categoryId) return alert("Wajib isi semua kolom!");
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("isi", isi);
    formData.append("category_id", categoryId);
    if (file) {
        formData.append("gambar", file);
    } else {
        return alert("Upload gambar juga dong!");
    }
    createMutation.mutate(
      formData, 
      { onSuccess: () => { alert("Postingan berhasil dibuat!"); resetForm(); } }
    );
  };

  if (loadingPosts) return (
    <div className="flex h-screen items-center justify-center bg-[#FFF5F7]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FFF5F7]">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-pink-100 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase italic">Post Management</h1>
            <p className="text-pink-400 text-sm font-medium">Admin Dunia Kata ✨</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* TOMBOL BATCH ACTIONS */}
            {selectedIds.length > 0 && (
              <button 
                onClick={handleBatchDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all animate-pulse"
              >
                🗑️ HAPUS TERPILIH ({selectedIds.length})
              </button>
            )}
            
            <button 
              onClick={handleSelectAll} 
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-all"
            >
              {selectedIds.length === posts.length ? "❌ BATAL SEMUA" : "✅ PILIH SEMUA"}
            </button>

            <button onClick={exportToExcel} disabled={isExporting} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all disabled:opacity-50">
              📊 EXCEL
            </button>
            <button onClick={exportToPDF} className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all">
              📕 PDF
            </button>
            <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg">
              + TAMBAH DATA
            </button>
          </div>
        </header>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? posts.map((post: any) => (
            <div 
              key={post.id} 
              className={`relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm border-2 flex flex-col transition-all duration-300 ${selectedIds.includes(post.id) ? 'border-pink-500 scale-95 shadow-lg' : 'border-pink-50 hover:shadow-xl hover:-translate-y-2'}`}
            >
              {/* CHECKBOX SELEKSI */}
              <div className="absolute top-4 right-4 z-20">
                <input 
                  type="checkbox" 
                  checked={selectedIds.includes(post.id)} 
                  onChange={() => handleSelect(post.id)}
                  className="w-6 h-6 accent-pink-500 cursor-pointer rounded-lg"
                />
              </div>

              <div 
                className="cursor-pointer" 
                onClick={() => navigate(`/dashboard/post/${post.id}`)}
              >
                <div className="h-48 overflow-hidden relative bg-pink-50">
                  <img src={post.gambar} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-pink-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase">
                      {post.category_nama || "Umum"}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-slate-800 mb-2 italic uppercase line-clamp-1">{post.judul}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{post.isi}</p>
                  <div className="mt-auto pt-4 border-t border-pink-50 text-[10px] font-bold text-pink-400 uppercase italic tracking-wider">
                     Detail & Kelola Postingan →
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-20 text-slate-400 italic">Data belum ada...</div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-5 py-2 bg-white border border-pink-100 rounded-xl text-pink-500 font-bold disabled:opacity-30">Prev</button>
          <span className="font-bold text-slate-700 bg-white px-4 py-2 rounded-xl border border-pink-100">{currentPage} / {totalPages}</span>
          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-5 py-2 bg-white border border-pink-100 rounded-xl text-pink-500 font-bold disabled:opacity-30">Next</button>
        </div>
      </div>

      {/* Modal Khusus Tambah Data */}
      {showModal && (
        <div className="fixed inset-0 bg-pink-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-pink-100">
            <h2 className="text-xl font-black mb-6 text-slate-800 uppercase italic">Input Postingan Baru</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Judul..." value={judul} onChange={(e) => setJudul(e.target.value)} className="w-full bg-pink-50/30 border-2 border-pink-50 p-3.5 rounded-xl outline-none focus:border-pink-300" />
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-pink-50/30 border-2 border-pink-50 p-3.5 rounded-xl outline-none focus:border-pink-300">
                <option value="">-- Kategori --</option>
                {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.nama}</option>)}
              </select>
              <textarea placeholder="Ceritakan sesuatu..." value={isi} onChange={(e) => setIsi(e.target.value)} className="w-full bg-pink-50/30 border-2 border-pink-50 p-3.5 rounded-xl h-28 resize-none outline-none focus:border-pink-300" />
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={handleSubmit} className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-bold hover:bg-pink-600">SIMPAN</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-xl font-bold">BATAL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;