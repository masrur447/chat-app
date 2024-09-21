import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Message from "../pages/Message";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import LoggedInUserRoute from "../PrivateRoute/LoggedInUserRoute";
import NotLoggedInUserRoute from "../PrivateRoute/NotLoggedInUserRoute";
import RootLayout from "../layouts/RootLayout";



const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route element={<LoggedInUserRoute />}>
                <Route element={<RootLayout />}>
                    <Route index path="/" element={<Home />} />
                    <Route path="/message" element={<Message />} />
                </Route>
            </Route>
            <Route element={<NotLoggedInUserRoute />}>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
            </Route>
        </Route>
    )
)


export default router
