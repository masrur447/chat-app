import React from 'react'
import { useSelector } from 'react-redux'
import Home from '../pages/Home'
import { Navigate, Outlet } from 'react-router-dom'

const NotLoggedInUserRoute = () => {
    const user = useSelector((user) => user.login.user)
    return user ? <Navigate to='/' /> : <Outlet/>
}

export default NotLoggedInUserRoute
