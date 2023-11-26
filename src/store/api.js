// api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation({
            query: ({ token }) => ({
                url: '/auth/logout',
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + token
                },
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
        getAllMatchSchedules: builder.query({
            query: (token) => ({
                url: '/schedule',
                method: 'GET', // or 'GET' depending on your API
                headers: {
                    authorization: 'Bearer ' + token
                }
            }),
        }),
        addMatchSchedules: builder.mutation({
            query: ({ formValues, token }) => ({
                url: '/schedule',
                method: 'POST',
                body: formValues,
                headers: {
                    authorization: 'Bearer ' + token
                },
            }),
        }),
        editMatchSchedules: builder.mutation({
            query: ({ formValues, id, token }) => ({
                url: '/schedule/' + id,
                method: 'PUT',
                body: formValues,
                headers: {
                    authorization: 'Bearer ' + token
                },
            }),
        }),
        deleteMatchSchedules: builder.mutation({
            query: ({ id, token }) => ({
                url: '/schedule/' + id,
                method: 'DELETE',
                headers: {
                    authorization: 'Bearer ' + token
                },
            }),
        }),
        getAllPlayOff: builder.query({
            query: (token) => ({
                url: '/schedule/playoff',
                method: 'GET', // or 'GET' depending on your API
                headers: {
                    authorization: 'Bearer ' + token
                }
            }),
        }),
        addPlayOffTable: builder.mutation({
            query: ({ formValues, token }) => ({
                url: '/schedule/playoff',
                method: 'POST',
                body: formValues,
                headers: {
                    authorization: 'Bearer ' + token
                },
            }),
        }),
        addPlayOffTableRow: builder.mutation({
            query: ({ formValues, id, token }) => ({
                url: `/schedule/playoff/${id}/row`,
                method: 'POST',
                body: formValues,
                headers: {
                    authorization: 'Bearer ' + token
                },
            }),
        }),
        editPlayOffTableRow: builder.mutation({
            query: ({ formValues, rowId, token }) => ({
                url: `/schedule/playoff/row/${rowId}`,
                method: 'PUT',
                body: formValues,
                headers: {
                    authorization: 'Bearer ' + token
                },
            }),
        }),
        deletePlayOffTableRow: builder.mutation({
            query: ({ formValues, rowId, token }) => ({
                url: `/schedule/playoff/row/${rowId}`,
                method: 'DELETE',
                body: formValues,
                headers: {
                    authorization: 'Bearer ' + token
                },
            }),
        }),
        deletePlayOffTable: builder.mutation({
            query: ({ formValues, id, token }) => ({
                url: `/schedule/playoff/${id}`,
                method: 'DELETE',
                body: formValues,
                headers: {
                    authorization: 'Bearer ' + token
                },
            }),
        }),
        editAdmin: builder.mutation({
            query: ({ formValues, token }) => ({
                url: '/auth/admin/edit',
                method: 'PUT',
                body: formValues,
                headers: {
                    authorization: 'Bearer ' + token
                },
            }),
        }),
        addAdmin: builder.mutation({
            query: ({ formValuesAdd, token }) => ({
                url: '/auth/admin/add',
                method: 'POST',
                body: formValuesAdd,
                headers: {
                    authorization: 'Bearer ' + token
                },
            }),
        }),
        deleteAdmin: builder.mutation({
            query: ({ id, token }) => ({
                url: '/auth/admin/delete/' + id,
                method: 'DELETE',
                headers: {
                    authorization: 'Bearer ' + token
                },
            }),
        }),
        listAdmin: builder.query({
            query: (token) => ({
                url: '/auth/admin/lists',
                method: 'GET', // or 'GET' depending on your API
                headers: {
                    authorization: 'Bearer ' + token
                }
            }),
        }),
    })
})



export const {
    useLoginMutation, useCheckTokenQuery, useChangePasswordMutation, useSendVerificationCodeMutation,
    useGetAllMatchSchedulesQuery, useAddMatchSchedulesMutation, useEditMatchSchedulesMutation, useDeleteMatchSchedulesMutation,
    useEditAdminMutation, useAddAdminMutation, useLogoutMutation, useListAdminQuery, useDeleteAdminMutation, useGetAllPlayOffQuery, useAddPlayOffTableMutation,
    useAddPlayOffTableRowMutation, useEditPlayOffTableRowMutation, useDeletePlayOffTableRowMutation, useDeletePlayOffTableMutation
} = api;

export default api;