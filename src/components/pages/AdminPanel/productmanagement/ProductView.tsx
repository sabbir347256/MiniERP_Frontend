import { useState } from "react";
import { useGetProducts } from "../../utils/productquery";
import SearchInput from "../../utils/SearchInput";

const ProductView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<any>(null); 

    const { data: productRes, isLoading } = useGetProducts({ searchTerm, page, limit: 6 });
    return (
        <div className=" bg-slate-50 min-h-screen space-y-6">
            <div className=" flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 shadow-sm rounded-xl border border-gray-200">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Product Catalog</h2>
                    <p className="text-xs text-gray-500">View current organization inventory assets</p>
                </div>
                <SearchInput onSearch={(val) => { setSearchTerm(val); setPage(1); }} placeholder="Search products..." />
            </div>

            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <p className="col-span-full text-center text-sm text-gray-500 py-12">Loading inventory matrix...</p>
                ) : productRes?.data?.length === 0 ? (
                    <p className="col-span-full text-center text-sm text-gray-400 py-12">No products found matching criteria.</p>
                ) : (
                    productRes?.data?.map((prod: any) => (
                        <div
                            key={prod._id}
                            onClick={() => setSelectedProduct(prod)} 
                            className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition cursor-pointer group"
                        >
                            <div>
                                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                                    <img
                                        src={prod.productImage}
                                        alt={prod.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    <span className="absolute top-2 right-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded border border-indigo-100">
                                        {prod.category}
                                    </span>
                                </div>
                                <div className="p-4 space-y-2">
                                    <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-indigo-600 transition">
                                        {prod.name}
                                    </h3>
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

            <div className=" flex justify-between items-center pt-4 border-t border-gray-200">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-white border rounded text-sm disabled:opacity-40 transition">Prev</button>
                <span className="text-sm text-gray-600">Page {page} of {productRes?.meta?.totalPage || 1}</span>
                <button disabled={page >= (productRes?.meta?.totalPage || 1)} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-white border rounded text-sm disabled:opacity-40 transition">Next</button>
            </div>

            {selectedProduct && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 relative space-y-6 overflow-hidden animate-in fade-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 bg-gray-100 text-gray-500 hover:text-gray-800 p-1.5 rounded-full transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="w-full h-56 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                            <img src={selectedProduct.productImage} alt={selectedProduct.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-indigo-100">
                                    {selectedProduct.category}
                                </span>
                                <h3 className="text-xl font-bold text-gray-900 mt-2">{selectedProduct.name}</h3>
                                <p className="text-xs font-mono text-gray-400 mt-0.5">SKU Parameter: {selectedProduct.sku}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-xs text-gray-400 block font-medium">Purchase Cost</span>
                                    <span className="text-base font-bold text-gray-700">${selectedProduct.purchasePrice}</span>
                                </div>
                                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/40">
                                    <span className="text-xs text-indigo-500 block font-medium">Selling Valuation</span>
                                    <span className="text-base font-bold text-indigo-600">${selectedProduct.sellingPrice}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm font-medium text-gray-500">Available Warehouse Stock:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedProduct.stockQuantity < 5
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    }`}>
                                    {selectedProduct.stockQuantity} Units Left
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductView;