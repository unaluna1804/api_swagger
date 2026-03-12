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
      const token = response.data?.data?.accessToken;
      const role = response.data?.data?.role; 
      const nama = response.data?.data?.nama || "User";

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", String(role)); 
        localStorage.setItem("nama", nama);

        if (Number(role) === 1) {
          alert(`🚀 Login Berhasil! Selamat datang Admin ${nama}.`);
          navigate("/dashboard");
        } else {
          alert(`✅ Login Berhasil! Halo ${nama}, selamat menikmati kartun.`);
          navigate("/"); 
        }
      } else {
        alert("❌ Gagal: Token tidak ditemukan.");
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Terjadi kesalahan saat login";
      alert("❌ Login Gagal: " + errorMsg);
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
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Login</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium italic">Pintu masuk ke dunia imajinasi 🗝️</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-5 relative">
          <div className="text-left space-y-2">
            <label className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] ml-4">Email Address</label>
            <input 
              type="email" 
              placeholder="user@duniakartun.com" 
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
            {loading ? "MENCOCOKKAN..." : "SIGN IN"}
          </button>
        </form>

        <footer className="mt-8 relative">
           <p className="text-slate-500 text-sm mb-4">Belum punya akun? 
             <Link to="/register" className="text-pink-500 font-bold ml-1 hover:underline">Daftar sekarang</Link>
           </p>
           <button onClick={() => navigate("/")} className="text-slate-400 text-xs font-bold hover:text-pink-500 transition-colors uppercase tracking-widest">
             ← Kembali ke Beranda
           </button>
        </footer>
      </div>
    </div>
  );
};

export default Login;