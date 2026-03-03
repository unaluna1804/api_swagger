import { useParams, useNavigate } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";
import Sidebar from "../components/Sidebar";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: postsResponse, isLoading } = usePosts();

  // Mencari post berdasarkan ID dari data yang dikirim backend
  const post = postsResponse?.data?.find((p: any) => p.id === Number(id));

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
    </div>
  );
  
  if (!post) return (
    <div className="flex flex-col h-screen items-center justify-center bg-slate-50 text-slate-500">
      <p className="text-xl font-bold">Postingan tidak ditemukan.</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 font-bold">← Kembali</button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar tetap ada untuk navigasi admin */}
      <Sidebar />
      
      <div className="flex-1 p-4 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-white">
          
          {/* Header: Tombol Back & Label Kategori */}
          <div className="p-8 pb-0 flex justify-between items-start">
            <button 
              onClick={() => navigate(-1)}
              className="bg-slate-100 hover:bg-indigo-600 hover:text-white p-3 rounded-2xl transition-all group"
              title="Kembali"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            {/* PERBAIKAN: Memanggil field 'nama' sesuai database kamu */}
            <span className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            {/* Ganti menjadi category_nama sesuai response body Swagger kamu */}
            {post.category_nama || "Umum"}
            </span>
          </div>

          <div className="p-8 pt-6">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
              {post.judul}
            </h1>

            {/* Gambar Postingan */}
            <div className="rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl shadow-indigo-100">
              <img 
                src={post.gambar} 
                alt={post.judul} 
                className="w-full h-auto max-h-[600px] object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Info Penulis & Tanggal */}
            <div className="flex items-center gap-5 mb-10 pb-10 border-b border-slate-50">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-100">
                A
              </div>
              <div>
                <p className="font-black text-slate-800 text-lg tracking-tight">Administrator</p>
                <p className="text-slate-400 text-sm font-medium">
                  {/* Menggunakan tanggal dari post jika ada, atau tanggal hari ini */}
                  {post.created_at ? new Date(post.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' }) : new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
                </p>
              </div>
            </div>

            {/* Isi Konten */}
            <div className="prose prose-slate max-w-none">
              <div className="text-xl text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                {post.isi}
              </div>
            </div>
          </div>

          {/* Footer Simple di dalam kartu */}
          <div className="bg-slate-50/50 p-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Akhir dari postingan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;