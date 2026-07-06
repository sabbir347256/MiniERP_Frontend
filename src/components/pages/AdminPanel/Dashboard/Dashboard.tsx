import { useContext } from 'react';
import { AuthProvider } from '../../../AuthProvider/CreateContext';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../utils/axiosInstance';

const Dashboard = () => {
    const auth = useContext(AuthProvider);

    const { data: statsRes, isLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const { data } = await axiosInstance.get('/dashboard/stats', {
                headers: { Authorization: `Bearer ${auth?.token}` },
            });
            return data?.data;
        },
    });
    return (
        <div className=" bg-slate-50 min-h-screen space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Products</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">
                            {isLoading ? '...' : statsRes?.totalProducts}
                        </h3>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Sales Revenue</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">
                            {isLoading ? '...' : `$${statsRes?.totalSales?.toFixed(2)}`}
                        </h3>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 14a2 2 0 110-4h4m-4 4v1m0-1H8" />
                        </svg>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Low Stock Alert</p>
                        <h3 className="text-3xl font-bold text-rose-600 mt-1">
                            {isLoading ? '...' : statsRes?.lowStockProducts?.length}
                        </h3>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-lg text-rose-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Critical Low Stock Control</h2>
                    <p className="text-xs text-gray-500">Items requires immediate replenishment action state (Stock &lt; 5)</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Pool</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Aggregating warehouse stock registers...
                                    </td>
                                </tr>
                            ) : statsRes?.lowStockProducts?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-emerald-600 font-medium">
                                        All matrix clear. No low stock parameters detected.
                                    </td>
                                </tr>
                            ) : (
                                statsRes?.lowStockProducts?.map((prod: any) => (
                                    <tr key={prod._id} className="text-sm text-gray-700 hover:bg-rose-50/20 transition">
                                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                                            <img src={prod.productImage} className="w-10 h-10 object-cover rounded-md border border-gray-200" alt="" />
                                            <span className="font-semibold text-gray-900">{prod.name}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-500">{prod.sku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{prod.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">${prod.sellingPrice}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-rose-600 bg-rose-50/50 text-center rounded-md">
                                            {prod.stockQuantity} Units
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;