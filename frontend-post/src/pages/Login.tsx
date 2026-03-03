import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/login", { email, password });
      
      console.log("RESPONS SERVER LENGKAP:", response.data);

      const token = response.data?.data?.accessToken;

      if (token && typeof token === "string") {
        localStorage.setItem("token", token);
        alert("🚀 Login Berhasil! Selamat datang Admin.");
        navigate("/dashboard");
      } else {
        console.error("Token tidak ditemukan. Cek struktur ini:", response.data);
        alert("❌ Gagal mendapatkan Token.");
      }
    } catch (error: any) {
      alert("❌ Error: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F7] p-4">
      {/* Container utama dengan rounded besar & shadow pink halus */}
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-pink-200/50 w-full max-w-md border border-pink-50 relative overflow-hidden text-center">
        
        {/* Dekorasi Aksen Lingkaran Pink */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-60"></div>

        <header className="mb-10 relative">
          <Link to="/" className="text-pink-500 font-black italic text-xl tracking-tighter mb-2 block">
             DUNIA KARTUN
          </Link>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Admin Login</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium italic">Khusus penjaga gerbang kartun 🗝️</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-5 relative">
          <div className="text-left space-y-2">
            <label className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] ml-4">Email Address</label>
            <input 
              type="email" 
              placeholder="admin@duniakartun.com" 
              className="w-full p-4 bg-pink-50/50 border border-pink-100 rounded-2xl text-slate-700 outline-none focus:border-pink-500 focus:bg-white transition-all placeholder:text-pink-200"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="text-left space-y-2">
            <label className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] ml-4">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-4 bg-pink-50/50 border border-pink-100 rounded-2xl text-slate-700 outline-none focus:border-pink-500 focus:bg-white transition-all placeholder:text-pink-200"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-2xl font-black shadow-lg shadow-pink-100 hover:shadow-pink-200 active:scale-[0.98] disabled:bg-pink-200 transition-all duration-300"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                MENCOCOKKAN...
              </span>
            ) : "SIGN IN"}
          </button>
        </form>

        <footer className="mt-8 relative">
           <button 
              onClick={() => navigate("/")}
              className="text-slate-400 text-xs font-bold hover:text-pink-500 transition-colors uppercase tracking-widest"
           >
             ← Kembali ke Dunia User
           </button>
        </footer>
      </div>
    </div>
  );
};

export default Login;