import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#fff5f7] flex flex-col items-center justify-center p-5 text-center">
      <div className="text-pink-300 text-9xl font-black mb-4">404</div>
      <h1 className="text-3xl font-bold text-pink-600 mb-2">Halaman Tidak Ditemukan!</h1>
      <p className="text-pink-400 mb-8 font-medium">Ups! Sepertinya halaman yang kamu cari sedang liburan.</p>
      <Link to="/" className="bg-pink-400 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-pink-100 hover:scale-105 transition-all">
        Kembali ke Beranda
      </Link>
    </div>
  );
}

export default NotFound;