import React, { useEffect, useState } from 'react'
import { getDatabase, onValue, ref } from 'firebase/database'
import { getStorage } from 'firebase/storage'
import { useSelector } from 'react-redux'
import User from './User'

function UserList() {
    const user = useSelector((user) => user.login.user)
    const db = getDatabase()
    const storage = getStorage();

    const [users, setUsers] = useState([])


    // show all users
    useEffect(() => {
        const starCountRef = ref(db, 'users/');
        onValue(starCountRef, (snapshot) => {
            const userData = []
            snapshot.forEach((item) => {
                if (item.key !== user.uid) {
                    userData.push(item.val())
                }
            })
            setUsers(userData)
        });
    }, [db, storage, user])




    return (
        <div className=''>
            <h1 className='font-semibold text-lg mt-2'>All Users</h1>
            {
                users.map((user, index) => (
                    <User user={user} key={index} />
                ))
            }
        </div>
    )
}

export default UserList
