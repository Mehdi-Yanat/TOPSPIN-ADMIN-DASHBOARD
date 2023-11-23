import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    refetchMatchSchedules: ''
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setRefetchMatchSchedules: (state, action) => {
            state.refetchMatchSchedules = action.payload
        }
    }
});

export const adminActions = adminSlice.actions;
export default adminSlice;