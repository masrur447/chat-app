import React from 'react'
import Friends from '../components/Friends/Index'
import Chatting from '../components/Chatting/Index'

function Message() {
    return (
        <>
            <div className="grid grid-cols-[2fr,4fr] gap-x-10  py-6 px-6">
                <div className="w-full">
                    <Friends />
                </div>
                <div className="w-full shadow-md">
                    <Chatting />
                </div>
            </div>
        </>
    )
}

export default Message
