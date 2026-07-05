import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";
import { toast } from "sonner";

export const useGetProducts = (queryParams: Record<string, any>) => {
    return useQuery({
        queryKey: ['products', queryParams],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/product', { params: queryParams });
            return data;
        },
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (productData: any) => {
            const { data } = await axiosInstance.post('/product', productData);
            return data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || 'Product created!');
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Operation failed');
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
            const { data } = await axiosInstance.patch(`/product/${id}`, payload);
            return data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || 'Product updated!');
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Update failed');
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await axiosInstance.delete(`/product/${id}`);
            return data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || 'Product deleted!');
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Deletion failed');
        },
    });
};