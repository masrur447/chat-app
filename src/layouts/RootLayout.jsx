import React from 'react'
import Navbar from '../components/navbar/Index'
import { Outlet } from 'react-router-dom'

function RootLayout() {
    return (
        <>
            <div className='relative w-full h-screen'>
                <div className="w-full bg-primary h-[400px]"></div>
                <div className="w-3/4 bg-white min-h-[700px] rounded-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md">
                    <Navbar />
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default RootLayout
