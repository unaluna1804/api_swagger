import { useParams, useNavigate } from "react-router-dom";
import { usePostById, useDeletePost, useUpdatePost } from "../hooks/usePosts";
import { useCategories } from "../hooks/useCategories";
import { useState, useEffect } from "react";
// Pastikan useDeleteComment sudah ada di useInteractions.ts kamu
import { useComments, useCreateComment, useCreateRating, useDeleteComment } from "../hooks/useInteractions";

function PostDetailAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 1. Data Utama
  const { data: post, isLoading, isError } = usePostById(id);
  const { data: categoriesResponse } = useCategories();
  
  // 2. Data Interaksi (Komentar & Rating)
  const { data: comments } = useComments(id);
  const commentMutation = useCreateComment();
  const ratingMutation = useCreateRating();
  const deleteCommentMutation = useDeleteComment(); // Hook buat hapus komentar

  const deleteMutation = useDeletePost();
  const updateMutation = useUpdatePost();

  // State
  const [showEditModal, setShowEditModal] = useState(false);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  // State Interaksi
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState(0);

  const categories = Array.isArray(categoriesResponse) ? categoriesResponse : categoriesResponse?.data || [];

  useEffect(() => {
    if (post) {
      setJudul(post.judul || "");
      setIsi(post.isi || "");
      setCategoryId(post.category_id || "");
    }
  }, [post]);

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 border-opacity-50"></div>
    </div>
  );

  if (isError || !post) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white p-6 text-center">
      <h1 className="text-2xl font-black text-rose-500 uppercase italic">Aduh, Datanya Gak Ada! 😭</h1>
      <button onClick={() => navigate("/dashboard")} className="mt-4 bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold uppercase italic shadow-lg">Kembali</button>
    </div>
  );

  // --- Fungsi Interaksi ---
  const handleSendComment = () => {
    if (!newComment.trim()) return;
    commentMutation.mutate({ postId: id!, content: newComment }, {
      onSuccess: () => setNewComment("")
    });
  };

  const handleSendRating = (score: number) => {
    setUserRating(score);
    ratingMutation.mutate({ postId: id!, score });
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("Hapus komentar ini?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  // --- Fungsi Admin ---
  const handleHapus = () => {
    if (window.confirm("Beneran mau hapus postingan ini?")) {
      deleteMutation.mutate(Number(id), { onSuccess: () => navigate("/dashboard") });
    }
  };

  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("isi", isi);
    formData.append("category_id", categoryId);
    if (file) formData.append("gambar", file);

    updateMutation.mutate({ id: Number(id), data: formData }, {
      onSuccess: () => {
        setShowEditModal(false);
        alert("Berhasil diperbarui!");
      }
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* HEADER VISUAL */}
      <div className="relative h-96 w-full bg-slate-100 overflow-hidden">
        <button onClick={() => navigate("/dashboard")} className="absolute top-8 left-8 z-30 bg-white/80 backdrop-blur-md p-3 px-6 rounded-2xl shadow-xl font-black italic text-xs uppercase">← KEMBALI</button>
        <img src={post.gambar} className="w-full h-full object-cover" alt={post.judul} />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border border-pink-50">
          <span className="bg-pink-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">{post.category_nama || "ANAK-ANAK"}</span>
          <h1 className="text-5xl font-black text-slate-800 my-8 italic uppercase leading-[1.1]">{post.judul}</h1>
          <div className="text-slate-600 leading-relaxed text-xl font-medium whitespace-pre-wrap mb-16 border-l-4 border-pink-100 pl-8">{post.isi}</div>

          {/* TOMBOL KENDALI ADMIN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-slate-100 mb-20">
            <button onClick={() => setShowEditModal(true)} className="bg-amber-400 text-white py-5 rounded-3xl font-black uppercase italic shadow-xl shadow-amber-100">EDIT KONTEN ✏️</button>
            <button onClick={handleHapus} className="bg-rose-500 text-white py-5 rounded-3xl font-black uppercase italic shadow-xl shadow-rose-100">HAPUS POST 🗑️</button>
          </div>

          {/* --- SEKSI INTERAKSI --- */}
          <div className="space-y-12">
            <div className="text-center bg-pink-50 p-8 rounded-[2.5rem]">
              <h3 className="font-black italic uppercase text-slate-800 mb-4">Rating Postingan (Mode Admin)</h3>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleSendRating(star)} className={`text-4xl transition-transform active:scale-90 ${userRating >= star ? 'text-amber-400' : 'text-slate-200'}`}>★</button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black italic uppercase text-slate-800 mb-6">Kelola Komentar</h3>
              
              {/* Form Tambah Komentar (Admin juga bisa komen) */}
              <div className="flex flex-col gap-4 mb-10">
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Tulis komentar Admin..." className="w-full bg-slate-50 border-none p-6 rounded-[2rem] h-32 focus:ring-2 focus:ring-pink-300 outline-none font-medium" />
                <button onClick={handleSendComment} className="bg-pink-500 text-white px-10 py-4 rounded-2xl font-black uppercase italic self-end shadow-lg shadow-pink-100">Kirim Komentar</button>
              </div>

              {/* LIST KOMENTAR DENGAN FITUR HAPUS */}
              <div className="space-y-6">
                {comments?.map((c: any) => (
                  <div key={c.id} className="flex justify-between items-start p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black">{c.user_nama?.[0] || 'U'}</div>
                      <div>
                        <h4 className="font-black text-slate-800 uppercase italic text-sm">{c.user_nama}</h4>
                        <p className="text-slate-600 mt-1">{c.content}</p>
                      </div>
                    </div>
                    {/* Tombol Hapus Komentar (Icon X atau tulisan Hapus) */}
                    <button 
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-rose-500 text-[10px] font-black uppercase border border-rose-100 px-3 py-1 rounded-full hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Hapus X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDIT */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-3xl font-black mb-8 text-slate-800 uppercase italic">Perbarui Data</h2>
            <div className="space-y-6">
              <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} className="w-full bg-slate-50 border-none p-5 rounded-3xl outline-none focus:ring-2 focus:ring-pink-300 font-bold" />
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full bg-slate-50 border-none p-5 rounded-3xl font-bold">
                {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.nama}</option>)}
              </select>
              <textarea value={isi} onChange={(e) => setIsi(e.target.value)} className="w-full bg-slate-50 border-none p-5 rounded-3xl h-44 resize-none outline-none focus:ring-2 focus:ring-pink-300 font-medium" />
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-xs font-bold" />
            </div>
            <div className="flex gap-4 mt-10">
              <button onClick={handleUpdate} className="flex-[2] bg-pink-500 text-white py-5 rounded-3xl font-black uppercase italic shadow-lg shadow-pink-100">SIMPAN PERUBAHAN</button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-3xl font-black uppercase italic">BATAL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDetailAdmin;