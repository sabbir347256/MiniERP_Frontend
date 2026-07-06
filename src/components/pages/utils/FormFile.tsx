import { useFormContext } from 'react-hook-form';

type TFormFileProps = {
    name: string;
    label?: string;
    required?: boolean;
};


const FormFile = ({ name, label, required = false }: TFormFileProps) => {
    const { register, formState: { errors } } = useFormContext();
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <input
                type="file"
                accept="image/*"
                {...register(name, { required: required ? `${label || name} is required` : false })}
                className={`w-full px-3 py-1.5 border rounded-md text-sm shadow-sm bg-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${errors[name] ? 'border-red-500' : 'border-gray-300'
                    }`}
            />
            {errors[name] && (
                <p className="mt-1 text-xs text-red-600">{errors[name]?.message as string}</p>
            )}
        </div>
    );
};

export default FormFile;