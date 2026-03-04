import { useState } from "react"; 
import { usePosts } from "../hooks/usePosts";
import { Link } from "react-router-dom";

function UserHome() {
  const [currentPage, setCurrentPage] = useState(1);
  // --- UBAH KE 9 AGAR GRID 3 KOLOM TERISI PENUH ---
  const itemsPerPage = 9; 

  const { data: postsData, isLoading, isError } = usePosts(currentPage);
  const posts = postsData?.data || (Array.isArray(postsData) ? postsData : []);

  // Logika Pemotongan (Slice) Data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Ambil hanya 9 item untuk ditampilkan
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);
  
  // Hitung total halaman berdasarkan jumlah seluruh posts
  const totalPages = Math.ceil(posts.length / itemsPerPage) || 1; 

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-pink-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500"></div>
    </div>
  );

  if (isError) return (
    <div className="flex h-screen items-center justify-center text-pink-600 font-bold bg-pink-50">
      Gagal memuat postingan.
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <nav className="bg-white border-b border-pink-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-black text-pink-500 tracking-tighter italic">DUNIA KARTUN</h1>
          <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-pink-500 transition-colors">Admin Login</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-10">
        <header className="mb-12">
          <h2 className="text-4xl font-black text-slate-800 mb-2">Jelajahi Dunia Kartun</h2>
          <p className="text-pink-400/80 font-medium">Temukan fakta unik dan cerita menarik dari serial animasi favoritmu</p>
        </header>

        {/* Grid tampil 3x3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentPosts.map((post: any) => (
            <div key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-pink-50 flex flex-col group">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={post.gambar} 
                  alt={post.judul} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-pink-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-md">
                    {post.category_nama || "Umum"}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <h3 className="font-bold text-2xl text-slate-800 mb-3 leading-tight group-hover:text-pink-500 transition-colors">
                  {post.judul}
                </h3>
                <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                  {post.isi}
                </p>
                <div className="mt-auto pt-6 border-t border-pink-50 flex items-center justify-between">
                  <Link 
                    to={`/post/${post.id}`} 
                    className="text-pink-500 text-sm font-bold flex items-center gap-2 group/btn"
                  >
                    BACA SELENGKAPNYA 
                    <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                  </Link>
                  <span className="text-pink-200 text-xs">Admin Post</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION UI */}
        {posts.length > 0 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(p => p - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-white border-2 border-pink-100 rounded-2xl text-pink-500 font-bold hover:bg-pink-50 disabled:opacity-30 transition-all shadow-sm"
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
              className="px-6 py-3 bg-white border-2 border-pink-100 rounded-2xl text-pink-500 font-bold hover:bg-pink-50 disabled:opacity-30 transition-all shadow-sm"
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