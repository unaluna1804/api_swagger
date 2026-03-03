import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

const API_URL = "/posts";

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await api.get(API_URL);
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
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const formData = new FormData();
      formData.append("judul", data.judul);
      formData.append("isi", data.isi);
      
      // PERBAIKAN: Ambil category_id dari data input, jangan diisi "1" terus!
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
  });
};