'use client';

import { createBoard } from '@/actions/create-board';
import { FormInput } from '@/components/form/form-input';
import { FormSubmit } from '@/components/form/form-submit';
import { useAction } from '@/hooks/use-action';

export const Form = () => {
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess(data) {
            console.log(data, 'SUCCESS');
        },
        onError(error) {
            console.error(error);
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get('title') as string;
        const image = formData.get('image') as string;

        execute({ title, image });
    };

    return (
        <form action={onSubmit}>
            <div className='flex flex-col space-y-2'>
                <FormInput label='Board Title' errors={fieldErrors} id='title' />
            </div>
            <FormSubmit>Save</FormSubmit>
        </form>
    );
};
