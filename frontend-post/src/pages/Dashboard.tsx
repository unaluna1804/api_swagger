import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePosts, useDeletePost, useCreatePost, useUpdatePost } from "../hooks/usePosts";
import { useCategories } from "../hooks/useCategories";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const navigate = useNavigate();
  const { data: postsData, isLoading, isError } = usePosts();
  const { data: categoriesData } = useCategories();
  
  const deleteMutation = useDeletePost();
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  // Data dari database
  const posts = postsData?.data || (Array.isArray(postsData) ? postsData : []);
  const categories = categoriesData?.data || (Array.isArray(categoriesData) ? categoriesData : []);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [judul, setJudul] = useState("");
  const [isi, setIsi] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const handleSubmit = () => {
    if (!categoryId) return alert("Pilih kategori!");
    const formData = { judul, isi, gambar: file, category_id: Number(categoryId) };

    if (editId) {
      updateMutation.mutate({ id: editId, data: formData }, { onSuccess: () => setShowModal(false) });
    } else {
      createMutation.mutate(formData, { onSuccess: () => setShowModal(false) });
    }
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-pink-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FFF5F7]"> {/* Pink Soft Background */}
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-10">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-[2rem] shadow-sm border border-pink-100">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Post Management</h1>
            <p className="text-pink-400 text-sm font-medium">Data diambil langsung dari Database</p>
          </div>
          <button 
            onClick={() => { setEditId(null); setJudul(""); setIsi(""); setCategoryId(""); setShowModal(true); }} 
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-pink-200 active:scale-95"
          >
            + Post Baru
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <div key={post.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-pink-50 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 overflow-hidden relative">
                <img src={post.gambar} alt={post.judul} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="bg-pink-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                    {post.category_nama || "Uncategorized"}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-xl text-slate-800 mb-2 leading-tight uppercase italic line-clamp-2">
                  {post.judul}
                </h3>
                
                <p className="text-sm text-slate-500 mb-4 line-clamp-3 leading-relaxed">
                  {post.isi}
                </p>
                
                <Link to={`/post/${post.id}`} className="text-pink-500 text-xs font-black uppercase tracking-widest hover:text-pink-700 mb-6 block transition-colors">
                  PRATINJAU POST →
                </Link>

                <div className="flex gap-3 mt-auto pt-5 border-t border-pink-50">
                  <button 
                    onClick={() => { setEditId(post.id); setJudul(post.judul); setIsi(post.isi); setCategoryId(post.category_id); setShowModal(true); }} 
                    className="flex-1 bg-amber-50 text-amber-600 py-3 rounded-xl font-bold text-xs hover:bg-amber-500 hover:text-white transition-all shadow-sm shadow-amber-100"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => { if(window.confirm("Hapus postingan ini?")) deleteMutation.mutate(post.id) }} 
                    className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all shadow-sm shadow-red-100"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-pink-900/20 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl border border-pink-100">
            <h2 className="text-2xl font-black mb-6 text-slate-800 flex items-center gap-2">
              <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
              {editId ? "Edit" : "Tambah"} Postingan
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-pink-400 ml-4 uppercase">Judul Post</label>
                <input type="text" placeholder="Masukkan judul..." value={judul} onChange={(e) => setJudul(e.target.value)} className="w-full bg-pink-50/30 border-pink-100 border-2 p-4 rounded-2xl outline-none focus:border-pink-500 focus:bg-white transition-all" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-pink-400 ml-4 uppercase">Kategori</label>
                <select 
                  value={categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-pink-50/30 border-pink-100 border-2 p-4 rounded-2xl outline-none focus:border-pink-500 focus:bg-white transition-all appearance-none"
                >
                  <option value="">-- Pilih Kategori --</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.nama}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-pink-400 ml-4 uppercase">Konten</label>
                <textarea placeholder="Tulis cerita kartun di sini..." value={isi} onChange={(e) => setIsi(e.target.value)} className="w-full bg-pink-50/30 border-pink-100 border-2 p-4 rounded-2xl h-32 outline-none focus:border-pink-500 focus:bg-white transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-pink-400 ml-4 uppercase">Thumbnail (Gambar)</label>
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200 transition-all cursor-pointer" />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={handleSubmit} className="flex-[2] bg-pink-500 text-white py-4 rounded-2xl font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-200 active:scale-95">
                {editId ? "Update Sekarang" : "Terbitkan Post"}
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Dashboard;