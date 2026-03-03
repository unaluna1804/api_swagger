import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Berhasil Logout!");
      window.location.href = "/login"; 
    }
  };

  return (
    // Menggunakan Pink fuchsia tua yang sangat tegas
    <div className="w-64 bg-pink-700 min-h-screen p-6 hidden md:block shadow-[10px_0_30px_-15px_rgba(0,0,0,0.3)]">
      
      {/* Judul Admin Panel dengan font tebal putih */}
      <div className="mb-10 pb-6 border-b-4 border-pink-800">
        <h2 className="text-2xl font-black text-white italic tracking-tighter">
          ADMIN <span className="text-pink-300">PANEL</span>
        </h2>
        <p className="text-[10px] font-black text-pink-200 uppercase tracking-[0.3em] mt-1">Dunia Kartun</p>
      </div>
      
      {/* Grup Menu Navigasi */}
      <nav className="space-y-3">
        
        {/* Menu Dashboard */}
        <Link 
          to="/dashboard" 
          className="flex items-center gap-4 text-white p-4 rounded-2xl hover:bg-white hover:text-pink-700 transition-all duration-300 font-black group shadow-lg hover:shadow-pink-900/50"
        >
          <span className="text-xl group-hover:scale-125 transition-transform">🏠</span>
          <span className="text-sm uppercase">Dashboard</span>
        </Link>
        
        {/* Menu Categories */}
        <Link 
          to="/categories" 
          className="flex items-center gap-4 text-white p-4 rounded-2xl hover:bg-white hover:text-pink-700 transition-all duration-300 font-black group shadow-lg hover:shadow-pink-900/50"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">📂</span>
          <span className="text-sm uppercase">Categories</span>
        </Link>

        {/* Separator Tebal */}
        <div className="py-6">
            <div className="h-1 bg-pink-800 rounded-full w-full"></div>
        </div>

        {/* Menu Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 text-pink-200 w-full p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 font-black group"
        >
          <span className="text-xl group-hover:translate-x-1 transition-transform">🚪</span>
          <span className="text-sm uppercase">Logout</span>
        </button>

      </nav>

      {/* Footer Sidebar Solid */}
      <div className="mt-20">
          <div className="bg-pink-800/50 p-4 rounded-3xl border-2 border-pink-400 text-center">
              <p className="text-[11px] font-black text-white tracking-widest uppercase">
                Happy Working! 🚀
              </p>
          </div>
      </div>
    </div>
  );
}

export default Sidebar;