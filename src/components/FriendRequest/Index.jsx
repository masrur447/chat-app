import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database'

function FriendRequest() {
    const user = useSelector((state) => state.login.user)
    const [friendReqList, setFriendReqList] = useState([])
    const [cancelReq, setCancelReq] = useState([])
    const db = getDatabase()

    // cancel request
    const handleCancel = (id) => {
        remove(ref(db, 'friendRequest/' + id))
    }

    // accept Request
    const handleAccecpt = (item) => {
        console.log(item)

        set(push(ref(db, 'friends')), { ...item }).then(() => {
            remove(ref(db, 'friendRequest/' + cancelReq.find((item) => item.receiverId === user.uid).id))
        })
    }

    useEffect(() => {
        const startCountRef = ref(db, 'friendRequest')
        onValue(startCountRef, (snapshot) => {
            const reqArray = []
            const cancelArray = []
            snapshot.forEach((item) => {
                if (item.val().receiverId === user.uid) {
                    reqArray.push(item.val())
                    cancelArray.push({ ...item.val(), id: item.key })
                }
            })
            setFriendReqList(reqArray)
            setCancelReq(cancelArray)
        })
    }, [db, user.uid])
    return (
        <>
            <div className="">
                <h4 className='text-lg font-semibold text-black'>Friend Requests</h4>
                {
                    friendReqList?.map((item, index) => (
                        <div className="flex items-center justify-between gap-x-4 mt-5" key={index}>
                            <div className="flex items-center justify-center gap-x-2">
                                <div className="w-12 h-12 rounded-full bg-orange-200 overflow-hidden">
                                    <img src={item.senderProfile} className='w-full h-full object-cover' />
                                </div>
                                <h3 className='text-lg text-black'>{item.senderName}</h3>
                            </div>
                            <div className="flex items-center justify-center gap-x-2">
                                <button className='bg-primary text-white rounded px-4 py-2 text-sm' onClick={() => handleAccecpt(item)}>Accept</button>
                                <button className='bg-red-500 text-white rounded px-4 py-2 text-sm' onClick={() => handleCancel(cancelReq.find((item) => item.receiverId === user.uid).id)}>Reject</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default FriendRequest
