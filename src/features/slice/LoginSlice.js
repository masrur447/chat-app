import { createSlice } from "@reduxjs/toolkit"
import secureLocalStorage from "react-secure-storage"


const initialState = {
    user: secureLocalStorage.getItem("user") ? JSON.parse(secureLocalStorage.getItem("user")) : null,
}

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload
            secureLocalStorage.setItem("user", JSON.stringify(action.payload))
        },
        logout: (state) => {
            state.user = null
            secureLocalStorage.removeItem("user")
        }
    }
})

export const { login, logout } = loginSlice.actions

export default loginSlice.reducer
