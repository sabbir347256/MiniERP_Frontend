import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

type TFormWrapperProps = {
    children: React.ReactNode;
    onSubmit: SubmitHandler<any>;
    defaultValues?: Record<string, any>;
};

const FormWrapper = ({ children, onSubmit, defaultValues }: TFormWrapperProps) => {
    const methods = useForm({ defaultValues });
    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                {children}
            </form>
        </FormProvider>
    );
};

export default FormWrapper;