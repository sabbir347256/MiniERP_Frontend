import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { toast, Toaster } from "sonner";
import FormWrapper from "../utils/FormWrapper";
import FormInput from "../utils/FormInput";
import { useNavigate } from "react-router";

const Login = () => {
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async (credentials: any) => {
            const { data } = await axiosInstance.post('/auth/login', credentials);
            return data.data;
        },
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.accessToken);
            toast.success('Authenticated successfully! Redirecting...', {
                style: {
                    background: '#ecfdf5',
                    color: '#065f46',
                    borderColor: '#a7f3d0'
                }
            });
            setTimeout(() => navigate('/'), 1000);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Authentication failed!';
            toast.error(errorMessage, {
                style: {
                    background: '#fff1f2',
                    color: '#9f1239',
                    borderColor: '#fecdd3'
                }
            });
        },
    });

    const handleLoginSubmit = (data: any) => {
        loginMutation.mutate(data);
    };


    return (
        <div>
            <Toaster position="top-right" richColors={false}></Toaster>
            <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 pointer-events-none" />

                <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-800/80 relative z-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14  rounded-xl shadow-lg shadow-indigo-500/20 mb-4">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">Nexus ERP</h2>
                        <p className="text-sm text-slate-400 mt-2">Inventory & Sales Management System</p>
                    </div>

                    <FormWrapper onSubmit={handleLoginSubmit}>
                        <div className="space-y-4">
                            <div>
                                <FormInput
                                    name="email"
                                    type="email"
                                    label="Enterprise Email"
                                    placeholder="name@company.com"
                                    required={true}
                                />
                            </div>
                            <div>
                                <FormInput
                                    name="password"
                                    type="password"
                                    label="Account Password"
                                    placeholder="••••••••"
                                    required={true}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox" className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0" />
                                <span>Remember station</span>
                            </label>
                            <span className="hover:text-indigo-400 transition cursor-pointer">Forgot credentials?</span>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full relative flex items-center justify-center py-2.5 px-4  hover:from-indigo-600 hover:to-violet-600 active:scale-[0.98] text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/10 focus:outline-none transition-all disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {loginMutation.isPending ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Secure Sign In'
                                )}
                            </button>
                        </div>
                    </FormWrapper>

                    <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
                        <p className="text-xs text-slate-500">
                            Authorized personnel only. Activities are standardly monitored.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;