import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { toast, Toaster } from "sonner";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import { AuthProvider } from "../../AuthProvider/CreateContext";

const Login = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthProvider);
    const queryClient = useQueryClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginMutation = useMutation({
        mutationFn: async (credentials: any) => {
            const { data } = await axiosInstance.post('/auth/login', credentials);
            return data.data;
        },
        onSuccess: (data) => {
            if (auth?.setToken) {
                auth.setToken(data.accessToken);
            } else {
                localStorage.setItem('accessToken', data.accessToken);
            }

            queryClient.clear();

            toast.success('Authenticated successfully! Redirecting...', {
                style: {
                    background: '#f0fdf4',
                    color: '#166534',
                    borderColor: '#bbf7d0'
                }
            });
            setTimeout(() =>{
                 navigate('/');
                 window.location.reload();
            }, 1000);
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Authentication failed!';
            toast.error(errorMessage, {
                style: {
                    background: '#fef2f2',
                    color: '#991b1b',
                    borderColor: '#fecaca'
                }
            });
        },
    });

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ email, password });
    };

    return (
        <div>
            <Toaster position="top-right" richColors={false}></Toaster>
            <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-slate-800/60 relative z-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl shadow-xl shadow-indigo-500/20 mb-4 ring-1 ring-white/10">
                            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Classic IT ERP</h2>
                        <p className="text-sm text-slate-400 mt-2">Inventory & Sales Management System</p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-300">Enterprise Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    className="w-full bg-slate-800/80 text-white border border-slate-700/60 rounded-xl px-4 py-2.5 outline-none focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder:text-slate-500 transition"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-300">Account Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-slate-800/80 text-white border border-slate-700/60 rounded-xl px-4 py-2.5 outline-none focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder:text-slate-500 transition"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full relative flex items-center justify-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] text-white font-semibold rounded-xl shadow-xl shadow-indigo-500/20 focus:outline-none transition-all disabled:opacity-50 disabled:pointer-events-none text-sm tracking-wide border border-indigo-400/20"
                            >
                                {loginMutation.isPending ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Secure Sign In'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-800/40 text-center">
                        <p className="text-xs text-slate-500 font-medium">
                            Authorized personnel only. Activities are standardly monitored.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;