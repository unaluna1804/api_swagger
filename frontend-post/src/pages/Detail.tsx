import { useParams, useNavigate } from "react-router-dom";
import { usePostById } from "../hooks/usePosts";
import Sidebar from "../components/Sidebar";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Memanggil API via Hook
  const { data: post, isLoading, isError } = usePostById(id);

  // 1. Tampilan saat loading
  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF5F7]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500"></div>
    </div>
  );
  
  // 2. Tampilan jika ID salah atau API error
  if (isError || !post) return (
    <div className="flex flex-col h-screen items-center justify-center bg-[#FFF5F7] text-pink-500 p-6 text-center">
      <span className="text-6xl mb-4">😰</span>
      <p className="text-xl font-black italic">Waduh, kartunnya nggak ketemu cok!</p>
      <button 
        onClick={() => navigate(-1)} 
        className="mt-6 bg-pink-500 text-white px-8 py-3 rounded-2xl font-bold"
      >
        ← Balik Lagi
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FFF5F7]">
      <Sidebar />
      
      <div className="flex-1 p-4 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-sm overflow-hidden border border-pink-50">
          
          {/* Header & Category Label */}
          <div className="p-8 pb-0 flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)}
              className="bg-pink-50 text-pink-500 hover:bg-pink-500 hover:text-white p-3 rounded-2xl transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            <span className="bg-pink-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-md">
              {post.category_nama || "Kartun Seru"}
            </span>
          </div>

          <div className="p-10 pt-6">
            {/* Judul dari API */}
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-8 leading-[1.1] italic tracking-tight">
              {post.judul}
            </h1>

            {/* Gambar dari API */}
            <div className="rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl shadow-pink-100/50 border-4 border-white">
              <img 
                src={post.gambar} 
                alt={post.judul} 
                className="w-full h-auto object-cover" 
              />
            </div>

            {/* Meta Info (Admin & Tanggal Dinamis) */}
            <div className="flex items-center gap-4 mb-10 pb-8 border-b border-pink-50">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
                {post.judul ? post.judul.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <p className="font-black text-slate-800 text-lg">Administrator</p>
                <p className="text-pink-400 text-sm font-bold uppercase tracking-tighter">
                  {/* INI BAGIAN PALING PENTING: JANGAN DIKETIK MANUAL! */}
                  {post.created_at ? new Date(post.created_at).toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  }) : 'Tanggal Belum Diset'}
                </p>
              </div>
            </div>

            {/* Isi Cerita dari API */}
            <div className="prose prose-pink max-w-none">
              <div className="text-xl text-slate-600 leading-relaxed whitespace-pre-line font-medium italic">
                {post.isi}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;