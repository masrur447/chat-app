import Register from "../pages/Register";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"



const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<Register />} />
        </Route>
    )
)


export default router