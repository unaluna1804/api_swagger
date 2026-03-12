import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import UserHome from "./pages/UserHome";
import NotFound from "./pages/NotFound";

// Import Detail untuk User & Admin (Namanya beda biar nggak bingung)
import PostDetail from "./pages/PostDetail"; 
import PostDetailAdmin from "./pages/PostDetailAdmin"; 

// Proteksi Khusus Admin
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (role !== "1") {
    alert("Waduh, wilayah khusus Admin cok!");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <Routes>
      {/* --- WILAYAH USER UMUM --- */}
      <Route path="/" element={<UserHome />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- WILAYAH TERLARANG (HANYA ADMIN) --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        
        {/* Rute Detail Khusus Admin (Bisa Edit/Hapus) */}
        <Route path="/dashboard/post/:id" element={<PostDetailAdmin />} />
      </Route>

      {/* --- HALALAN TAYYIBAN (404) --- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;