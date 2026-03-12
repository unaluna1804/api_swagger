import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";

const API_URL = "/posts";

// 1. Ambil Semua Data
export const usePosts = (page: number = 1, search: string = "") => {
  return useQuery({
    queryKey: ["posts", page, search], 
    queryFn: async () => {
      const res = await api.get(API_URL, {
        params: { page, search }
      });
      return res.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

// 2. Ambil SATU Data (Tanpa pecah array!)
export const usePostById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await api.get(`${API_URL}/${id}`);
      // Menangani struktur response.success(res, item)
      // Biasanya: { status: "success", data: { id: 48, judul: "..." } }
      return res.data.data || res.data; 
    },
    enabled: !!id,
    staleTime: 0, 
    gcTime: 0,
  });
};

// 3. Create Post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await api.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// 4. Update Post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return await api.put(`${API_URL}/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", String(variables.id)] });
    },
  });
};

// 5. Delete Post
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      alert("Postingan berhasil dihapus!");
    },
  });
};