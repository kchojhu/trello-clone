import React from 'react';
import { NavBar } from './_components/navbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-full w-full'>
            <NavBar />
            {children}
        </div>
    );
};

export default DashboardLayout;
