import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Menghubungkan ke API /register
      await api.post("/register", { email, password });
      
      alert("✨ Akun berhasil dibuat! Silakan login cok.");
      navigate("/login"); 
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Gagal mendaftar";
      alert("❌ Pendaftaran Gagal: " + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7] p-4 font-sans">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-pink-200/50 w-full max-w-md border border-pink-50 relative overflow-hidden text-center">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-60"></div>

        <header className="mb-10 relative">
          <Link to="/" className="text-pink-500 font-black italic text-xl tracking-tighter mb-2 block hover:scale-105 transition-transform">
              DUNIA KARTUN
          </Link>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Daftar Akun</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium italic">Gabung ke komunitas kartun ✨</p>
        </header>

        <form onSubmit={handleRegister} className="space-y-5 relative">
          <div className="text-left space-y-2">
            <label className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] ml-4">Email Address</label>
            <input 
              type="email" 
              placeholder="user@gmail.com" 
              className="w-full p-4 bg-pink-50/50 border border-pink-100 rounded-2xl text-slate-700 outline-none focus:border-pink-500 focus:bg-white transition-all"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="text-left space-y-2">
            <label className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] ml-4">Password</label>
            <input 
              type="password" 
              placeholder="Minimal 6 karakter" 
              className="w-full p-4 bg-pink-50/50 border border-pink-100 rounded-2xl text-slate-700 outline-none focus:border-pink-500 focus:bg-white transition-all"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-2xl font-black shadow-lg shadow-pink-100 hover:shadow-pink-200 active:scale-[0.98] transition-all"
          >
            {loading ? "MENDAFTARKAN..." : "DAFTAR SEKARANG"}
          </button>
        </form>

        <footer className="mt-8 relative">
           <p className="text-slate-500 text-sm">Sudah punya akun? 
             <Link to="/login" className="text-pink-500 font-bold ml-1 hover:underline">Login di sini</Link>
           </p>
        </footer>
      </div>
    </div>
  );
};

export default Register;