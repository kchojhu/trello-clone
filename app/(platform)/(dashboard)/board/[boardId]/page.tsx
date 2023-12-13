import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ListContainer } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-container';
import { List } from '@prisma/client';

type BoardIdPageProps = {
    params: {
        boardId: string;
    };
};

const BoardIdPage = async ({ params: { boardId } }: BoardIdPageProps) => {
    const { orgId } = auth();

    if (!orgId) {
        redirect('/select-org');
    }

    const lists = await db.list.findMany({
        where: {
            boardId,
            board: {
                orgId,
            },
        },
        include: {
            cards: {
                orderBy: {
                    order: 'asc',
                },
            },
        },
        orderBy: {
            order: 'asc',
        },
    });

    return (
        <div className='h-full overflow-x-auto p-4'>
            <ListContainer boardId={boardId} data={lists} />
        </div>
    );
};

export default BoardIdPage;
