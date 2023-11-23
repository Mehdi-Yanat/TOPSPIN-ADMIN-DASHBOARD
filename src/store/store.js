import { configureStore } from '@reduxjs/toolkit';
import api from './api';
import adminSlice from './admin/admin-slice'

const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        admin: adminSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

export default store;