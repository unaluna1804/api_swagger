import { useParams, useNavigate } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: postsData, isLoading } = usePosts();

  // Mencari data post yang spesifik berdasarkan ID
  const posts = postsData?.data || (Array.isArray(postsData) ? postsData : []);
  const post = posts.find((p: any) => p.id === Number(id));

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-pink-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500"></div>
    </div>
  );

  if (!post) return (
    <div className="flex flex-col h-screen items-center justify-center bg-pink-50">
      <h2 className="text-2xl font-bold text-slate-800">Postingan tidak ditemukan</h2>
      <button 
        onClick={() => navigate(-1)} 
        className="mt-4 text-pink-600 font-bold hover:text-pink-700 transition-colors"
      >
        ← Kembali ke Beranda
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="fixed top-8 left-8 z-20 bg-white/90 backdrop-blur-sm shadow-lg w-12 h-12 rounded-full flex items-center justify-center text-slate-700 hover:bg-pink-500 hover:text-white transition-all duration-300"
        title="Kembali"
      >
        ←
      </button>

      {/* Hero Section: Gambar Header */}
      <div className="w-full h-[65vh] relative overflow-hidden">
        <img 
          src={post.gambar} 
          alt={post.judul} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[2s]"
        />
        {/* Overlay gradient untuk teks agar terbaca jelas */}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-4xl mx-auto">
            <span className="bg-pink-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg mb-6 inline-block">
              {post.category_nama || "Umum"}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter drop-shadow-md">
              {post.judul}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <article className="max-w-4xl mx-auto px-8 py-16">
        {/* Author Info */}
        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-pink-50">
          <div className="w-14 h-14 rounded-full bg-pink-100 p-1">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src={`https://ui-avatars.com/api/?name=Admin&background=f472b6&color=fff`} alt="avatar" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 tracking-tight">Administrator</p>
            <p className="text-xs text-pink-400 font-semibold uppercase tracking-wider">3 Maret 2026</p>
          </div>
        </div>

        {/* Post Content */}
        <div className="prose prose-pink prose-lg max-w-none text-slate-600 leading-relaxed font-medium">
          {post.isi.split('\n').map((paragraph: string, idx: number) => (
            <p key={idx} className="mb-8 first-letter:text-5xl first-letter:font-black first-letter:text-pink-500 first-letter:mr-3 first-letter:float-left last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {/* Footer Sederhana */}
      <footer className="bg-pink-50 py-20 border-t border-pink-100">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h3 className="text-pink-500 font-black italic text-xl mb-4">DUNIA KARTUN</h3>
          <p className="text-pink-300 text-sm font-medium">© 2026 Portal Berita. Dibuat dengan cinta & semangat ✨</p>
        </div>
      </footer>
    </div>
  );
}

export default PostDetail;