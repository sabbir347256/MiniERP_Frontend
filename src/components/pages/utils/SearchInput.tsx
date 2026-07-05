import { useEffect, useState } from "react";

type TSearchInputProps = {
    onSearch: (value: string) => void;
    placeholder?: string;
};


const SearchInput = ({ onSearch, placeholder = 'Search...' }: TSearchInputProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            onSearch(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, onSearch]);
    return (
        <div className="relative max-w-md w-full">
            <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-700"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default SearchInput;