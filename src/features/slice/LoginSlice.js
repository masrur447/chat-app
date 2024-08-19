import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
}

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload
            localStorage.setItem("user", JSON.stringify(action.payload))
        },
        logout: (state) => {
            state.user = null
            localStorage.removeItem("user")
        }
    }
})

export const { login, logout } = loginSlice.actions

export default loginSlice.reducer
