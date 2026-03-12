import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import api from "../lib/api"; // Sesuaikan dengan lokasi axios instance kamu

// 1. Ambil semua komentar berdasarkan ID Postingan
export const useComments = (postId: string | undefined) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await api.get(`/posts/${postId}/comments`);
      // Sesuaikan dengan struktur respons API kamu (biasanya res.data.data)
      return res.data.data || res.data;
    },
    enabled: !!postId,
  });
};

// 2. Tambah Komentar Baru
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      return await api.post(`/posts/${postId}/comments`, { content });
    },
    onSuccess: (_, variables) => {
      // Refresh list komentar otomatis setelah berhasil nambah
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
    },
  });
};

// 3. Tambah/Update Rating
export const useCreateRating = () => {
  return useMutation({
    mutationFn: async ({ postId, score }: { postId: string; score: number }) => {
      return await api.post(`/posts/${postId}/ratings`, { score });
    },
  });
};

// 4. Hapus Komentar (Ini yang bikin error merah tadi!)
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      return await api.delete(`/comments/${commentId}`);
    },
    onSuccess: () => {
      // Refresh semua query yang berhubungan dengan komentar
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      alert("Komentar berhasil dihapus!");
    },
    onError: () => {
      alert("Gagal hapus komentar, cek koneksi atau rute API!");
    }
  });
};