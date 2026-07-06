import { useContext, useState } from "react";
import { useDeleteProduct, useGetProducts } from "../../utils/productquery";
import FormWrapper from "../../utils/FormWrapper";
import FormInput from "../../utils/FormInput";
import SearchInput from "../../utils/SearchInput";
import axiosInstance from "../../utils/axiosInstance";
import { toast, Toaster } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import FormFile from "../../utils/FormFile";
import { AuthProvider } from "../../../AuthProvider/CreateContext";

const ProductManagement = () => {
  const auth = useContext(AuthProvider);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [formDefaultValues, setFormDefaultValues] = useState<any>({
    name: '',
    sku: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    stockQuantity: ''
  });

  const { data: productRes, isLoading } = useGetProducts({ searchTerm, page, limit: 5 });
  const deleteProductMutation = useDeleteProduct();

  const handleEditClick = (prod: any) => {
    setEditingId(prod._id);
    setExistingImage(prod.productImage);
    setFormDefaultValues({
      name: prod.name,
      sku: prod.sku,
      category: prod.category,
      purchasePrice: prod.purchasePrice,
      sellingPrice: prod.sellingPrice,
      stockQuantity: prod.stockQuantity
    });
  };

  const handleRemoveExistingImage = () => {
    setExistingImage(null);
  };

  const handleFormSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('sku', data.sku);
      formData.append('category', data.category);
      formData.append('purchasePrice', data.purchasePrice);
      formData.append('sellingPrice', data.sellingPrice);
      formData.append('stockQuantity', data.stockQuantity);

      if (data.file && data.file[0]) {
        formData.append('file', data.file[0]);
      } else if (editingId && existingImage) {
        formData.append('productImage', existingImage);
      }

      if (editingId) {
        if (!existingImage && (!data.file || !data.file[0])) {
          toast.error('Image is required. Please upload a new image.');
          setLoading(false);
          return;
        }

        const res = await axiosInstance.patch(`/product/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${auth?.token}` }
        });
        toast.success(res.data?.message || 'Product updated successfully');
        setEditingId(null);
        setExistingImage(null);
        setFormDefaultValues({ name: '', sku: '', category: '', purchasePrice: '', sellingPrice: '', stockQuantity: '' });
      } else {
        if (!data.file || !data.file[0]) {
          toast.error('Image upload is required while creating a product.');
          setLoading(false);
          return;
        }
        const res = await axiosInstance.post('/product', formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${auth?.token}` }
        });
        toast.success(res.data?.message || 'Product created successfully');
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-slate-50 min-h-screen">
      <Toaster richColors position="top-right" />
      <div className="   bg-white p-6 shadow-md rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">{editingId ? 'Modify Product' : 'Add New Product'}</h2>
        <FormWrapper onSubmit={handleFormSubmit} defaultValues={formDefaultValues} key={editingId || 'create'}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput name="name" label="Product Name" placeholder="Asset item name" required={true} />
            <FormInput name="sku" label="Unique SKU" placeholder="STOCK-ID-GEN" required={true} />
            <FormInput name="category" label="Category" placeholder="Hardware/Raw" required={true} />
            <FormInput name="purchasePrice" type="number" label="Purchase Price" placeholder="0.00" required={true} />
            <FormInput name="sellingPrice" type="number" label="Selling Price" placeholder="0.00" required={true} />
            <FormInput name="stockQuantity" type="number" label="Initial Stock" placeholder="Units" required={true} />

            <div className="md:col-span-3">
              {editingId && existingImage ? (
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Product Image</label>
                  <div className="relative w-32 h-32 border rounded-md overflow-hidden bg-gray-100 group">
                    <img src={existingImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveExistingImage}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition shadow"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <FormFile name="file" label="Product Image File" required={!editingId} />
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={loading} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium text-sm transition disabled:bg-gray-400">
              {loading ? 'Processing Operation...' : 'Save Operational Data'}
            </button>
            {editingId && (
              <button type="button" onClick={() => {
                setEditingId(null);
                setExistingImage(null);
                setFormDefaultValues({ name: '', sku: '', category: '', purchasePrice: '', sellingPrice: '', stockQuantity: '' });
              }} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium text-sm transition">
                Cancel
              </button>
            )}
          </div>
        </FormWrapper>
      </div>

      <div className="   bg-white p-6 shadow-md rounded-xl border border-gray-200 mt-7">
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
                      <button onClick={() => handleEditClick(prod)} className="text-indigo-600 hover:text-indigo-900 font-medium cursor-pointer">Edit</button>
                      <button onClick={() => deleteProductMutation.mutate(prod._id)} className="text-red-600 hover:text-red-900 font-medium cursor-pointer">Delete</button>
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