'use client';

import { List } from '@prisma/client';
import { ElementRef, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import { FormInput } from '@/components/form/form-input';
import { useAction } from '@/hooks/use-action';
import { updateList } from '@/actions/update-list';
import { toast } from 'sonner';
import { ListOptions } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-options';

type ListHeaderProps = {
    data: List;
    onAddCard: () => void;
};

export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
    const [title, setTitle] = useState(data.title);
    const [isEditing, setIsEditing] = useState(false);
    const { execute } = useAction(updateList, {
        onSuccess: data => {
            toast.success(`Rename to "${data.title}"`);
            setTitle(data.title);
            disableEditing();
        },
        onError: toast.error,
    });

    const handleSubmit = (formData: FormData) => {
        const title = formData.get('title') as string;
        const id = formData.get('id') as string;
        const boardId = formData.get('boardId') as string;

        if (title === data.title) {
            return disableEditing();
        }

        execute({ title, id, boardId });
    };

    const formRef = useRef<ElementRef<'form'>>(null);
    const inputRef = useRef<ElementRef<'input'>>(null);

    const onBlur = () => {
        formRef.current?.requestSubmit();
    };

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            formRef.current?.requestSubmit();
        }
    };

    useEventListener('keydown', onKeyDown);

    return (
        <div className='flex items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold'>
            {isEditing ? (
                <form className='flex-1 px-[2px]' ref={formRef} action={handleSubmit}>
                    <input hidden name='id' value={data.id} />
                    <input hidden name='boardId' value={data.boardId} />
                    <FormInput
                        className='h-7 truncate border-transparent bg-transparent px-[7px] py-1 text-sm font-medium transition hover:border-input focus:border-input'
                        ref={inputRef}
                        id='title'
                        onBlur={onBlur}
                        placeholder='Enter list title...'
                        defaultValue={title}
                    />
                    <button type='submit' hidden />
                </form>
            ) : (
                <div
                    className='h-7 w-full border-transparent px-2.5 py-1 text-sm font-medium'
                    onClick={enableEditing}
                >
                    {data.title}
                </div>
            )}
            <ListOptions data={data} onAddCard={onAddCard} />
        </div>
    );
};
