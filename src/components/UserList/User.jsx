import React from 'react'
import AddUserIcon from '../../icons/AddUserIcon'

function User({ user, key }) {
    return (
        <>
            <div className="flex items-center justify-between mt-5" >
                <div className="flex items-center justify-center gap-x-2">
                    <div className="w-12 h-12 rounded-full bg-orange-200 overflow-hidden">
                        <img src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'} alt="" className='w-full h-full object-cover' />
                    </div>
                    <h3 className='text-lg text-black font-semibold'>{user?.username}</h3>
                </div>
                <button className='w-10 h-10'>
                    <AddUserIcon />
                </button>
            </div>
        </>
    )
}

export default User
