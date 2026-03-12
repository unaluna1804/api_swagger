import { useState } from "react"; 
import { usePosts } from "../hooks/usePosts";
import { Link } from "react-router-dom";

function UserHome() {
  // 1. Inisialisasi state halaman aktif dan pencarian
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(""); // Live state untuk input

  // 2. Ambil data dari API menggunakan hook
  // Kita langsung masukkan 'search' ke hook agar fetch otomatis saat mengetik
  const { data: postsResponse, isLoading, isError } = usePosts(currentPage, search);

  // 3. Ekstrak data dari struktur JSON Backend
  const posts = postsResponse?.data || [];
  const totalPages = postsResponse?.last_page || 1; 

  if (isError) return (
    <div className="flex h-screen items-center justify-center text-pink-600 font-bold bg-pink-50">
      Gagal memuat postingan. Pastikan Backend sudah menyala.
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <nav className="bg-white border-b border-pink-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-black text-pink-500 tracking-tighter italic">DUNIA KARTUN</h1>
          <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-pink-500 transition-colors">Login</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-black text-slate-800 mb-2">Jelajahi Dunia Kartun</h2>
            <p className="text-pink-400/80 font-medium">Temukan fakta unik dan cerita menarik</p>
          </div>

          {/* --- SEARCH BAR OTOMATIS (LIVE SEARCH) --- */}
          <div className="relative w-full md:w-96 group">
            <input 
              type="text" 
              placeholder="Ketik judul kartun..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // Reset ke hal 1 setiap kali mengetik
              }}
              className="w-full bg-white border-2 border-pink-100 px-6 py-4 rounded-2xl outline-none focus:border-pink-500 transition-all shadow-md focus:shadow-pink-200"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-pink-400">
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-pink-500 border-t-transparent rounded-full"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
        </header>

        {/* Info jika sedang mencari */}
        {search && !isLoading && (
          <p className="mb-6 text-slate-500 animate-pulse">
            🔍 Menampilkan hasil untuk: <span className="font-bold text-pink-500">"{search}"</span>
          </p>
        )}

        {/* List Kartu Kartun */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-pink-50 flex flex-col group">
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={post.gambar} 
                    alt={post.judul} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  {/* Overlay Category jika ada */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-xs font-bold text-pink-500 shadow-sm">
                    {post.category_nama || 'General'}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-bold text-2xl text-slate-800 mb-3 group-hover:text-pink-500 transition-colors">
                    {post.judul}
                  </h3>
                  <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed text-sm">
                    {post.isi}
                  </p>
                  <div className="mt-auto pt-6 border-t border-pink-50 flex items-center justify-between">
                    <Link to={`/post/${post.id}`} className="text-pink-500 text-xs font-black tracking-widest uppercase hover:tracking-[0.2em] transition-all">
                      BACA SELENGKAPNYA →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : !isLoading && (
            <div className="col-span-full text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-pink-100">
              <span className="text-5xl mb-4 block">😶‍🌫️</span>
              <p className="text-slate-400 font-medium text-lg">Kartun "{search}" tidak ditemukan.</p>
              <button 
                onClick={() => setSearch("")} 
                className="mt-4 text-pink-500 font-bold hover:underline"
              >
                Hapus pencarian & tampilkan semua
              </button>
            </div>
          )}
        </div>

        {/* NAVIGASI PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-20 flex items-center justify-center gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(p => p - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white border-2 border-pink-100 rounded-2xl text-pink-500 font-bold hover:bg-pink-50 disabled:opacity-30 transition-all shadow-sm active:scale-95"
            >
              ← Prev
            </button>

            <div className="bg-white px-6 py-3 rounded-2xl border-2 border-pink-100 text-pink-500 font-black shadow-sm">
              {currentPage} / {totalPages}
            </div>

            <button 
              disabled={currentPage >= totalPages}
              onClick={() => {
                setCurrentPage(p => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white border-2 border-pink-100 rounded-2xl text-pink-500 font-bold hover:bg-pink-50 disabled:opacity-30 transition-all shadow-sm active:scale-95"
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserHome;