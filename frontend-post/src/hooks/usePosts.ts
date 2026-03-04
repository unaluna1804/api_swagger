import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

const API_URL = "/posts";

// --- PERBAIKAN: Tambahkan parameter 'page' di sini ---
export const usePosts = (page: number = 1) => {
  return useQuery({
    // Tambahkan page ke dalam queryKey agar data refresh otomatis saat ganti halaman
    queryKey: ["posts", page], 
    queryFn: async () => {
      // Menambahkan query parameter ?page= ke URL API
      const res = await api.get(`${API_URL}?page=${page}`);
      return res.data;
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Terhapus!");
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPost: any) => {
      const formData = new FormData();
      formData.append("judul", newPost.judul);
      formData.append("isi", newPost.isi);
      formData.append("category_id", newPost.category_id);
      formData.append("gambar", newPost.gambar); 
      return await api.post(API_URL, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    // TIPS: Tambahkan onError di sini untuk Read Validation Message di form tambah
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal membuat postingan";
      alert(msg);
    }
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const formData = new FormData();
      formData.append("judul", data.judul);
      formData.append("isi", data.isi);
      formData.append("category_id", String(data.category_id)); 
      
      if (data.gambar instanceof File) {
        formData.append("gambar", data.gambar);
      }
      return await api.put(`${API_URL}/${id}`, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Berhasil update!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal update postingan";
      alert(msg);
    }
  });
};