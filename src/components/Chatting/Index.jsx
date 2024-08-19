import React from 'react'
import SmileIcon from '../../icons/SmileIcon'
import GalleryIcon from '../../icons/GalleryIcon'

function Chatting() {
    return (
        <div className="w-full bg-white">
            <div className="bg-black py-4 px-6 rounded-t-md">
                <div className="flex items-center gap-x-2">
                    <div className="w-12 h-12 rounded-full bg-orange-200 overflow-hidden"></div>
                    <h3 className="text-white font-semibold text-lg">Eyaheya Masrur</h3>
                </div>
            </div>
            <div className="w-full h-[600px] bg-red-400 px-6">fdgffg</div>
            <div className="bg-[#F5F5F5] px-2 py-4">
                <div className="bg-white max-w-[530px] w-full rounded-md mx-auto py-3 flex items-center justify-center gap-x-8">
                    <div className="flex items-center justify-center gap-x-2">
                        <button>
                            <SmileIcon />
                        </button>
                        <button>
                            <GalleryIcon />
                        </button>
                    </div>
                    <input type="text" placeholder='Type someting' className='w-3/5 outline-none' />
                    <button className='bg-primary px-4 py-2 rounded text-white'>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chatting
