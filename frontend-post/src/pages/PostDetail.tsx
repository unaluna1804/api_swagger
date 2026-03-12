import { useParams, useNavigate } from "react-router-dom";
import { usePostById } from "../hooks/usePosts";
import { useState } from "react";
// Pastikan kamu sudah buat hook ini atau sesuaikan importnya
import { useComments, useCreateComment, useCreateRating } from "../hooks/useInteractions";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Cek status login

  // 1. Data Utama Post
  const { data: post, isLoading, isError } = usePostById(id);
  
  // 2. Data Interaksi (Rating & Komentar)
  const { data: comments } = useComments(id);
  const commentMutation = useCreateComment();
  const ratingMutation = useCreateRating();

  // State Lokal
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-pink-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500"></div>
    </div>
  );

  if (isError || !post) return (
    <div className="flex flex-col h-screen items-center justify-center bg-pink-50 text-center p-6">
      <h2 className="text-2xl font-bold text-slate-800 italic">Waduh, kartunnya nggak ketemu cok! 😰</h2>
      <button onClick={() => navigate(-1)} className="mt-6 bg-pink-500 text-white px-8 py-3 rounded-2xl font-bold">← Kembali</button>
    </div>
  );

  // Handler Kirim Komentar
  const handleSendComment = () => {
    if (!newComment.trim()) return;
    commentMutation.mutate({ postId: id!, content: newComment }, {
      onSuccess: () => setNewComment("")
    });
  };

  // Handler Kirim Rating
  const handleSendRating = (score: number) => {
    setUserRating(score);
    ratingMutation.mutate({ postId: id!, score });
    alert("Makasih bintangnya ya! 🌟");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Tombol Back */}
      <button onClick={() => navigate(-1)} className="fixed top-8 left-8 z-30 bg-white/90 backdrop-blur-sm shadow-lg w-12 h-12 rounded-full flex items-center justify-center text-slate-700 hover:bg-pink-500 hover:text-white transition-all duration-300">←</button>

      {/* Hero Section */}
      <div className="w-full h-[65vh] relative overflow-hidden">
        <img src={post.gambar} alt={post.judul} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-4xl mx-auto">
            <span className="bg-pink-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block italic">
              {post.category_nama || "Umum"}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight italic uppercase drop-shadow-lg">
              {post.judul}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <article className="max-w-4xl mx-auto px-8 py-16">
        <div className="flex items-center gap-4 mb-12 pb-8 border-b border-pink-50">
          <div className="w-14 h-14 rounded-full bg-pink-400 flex items-center justify-center text-white font-black text-2xl border-4 border-white shadow-sm">
            {post.judul ? post.judul.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 tracking-tight italic uppercase">Administrator</p>
            <p className="text-xs text-pink-400 font-semibold uppercase tracking-wider">Maret 2026</p>
          </div>
        </div>

        <div className="prose prose-pink prose-lg max-w-none text-slate-600 leading-relaxed font-medium mb-20">
          {post.isi ? post.isi.split('\n').map((paragraph: string, idx: number) => (
            <p key={idx} className="mb-8 last:mb-0">{paragraph}</p>
          )) : "Konten kosong."}
        </div>

        {/* --- FITUR INTERAKSI (Rating & Komentar) --- */}
        <div className="pt-16 border-t-2 border-pink-50">
          
          {/* SEKSI RATING */}
          <div className="bg-pink-50 rounded-[2.5rem] p-10 text-center mb-16 shadow-inner">
            <h3 className="text-xl font-black italic text-slate-800 uppercase mb-4 tracking-tight">Suka Kartun Ini? Kasih Rating Yuk!</h3>
            {token ? (
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => handleSendRating(star)}
                    className={`text-4xl transition-all hover:scale-125 active:scale-90 ${userRating >= star ? 'text-amber-400' : 'text-slate-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-pink-500 font-bold italic bg-white inline-block px-6 py-2 rounded-full shadow-sm text-sm">Login dulu ya buat kasih rating! ✨</p>
            )}
          </div>

          {/* SEKSI KOMENTAR */}
          <div className="space-y-10">
            <h3 className="text-2xl font-black italic text-slate-800 uppercase tracking-tighter">Komentar Teman-teman</h3>
            
            {token ? (
              <div className="flex flex-col gap-4">
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ceritain pendapat kamu tentang kartun ini..."
                  className="w-full bg-slate-50 border-none p-6 rounded-[2rem] h-32 outline-none focus:ring-2 focus:ring-pink-300 font-medium text-slate-700 transition-all"
                />
                <button 
                  onClick={handleSendComment}
                  className="bg-pink-500 text-white px-10 py-4 rounded-2xl font-black uppercase italic self-end shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all"
                >
                  Kirim Komentar 🚀
                </button>
              </div>
            ) : (
              <div className="bg-slate-100 p-8 rounded-[2rem] text-center border-2 border-dashed border-slate-200">
                <p className="text-slate-500 font-bold italic">Wah, login dulu yuk biar bisa ikutan ngobrol! 📢</p>
              </div>
            )}

            {/* LIST KOMENTAR */}
            <div className="space-y-6 mt-12">
              {comments?.map((c: any) => (
                <div key={c.id} className="flex gap-4 p-6 bg-white border border-pink-50 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex-shrink-0 flex items-center justify-center text-pink-500 font-black italic shadow-inner">
                    {c.user_nama?.[0] || 'U'}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase italic text-xs mb-1 tracking-wide">{c.user_nama || "User Ceria"}</h4>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
              {(!comments || comments.length === 0) && (
                <p className="text-center text-slate-400 italic text-sm py-10">Belum ada komentar nih. Jadilah yang pertama! 🎈</p>
              )}
            </div>
          </div>
        </div>
      </article>

      <footer className="bg-pink-50 py-20 border-t border-pink-100 mt-20">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h3 className="text-pink-500 font-black italic text-xl mb-4 uppercase tracking-[0.3em]">DUNIA KARTUN</h3>
          <p className="text-pink-300 text-sm font-medium">© 2026 Portal Berita. Dibuat dengan cinta ✨</p>
        </div>
      </footer>
    </div>
  );
}

export default PostDetail;