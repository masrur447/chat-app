import React, { useEffect, useState } from 'react'
import AddUserIcon from '../../icons/AddUserIcon'
import { useSelector } from 'react-redux'
import { getDatabase, ref, push, set, onValue, remove } from 'firebase/database'
import { toast } from 'react-toastify'

function User({ user }) {
    const currentUser = useSelector((state) => state.login.user)
    const [friendReqList, setFriendReqList] = useState([])
    const [cancelReq, setCancelReq] = useState([])
    const [friends, setFriends] = useState([])

    const db = getDatabase()

    const handleRequest = (user) => () => {

        set(push(ref(db, 'friendRequest')), {
            senderId: currentUser.uid,
            senderName: currentUser.displayName,
            senderProfile: currentUser.photoURL ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
            receiverId: user.id,
            receiverName: user.username,
            receiverProfile: user.photoURL ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
        }).catch(() => {
            toast.error('An error occurred please try again')
        })
    }

    const handleCancelRequest = (id) => () => {

        remove(ref(db, 'friendRequest/' + id))
    }

    //  show friends request
    useEffect(() => {
        const startCountref = ref(db, 'friendRequest')
        onValue(startCountref, (snapshot) => {
            const reqArray = []
            const cancelArray = []
            snapshot.forEach((item) => {
                reqArray.push(item.val().receiverId + item.val().senderId)
                cancelArray.push({ ...item.val(), id: item.key })
            })
            setFriendReqList(reqArray)
            setCancelReq(cancelArray)
        })

    }, [db, currentUser.uid])


    // show friends
    useEffect(() => {
        const startCountRef = ref(db, 'friends')
        onValue(startCountRef, (snapshot) => {
            const friendArray = []
            snapshot.forEach((item) => {
                if (item.val().receiverId === currentUser.uid || item.val().senderId === currentUser.uid) {
                    friendArray.push(item.val())
                }
            })
            setFriends(friendArray)
        })
    }, [db, user.id])




    return (
        <>
            <div className="flex items-center justify-between mt-5">
                <div className="flex items-center justify-center gap-x-2">
                    <div className="w-12 h-12 rounded-full bg-orange-200 overflow-hidden">
                        <img src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'} alt="" className='w-full h-full object-cover' />
                    </div>
                    <h3 className='text-lg text-black font-semibold'>{user?.username}</h3>
                </div>
                {
                    friendReqList.includes(user.id + currentUser.uid) || friendReqList.includes(currentUser.uid + user.id) ? (
                        <>
                            {
                                cancelReq.find((req) => req.senderId === currentUser.uid) ? (
                                    <button
                                        className='bg-red-400 text-white text-base px-2 py-1 rounded-md'
                                        onClick={handleCancelRequest(cancelReq.find((item) => item.receiverId == user.id && item.senderId == currentUser.uid || item.receiverId == currentUser.uid && item.senderId == user.id)?.id)}
                                    >Cancel Request</button>
                                ) : (
                                    <>
                                    </>
                                )
                            }
                        </>
                    ) : (
                        <>
                            {
                                friends.find((item) => item.receiverId === user.id || item.senderId === user.id) ? (
                                    <div className='bg-sky-300 px-2 py-1 rounded-md text-white pointer-events-none'>Friends</div>
                                ) : (
                                    <button
                                        className='bg-blue-400 text-white text-base px-2 py-1 rounded-md'
                                        onClick={handleRequest(user)}
                                    >Add Friend</button>
                                )
                            }
                        </>
                    )
                }


            </div>
        </>
    )
}

export default User
