'use client';

import { ListWithCards } from '@/types';
import { ListHeader } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-header';
import { ElementRef, useRef, useState } from 'react';
import { CardForm } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/card-form';
import { cn } from '@/lib/utils';
import { CardItem } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/card-item';
import { Draggable, Droppable } from '@hello-pangea/dnd';

type ListItemProps = {
    index: number;
    data: ListWithCards;
};

export const ListItem = ({ data, index }: ListItemProps) => {
    const textareaRef = useRef<ElementRef<'textarea'>>(null);
    const [isEditing, setIsEditing] = useState(false);

    const disableEditing = () => {
        setIsEditing(false);
    };

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textareaRef.current?.focus();
        });
    };

    return (
        <Draggable draggableId={data.id} index={index}>
            {provided => {
                return (
                    <li
                        className='h-full w-[272px] shrink-0 select-none'
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                    >
                        <div
                            className='w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md'
                            {...provided.dragHandleProps}
                        >
                            <ListHeader onAddCard={enableEditing} data={data} />
                            <Droppable droppableId={data.id} type='card'>
                                {provided => (
                                    <ol
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={cn(
                                            'mx-1 flex flex-col gap-y-2 px-1 py-0.5',
                                            data.cards.length > 0 ? 'mt-2' : 'mt-0'
                                        )}
                                    >
                                        {data.cards.map((card, index) => {
                                            return (
                                                <CardItem index={index} key={card.id} data={card} />
                                            );
                                        })}
                                        {provided.placeholder}
                                    </ol>
                                )}
                            </Droppable>
                            <CardForm
                                listId={data.id}
                                ref={textareaRef}
                                isEditing={isEditing}
                                enableEditing={enableEditing}
                                disableEditing={disableEditing}
                            />
                        </div>
                    </li>
                );
            }}
        </Draggable>
    );
};
