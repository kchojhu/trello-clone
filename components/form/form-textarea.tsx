'use client';

import { forwardRef, KeyboardEventHandler } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { cn } from '@/lib/utils';
import { FormErrors } from '@/components/form/form-errors';
import { useFormStatus } from 'react-dom';

type FormTextareaProps = {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    className?: string;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
    defaultValue?: string;
};

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    (
        {
            id,
            errors,
            className,
            defaultValue,
            onBlur,
            onKeyDown,
            label,
            onClick,
            required,
            disabled,
            placeholder,
        },
        ref
    ) => {
        const { pending } = useFormStatus();
        return (
            <div className='w-full space-y-2'>
                <div className='w-full space-y-1'>
                    {label && (
                        <Label className='text-xs font-semibold text-neutral-700'>${label}</Label>
                    )}
                    <Textarea
                        onKeyDown={onKeyDown}
                        onClick={onClick}
                        ref={ref}
                        required={required}
                        placeholder={placeholder}
                        name={id}
                        id={id}
                        disabled={pending || disabled}
                        className={cn(
                            'resize-none shadow-sm outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
                            className
                        )}
                        aria-describedby={`${id}-error`}
                        defaultValue={defaultValue}
                    />
                </div>
                <FormErrors id={id} errors={errors} />
            </div>
        );
    }
);

FormTextarea.displayName = 'FormTextarea';
