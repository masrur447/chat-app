import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const LoggedInUserRoute = () => {
    const user = useSelector((user) => user.login.user)
    return user ? <Outlet/> : <Navigate to="/login" />
}

export default LoggedInUserRoute
