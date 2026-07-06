import { useState } from "react";
import { useGetUsers, useRegisterUser } from "../../utils/userUser";
import FormWrapper from "../../utils/FormWrapper";
import FormInput from "../../utils/FormInput";
import FormSelect from "../../utils/FormSelect";
import SearchInput from "../../utils/SearchInput";
import { Toaster } from "sonner";

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: userResponse, isLoading } = useGetUsers({ searchTerm });
    const registerMutation = useRegisterUser();

    const roleOptions = [
        { label: 'MANAGER', value: 'MANAGER' },
        { label: 'EMPLOYEE', value: 'EMPLOYEE' },
    ];

    const handleFormSubmit = (data: any) => {
        registerMutation.mutate(data);
    };
    return (
        <div className="bg-gray-50 min-h-screen ">
            <Toaster position="top-right" richColors></Toaster>
            <div className=" bg-white p-6 shadow-md rounded-xl border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create System User</h2>

                <FormWrapper onSubmit={handleFormSubmit} defaultValues={{ role: 'Employee' }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput name="name" label="Full Name" placeholder="John Doe" required={true} />
                        <FormInput name="email" type="email" label="Email Address" placeholder="john@example.com" required={true} />
                        <FormInput name="password" type="password" label="Password" placeholder="******" required={true} />
                        <FormSelect name="role" label="System Role" options={roleOptions} required={true} />
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow transition disabled:bg-gray-400"
                        >
                            {registerMutation.isPending ? 'Registering...' : 'Register User'}
                        </button>
                    </div>
                </FormWrapper>
            </div>

            <div className="bg-white p-6 shadow-md rounded-xl border border-gray-200 mt-7">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-800">System Users</h2>
                    <SearchInput onSearch={(val) => setSearchTerm(val)} placeholder="Search users by name or email..." />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Loading users...</td>
                                </tr>
                            ) : userResponse?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No users found</td>
                                </tr>
                            ) : (
                                userResponse?.data?.map((user: any) => (
                                    <tr key={user._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-950">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : user.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
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

export default UserManagement;