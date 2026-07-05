import { useFormContext } from "react-hook-form";

type TOption = {
    label: string;
    value: string;
};

type TFormSelectProps = {
    name: string;
    label?: string;
    options: TOption[];
    required?: boolean;
};

const FormSelect = ({ name, label, options, required = false }: TFormSelectProps) => {
    const { register, formState: { errors } } = useFormContext();
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                {...register(name, { required: required ? `${label || name} is required` : false })}
                className={`w-full px-3 py-2 border bg-white rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
            >
                <option value="">Select Option</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {errors[name] && (
                <p className="mt-1 text-xs text-red-600">{errors[name]?.message as string}</p>
            )}
        </div>
    );
};

export default FormSelect;