import { useNavigate, NavLink } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const namaAdmin = localStorage.getItem("nama") || "Admin";

  const handleLogout = () => {
    // Bersihkan semua data
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");
    
    alert("Pintu Dunia Kartun telah dikunci. Sampai jumpa! 🗝️");
    navigate("/login");
  };

  return (
    <aside className="w-72 bg-white min-h-screen flex flex-col p-8 border-r border-pink-100 shadow-sm sticky top-0 h-screen">
      {/* Brand */}
      <div className="mb-12">
        <h2 className="text-2xl font-black text-pink-500 italic tracking-tighter">DUNIA KARTUN</h2>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Online: {namaAdmin}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3">
        <NavLink 
          to="/dashboard" 
          className={({isActive}) => `flex items-center gap-3 p-4 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 translate-x-2' : 'text-slate-500 hover:bg-pink-50 hover:text-pink-500'}`}
        >
           <span className="text-xl">📊</span> Post Management
        </NavLink>
        
        <NavLink 
          to="/categories" 
          className={({isActive}) => `flex items-center gap-3 p-4 rounded-2xl font-bold transition-all duration-300 ${isActive ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 translate-x-2' : 'text-slate-500 hover:bg-pink-50 hover:text-pink-500'}`}
        >
           <span className="text-xl">📁</span> Categories
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="pt-6 border-t border-pink-50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-500 p-4 rounded-2xl font-black hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95 group"
        >
          <span>LOGOUT</span>
          <span className="group-hover:translate-x-1 transition-transform">➡️</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;