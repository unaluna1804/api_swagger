import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Categories from "./pages/Categories";
import Dashboard from "./pages/Dashboard";
import PostDetail from "./pages/PostDetail";
import UserHome from "./pages/UserHome";
import NotFound from "./pages/NotFound"; // Import file NotFound

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
      </Route>

      {/* 1. PAGE NOT FOUND: Jika rute tidak terdaftar, lari ke sini */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;