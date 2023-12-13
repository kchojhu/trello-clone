'use client';

import { ElementRef, forwardRef, KeyboardEventHandler, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { FormTextarea } from '@/components/form/form-textarea';
import { FormSubmit } from '@/components/form/form-submit';
import { useAction } from '@/hooks/use-action';
import { createCard } from '@/actions/create-card';
import { useParams } from 'next/navigation';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { toast } from 'sonner';

type CardFormProps = {
    listId: string;
    enableEditing: () => void;
    disableEditing: () => void;
    isEditing: boolean;
};

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
    ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
        const { execute, fieldErrors } = useAction(createCard, {
            onSuccess: data => {
                toast.success(`Card "${data.title}" created`);
                console.log('success');
                formRef.current?.reset();
            },
            onError: toast.error,
        });
        const params = useParams();
        const formRef = useRef<ElementRef<'form'>>(null);
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                disableEditing();
            }
        };

        useOnClickOutside(formRef, disableEditing);
        useEventListener('keydown', onKeyDown);

        const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
            }
        };

        const onSubmit = (formData: FormData) => {
            const title = formData.get('title') as string;
            const boardId = params.boardId as string;
            const listId = formData.get('listId') as string;

            execute({ title, boardId, listId });
        };

        if (isEditing) {
            return (
                <form ref={formRef} action={onSubmit} className='m-1 space-y-4 px-1 py-0.5'>
                    <FormTextarea
                        id='title'
                        onClick={() => {}}
                        onKeyDown={onTextareaKeyDown}
                        placeholder='Enter a title for this card...'
                        errors={fieldErrors}
                    />
                    <input hidden readOnly name='listId' value={listId} />
                    <div className='flex items-center gap-x-1'>
                        <FormSubmit>Add card</FormSubmit>
                        <Button onClick={disableEditing} size='sm' variant='ghost'>
                            <X className='h-5 w-5' />
                        </Button>
                    </div>
                </form>
            );
        }

        return (
            <div className='px-2 pt-2'>
                <Button
                    onClick={enableEditing}
                    className='h-auto w-full justify-start px-2 py-1.5 text-sm text-muted-foreground'
                    size='sm'
                    variant='ghost'
                >
                    <Plus className='h-4 w-4' /> Add a card
                </Button>
            </div>
        );
    }
);

CardForm.displayName = 'CardForm';
