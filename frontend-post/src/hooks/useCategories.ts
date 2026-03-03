import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api"; 

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/api/categories");
      // FIX: Backend kamu membungkus array di dalam properti 'data'
      return data.data || data.rows || data;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newCategory: { nama: string }) => {
      // Mengirim field 'nama' sesuai kolom database kamu
      return await api.post("/api/categories", { 
        nama: newCategory.nama
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};