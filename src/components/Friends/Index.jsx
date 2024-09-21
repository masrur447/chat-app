import { getDatabase, onValue, ref } from 'firebase/database'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { ActiveSingle } from '../../features/slice/ActiveSingleSlice'

function Friends() {
    const user = useSelector((state) => state.login.user)
    const db = getDatabase()
    const [friends, setFriends] = useState([])
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()


    // show friends
    useEffect(() => {
        const startCountRef = ref(db, 'friends')
        onValue(startCountRef, (snapshot) => {
            const friendArray = []
            snapshot.forEach((item) => {
                if (item.val().receiverId === user.uid || item.val().senderId === user.uid) {
                    friendArray.push(item.val())
                }
            })
            setFriends(friendArray)

        })
    }, [db, user.uid])

    // handle single chat
    const handleSingleChat = (item) => () => {

        const newItem = {
            senderId: user.uid,
            senderName: user.displayName,
            senderProfile: user.photoURL,
            receiverId: item.senderId === user.uid ? item.receiverId : item.senderId,
            receiverName: item.senderId === user.uid ? item.receiverName : item.senderName,
            receiverProfile: item.senderId === user.uid ? item.receiverProfile : item.senderProfile
        }

        dispatch(ActiveSingle(newItem))
    }

    return (
        <div className="">
            <h4 className='text-lg text-black font-semibold'>Friends</h4>
            {
                friends?.map((item, index) => (
                    <div className="flex items-center justify-between gap-x-2 mt-5 hover:bg-gray-300 ease-linear transition-all px-2 py-3 rounded-md cursor-pointer" key={index} onClick={handleSingleChat(item)}>
                        <div className="flex items-center justify-center gap-x-2">
                            <div className="w-12 h-12 rounded-full bg-orange-200 overflow-hidden">
                                <img src={item.senderId === user.uid ? item.receiverProfile : item.senderProfile} className='w-full h-full object-cover' />
                            </div>
                            <h3 className='text-lg text-black'>
                                {
                                    item.senderId === user.uid ? item.receiverName : item.senderName
                                }
                            </h3>
                        </div>
                        {
                            location.pathname == "/" && (
                                <button className='bg-primary rounded px-4 py-2 text-white text-sm' onClick={() => navigate("/message")}>Message</button>
                            )
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default Friends
