import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Friends() {

    const location = useLocation()
    const navigate = useNavigate()
    return (
        <div className="">
            <h4 className='text-lg text-black font-semibold'>Friends</h4>
            <div className="flex items-center justify-between gap-x-2 mt-5">
                <div className="flex items-center justify-center gap-x-2">
                    <div className="w-12 h-12 rounded-full bg-orange-200 overflow-hidden"></div>
                    <h3 className='text-lg text-black'>Eyaheya Masrur</h3>
                </div>
                {
                    location.pathname == "/" && (
                        <button className='bg-primary rounded px-4 py-2 text-white text-sm' onClick={() => navigate("/message")}>Message</button>
                    )
                }
            </div>
        </div>
    )
}

export default Friends
