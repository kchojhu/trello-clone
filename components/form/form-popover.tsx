'use client';

import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '../ui/popover';
import { FormInput } from './form-input';
import { FormSubmit } from './form-submit';
import { createBoard } from '@/actions/create-board';
import { useAction } from '@/hooks/use-action';
import { toast } from 'sonner';
import { FormPicker } from './form-picker';
import { ElementRef, useRef } from 'react';
import { useRouter } from 'next/navigation';

type FormPopoverPros = {
    children: React.ReactNode;
    side?: 'left' | 'right' | 'top' | 'bottom';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
};

export const FormPopover = ({
    children,
    align,
    side = 'bottom',
    sideOffset = 0,
}: FormPopoverPros) => {
    const closeRef = useRef<ElementRef<'button'>>(null);
    const router = useRouter();

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: data => {
            toast.success('Board created!');
            closeRef.current?.click();
            router.push(`/board/${data.id}`);
        },
        onError: error => {
            console.log({ error });
            toast.error(error);
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get('title') as string;
        const image = formData.get('image') as string;

        execute({ title, image });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent align={align} className='w-80 pt-3' side={side} sideOffset={sideOffset}>
                <div className='pb-4 text-center text-sm font-medium text-neutral-600'>
                    Create Board
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button
                        className='absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600 outline outline-transparent'
                        variant='ghost'
                    >
                        <X className='h-4 w-4' />
                    </Button>
                </PopoverClose>
                <form action={onSubmit} className='space-y-4'>
                    <div className='space-y-4'>
                        <FormPicker id='image' errors={fieldErrors} />
                        <FormInput
                            id='title'
                            label='Board title'
                            type='text'
                            errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit className='w-full'>Create</FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
};
