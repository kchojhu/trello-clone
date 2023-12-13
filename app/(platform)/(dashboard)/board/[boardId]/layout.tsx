import { auth } from '@clerk/nextjs';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { BoardNavbar } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/board-navbar';

export async function generateMetadata({ params: { boardId } }: { params: { boardId: string } }) {
    const { orgId } = auth();

    if (!orgId) {
        return {
            title: 'Board',
        };
    }

    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId,
        },
    });

    return {
        title: board?.title || 'Board',
    };
}

const BoardIdLayout = async ({
    children,
    params: { boardId },
}: {
    children: React.ReactNode;
    params: { boardId: string };
}) => {
    const { orgId } = auth();

    if (!orgId) {
        redirect('/select-org');
    }

    const board = await db.board.findUnique({
        where: {
            id: boardId,
            orgId,
        },
    });

    if (!board) {
        return notFound();
    }

    return (
        <div
            className='relative h-full bg-cover bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${board.imageFullUrl})` }}
        >
            <BoardNavbar data={board} />
            <div className='absolute inset-0 bg-black/10' />
            <main className='relative h-full pt-28'>
                <div>{children}</div>
            </main>
        </div>
    );
};

export default BoardIdLayout;
