import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";
import { toast } from "sonner";


const token = localStorage.getItem('accessToken')

export const useGetUsers = (queryParams: Record<string, any>) => {
    return useQuery({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/user', {
                params: queryParams,
                headers: {
                    'Authorization': `Bearer ${token || ''}`
                }
            });
            return data;
        },
    });
};

export const useRegisterUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: any) => {
            const { data } = await axiosInstance.post('/user/register', userData, {
                headers: {
                    'Authorization': `Bearer ${token || ''}`
                }
            });
            return data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || 'Success!', {
                className: 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-lg',
            });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Something went wrong!';
            toast.error(errorMessage || 'Error!', {
                className: 'bg-rose-50 text-rose-800 border border-rose-200 shadow-lg',
            });
        },
    });
};

