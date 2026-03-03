import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import PostDetail from "./pages/PostDetail"; // Pastikan namanya konsisten
import UserHome from "./pages/UserHome"; 

function App() {
  return (
    <Routes>
      {/* HALAMAN USER (Bisa diakses tanpa login) */}
      <Route path="/" element={<UserHome />} />
      
      {/* Sekarang sudah konsisten: import PostDetail, panggil PostDetail */}
      <Route path="/post/:id" element={<PostDetail />} />

      {/* HALAMAN ADMIN */}
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/categories" element={<Categories />} />

      {/* REDIRECT (Jika ngetik link asal, arahkan ke Home) */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;