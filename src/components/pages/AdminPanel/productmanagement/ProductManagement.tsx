import { useState } from "react";
import { useCreateProduct, useDeleteProduct, useGetProducts, useUpdateProduct } from "../../utils/productquery";
import FormWrapper from "../../utils/FormWrapper";
import FormInput from "../../utils/FormInput";
import SearchInput from "../../utils/SearchInput";

const ProductManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: productRes, isLoading } = useGetProducts({ searchTerm, page, limit: 5 });
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const handleFormSubmit = (data: any) => {
    if (editingId) {
      updateProductMutation.mutate({ id: editingId, payload: data }, {
        onSuccess: () => setEditingId(null)
      });
    } else {
      createProductMutation.mutate(data);
    }
  };
    return (
       <div className="p-6 bg-slate-50 min-h-screen space-y-8">
      <div className="max-w-5xl mx-auto bg-white p-6 shadow-md rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{editingId ? 'Modify Product' : 'Add New Product'}</h2>
        <FormWrapper onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput name="name" label="Product Name" placeholder="Asset item name" required={true} />
            <FormInput name="sku" label="Unique SKU" placeholder="STOCK-ID-GEN" required={true} />
            <FormInput name="category" label="Category" placeholder="Hardware/Raw" required={true} />
            <FormInput name="purchasePrice" type="number" label="Purchase Price" placeholder="0.00" required={true} />
            <FormInput name="sellingPrice" type="number" label="Selling Price" placeholder="0.00" required={true} />
            <FormInput name="stockQuantity" type="number" label="Initial Stock" placeholder="Units" required={true} />
            <div className="md:col-span-3">
              <FormInput name="productImage" label="Product Image URL" placeholder="https://cdn-address.com/img.png" required={true} />
            </div>
          </div>
          <button type="submit" className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium text-sm transition">
            Save Operational Data
          </button>
        </FormWrapper>
      </div>

      <div className="max-w-5xl mx-auto bg-white p-6 shadow-md rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">Operational Inventory</h2>
          <SearchInput onSearch={(val) => { setSearchTerm(val); setPage(1); }} placeholder="Search tracking index..." />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing (Buy/Sell)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Retrieving ledger database state...</td></tr>
              ) : (
                productRes?.data?.map((prod: any) => (
                  <tr key={prod._id} className="text-sm text-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                      <img src={prod.productImage} className="w-10 h-10 object-cover rounded-md border border-gray-200" alt="" />
                      <span className="font-semibold text-gray-900">{prod.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-500">{prod.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{prod.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${prod.purchasePrice} / ${prod.sellingPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">{prod.stockQuantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button onClick={() => setEditingId(prod._id)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                      <button onClick={() => deleteProductMutation.mutate(prod._id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded text-sm disabled:opacity-40">Prev</button>
          <span className="text-sm text-gray-600">Page {page} of {productRes?.meta?.totalPage || 1}</span>
          <button disabled={page >= (productRes?.meta?.totalPage || 1)} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded text-sm disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
    );
};

export default ProductManagement;