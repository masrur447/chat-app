import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "./slice/LoginSlice";


const store = configureStore({
    reducer: {
        login: LoginSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
})

export default store
