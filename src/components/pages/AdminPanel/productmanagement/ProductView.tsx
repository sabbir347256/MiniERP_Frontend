import { useState } from "react";
import { useGetProducts } from "../../utils/productquery";
import SearchInput from "../../utils/SearchInput";

const ProductView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    const { data: productRes, isLoading } = useGetProducts({ searchTerm, page, limit: 6 });
    return (
        <div className=" bg-slate-50 min-h-screen space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 shadow-sm rounded-xl border border-gray-200">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Product Catalog</h2>
                    <p className="text-xs text-gray-500">View current organization inventory assets</p>
                </div>
                <SearchInput onSearch={(val) => { setSearchTerm(val); setPage(1); }} placeholder="Search products..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <p className="col-span-full text-center text-sm text-gray-500 py-12">Loading inventory matrix...</p>
                ) : productRes?.data?.length === 0 ? (
                    <p className="col-span-full text-center text-sm text-gray-400 py-12">No products found matching criteria.</p>
                ) : (
                    productRes?.data?.map((prod: any) => (
                        <div key={prod._id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition">
                            <div>
                                <div className="relative w-full h-48 bg-gray-100">
                                    <img src={prod.productImage} alt={prod.name} className="w-full h-full object-cover" />
                                    <span className="absolute top-2 right-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded border border-indigo-100">
                                        {prod.category}
                                    </span>
                                </div>
                                <div className="p-4 space-y-2">
                                    <h3 className="font-bold text-gray-900 text-base line-clamp-1">{prod.name}</h3>
                                    <p className="text-xs font-mono text-gray-400">SKU: {prod.sku}</p>
                                    <div className="pt-2 flex justify-between items-center border-t border-gray-100">
                                        <div>
                                            <span className="text-xs text-gray-400 block">Retail Price</span>
                                            <span className="text-lg font-bold text-indigo-600">${prod.sellingPrice}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs text-gray-400 block">Available Stock</span>
                                            <span className={`text-sm font-bold ${prod.stockQuantity < 5 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                {prod.stockQuantity} Units
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="max-w-6xl mx-auto flex justify-between items-center pt-4 border-t border-gray-200">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-white border rounded text-sm disabled:opacity-40 transition">Prev</button>
                <span className="text-sm text-gray-600">Page {page} of {productRes?.meta?.totalPage || 1}</span>
                <button disabled={page >= (productRes?.meta?.totalPage || 1)} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-white border rounded text-sm disabled:opacity-40 transition">Next</button>
            </div>
        </div>
    );
};

export default ProductView;