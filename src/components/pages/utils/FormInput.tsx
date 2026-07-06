import { useFormContext } from "react-hook-form";

type TFormInputProps = {
    name: string;
    type?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
};

const FormInput = ({ name, type = 'text', label, placeholder, required = false }: TFormInputProps) => {
    const { register, formState: { errors } } = useFormContext();
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                {...register(name, { required: required ? `${label || name} is required` : false })}
                className={`w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
            />
            {errors[name] && (
                <p className="mt-1 text-xs text-red-600">{errors[name]?.message as string}</p>
            )}
        </div>
    );
};

export default FormInput;