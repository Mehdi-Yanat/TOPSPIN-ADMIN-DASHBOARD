import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    refetch: ''
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setRefetch: (state, action) => {
            state.refetch = action.payload
        }
    }
});

export const adminActions = adminSlice.actions;
export default adminSlice;