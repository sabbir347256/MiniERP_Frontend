import { useContext, useEffect, useState } from "react";
import { useGetProducts } from "../../utils/productquery";
import { toast, Toaster } from "sonner";
import axiosInstance from "../../utils/axiosInstance";
import { AuthProvider } from "../../../AuthProvider/CreateContext";

const Sales = () => {
    const auth = useContext(AuthProvider);
    const { data: productRes } = useGetProducts({ limit: 100 });
    const [basket, setBasket] = useState<{ productId: string; name: string; quantity: number; price: number; stock: number }[]>([]);
    const [grandTotal, setGrandTotal] = useState(0);

    useEffect(() => {
        const total = basket.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setGrandTotal(total);
    }, [basket]);

    const addToBasket = (productId: string) => {
        if (!productId) return;
        const selected = productRes?.data?.find((p: any) => p._id === productId);
        if (!selected) return;

        if (basket.find(item => item.productId === productId)) {
            toast.warning('Product already added to line sequence');
            return;
        }

        setBasket([...basket, {
            productId: selected._id,
            name: selected.name,
            quantity: 1,
            price: selected.sellingPrice,
            stock: selected.stockQuantity
        }]);
    };

    const updateBasketQuantity = (index: number, quantity: number) => {
        const target = basket[index];
        if (quantity > target.stock) {
            toast.error('Requested execution exceeds warehouse parameters');
            return;
        }
        const updated = [...basket];
        updated[index].quantity = Math.max(1, quantity);
        setBasket(updated);
    };

    const executeSaleTransaction = async () => {
        if (!basket.length) return;
        try {
            const payload = {
                products: basket.map(({ productId, quantity }) => ({ productId, quantity }))
            };
            const { data } = await axiosInstance.post('/sales', payload, {
                headers: {
                    'Authorization': `Bearer ${auth?.token || ''}`
                }
            });
            toast.success(data?.message || 'Transaction executed and localized');
            setBasket([]);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Transaction processing aborted');
        }
    };
    return (
        <div>
            <Toaster richColors position="top-right" />

            <div className=" bg-slate-50 min-h-screen grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="md:col-span-1 bg-white p-6 shadow-md rounded-xl border border-gray-200 h-fit">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Pipeline Registration</h2>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Dispatch Item</label>
                    <select onChange={(e) => addToBasket(e.target.value)} className="w-full px-3 py-2 border bg-white border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="">-- Direct Inventory Pull --</option>
                        {productRes?.data?.map((p: any) => (
                            <option key={p._id} value={p._id} disabled={p.stockQuantity <= 0}>
                                {p.name} (${p.sellingPrice}) - Stock: {p.stockQuantity}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2 bg-white p-6 shadow-md rounded-xl border border-gray-200 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Manifest Statement</h2>
                        <div className="space-y-4">
                            {basket.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-12">No inventory elements staged for checkout.</p>
                            ) : (
                                basket.map((item, index) => (
                                    <div key={item.productId} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                                            <p className="text-xs text-gray-500">Unit Val: ${item.price} | Maximum Allocation: {item.stock}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input type="numbeFr" min="1" max={item.stock} value={item.quantity} onChange={(e) => updateBasketQuantity(index, Number(e.target.value))} className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm" />
                                            <span className="font-mono font-bold text-sm text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 mt-6">
                        <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-4">
                            <span>Aggregated Gross Liability:</span>
                            <span className="font-mono text-2xl text-indigo-600">${grandTotal.toFixed(2)}</span>
                        </div>
                        <button onClick={executeSaleTransaction} disabled={!basket.length} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-lg font-semibold tracking-wide transition shadow-md shadow-indigo-600/10">
                            Commit Invoice Execution
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sales;