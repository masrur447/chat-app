import React from 'react'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/navbar/Index'
import UserList from '../components/UserList/Index'
import FriendRequest from '../components/FriendRequest/Index'
import Friends from '../components/Friends/Index'

const Home = () => {
    return (
        <>
            <div className="grid grid-cols-[2fr,4fr] gap-x-10 py-6 px-6">
                <div className="w-ful px-4 py-2">
                    <UserList />
                </div >
                <div className="grid grid-cols-2 gap-x-10">
                    <div className='w-full shadow-md px-4 py-2 rounded'>
                        <FriendRequest />
                    </div>
                    <div className='w-full shadow-md px-4 py-2 rounded'>
                        <Friends />
                    </div>
                </div>
            </div >
        </>
    )
}

export default Home
