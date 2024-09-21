import { createSlice } from "@reduxjs/toolkit"
import secureLocalStorage from "react-secure-storage"

const initialState = {
    active: null
}
const ActiveSingleSlice = createSlice({
    name: 'activeSingle',
    initialState,
    reducers: {
        ActiveSingle: (state, action) => {
            state.active = action.payload
            // secureLocalStorage.setItem('active', JSON.stringify(action.payload))
        }
    }
})

export const { ActiveSingle } = ActiveSingleSlice.actions
export default ActiveSingleSlice.reducer
