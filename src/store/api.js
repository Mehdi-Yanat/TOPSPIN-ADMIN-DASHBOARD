// api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4500' }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        sendVerificationCode: builder.mutation({
            query: (email) => ({
                url: '/auth/send-verification-code',
                method: 'POST',
                body: { email },
            }),
        }),
        changePassword: builder.mutation({
            query: ({ password, token }) => ({
                url: '/auth/change',
                method: 'POST',
                body: { password },
                headers: {
                    authorization: 'Bearer ' + token
                },
            }),
        }),
        checkToken: builder.query({
            query: (token) => ({
                url: '/auth/check-token',
                method: 'GET', // or 'GET' depending on your API
                headers: {
                    authorization: 'Bearer ' + token
                }
            }),
        }),
    })
})



export const {
    useLoginMutation, useCheckTokenQuery, useChangePasswordMutation, useSendVerificationCodeMutation
} = api;

export default api;