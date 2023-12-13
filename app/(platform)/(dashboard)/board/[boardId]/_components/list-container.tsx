'use client';

import { ListWithCards } from '@/types';
import { ListForm } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-form';
import { useEffect, useState } from 'react';
import { ListItem } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-item';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAction } from '@/hooks/use-action';
import { toast } from 'sonner';
import { updateListOrder } from '@/actions/update-list-order';
import { updateCardOrder } from '@/actions/update-card-order';

type ListContainerProps = {
    data: ListWithCards[];
    boardId: string;
};

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data);

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success('List reordered');
        },
        onError: error => toast.error,
    });

    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success('Card reordered');
        },
        onError: error => toast.error,
    });

    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    const onDragEnd = (result: any) => {
        const { destination, source, type } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index)
            return;

        if (type === 'list') {
            const items = reorder(orderedData, source.index, destination.index).map(
                (item, index) => {
                    return {
                        ...item,
                        order: index,
                    };
                }
            );

            setOrderedData(items);
            executeUpdateListOrder({
                items,
                boardId,
            });
        }

        if (type === 'card') {
            let newOrderedData = [...orderedData];

            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destinationList = newOrderedData.find(
                list => list.id === destination.droppableId
            );

            if (!sourceList || !destinationList) return;

            if (!sourceList.cards) {
                sourceList.cards = [];
            }

            if (!destinationList.cards) {
                destinationList.cards = [];
            }

            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(sourceList.cards, source.index, destination.index);

                reorderedCards.forEach((card, index) => {
                    card.order = index;
                });

                sourceList.cards = reorderedCards;

                setOrderedData(newOrderedData);
                executeUpdateCardOrder({ boardId, items: reorderedCards });
            } else {
                const [movedCard] = sourceList.cards.splice(source.index, 1);

                movedCard.listId = destination.droppableId;
                destinationList.cards.splice(destination.index, 0, movedCard);

                sourceList.cards.forEach((card, index) => {
                    card.order = index;
                });

                destinationList.cards.forEach((card, index) => {
                    card.order = index;
                });

                setOrderedData(newOrderedData);

                executeUpdateCardOrder({ boardId, items: destinationList.cards });
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='list' type='list' direction='horizontal'>
                {provided => (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className='flex h-full gap-x-4'
                    >
                        {orderedData.map((list, index) => {
                            return <ListItem key={list.id} index={index} data={list} />;
                        })}
                        {provided.placeholder}
                        <ListForm />
                        <div className='w-1 flex-shrink-0'></div>
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    );
};
