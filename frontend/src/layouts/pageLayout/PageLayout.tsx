import React from 'react';
import Header from '../../components/header/Header';
import './pageLayout.css'

const PageLayout = ( {children, tab } : { children: React.ReactNode, tab: string} ) => {
    return (
        <div className='PageLayout'>
            <Header selectedTab={tab}></Header>
            <main className='PageLayout-content'>
                {children}
            </main>
        </div>
    );
};

export default PageLayout;