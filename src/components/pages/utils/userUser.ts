import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

export const useGetUsers = (queryParams: Record<string, any>) => {
    return useQuery({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/user', { params: queryParams });
            return data;
        },
    });
};

export const useRegisterUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (userData: any) => {
            const { data } = await axiosInstance.post('/user/register', userData);
            console.log(data)
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};