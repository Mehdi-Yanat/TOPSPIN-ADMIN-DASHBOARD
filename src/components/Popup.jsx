import React, { useEffect } from 'react'
import '../styles/popup.css'
import CloseIcon from '@mui/icons-material/Close';
import MDButton from './MDButton';
import MDBox from './MDBox';
import MDInput from './MDInput';
import { useState } from 'react';
import { useAddMatchSchedulesMutation } from 'store/api';
import { ToastContainer, toast } from 'react-toastify';
import { getCookie } from 'react-use-cookie';
import moment from 'moment';
import { useEditMatchSchedulesMutation } from 'store/api';
import { useDispatch } from 'react-redux';
import { adminActions } from 'store/admin/admin-slice';
import Loading from './Loading';

function Popup({ setIsPopupOn, link, data, id }) {

    const dispatch = useDispatch()
    const token = getCookie('auth-token')

    const [formValues, setFormValues] = useState({
        date: data ? moment(data.date).format('YYYY-MM-DD') : "",
        day: data ? data.day : "",
        hour: data ? data.hour : "",
        team1: data ? data.team1 : "",
        team2: data ? data.team2 : "",
        team1MatchResultId: data ? data.team1MatchResult[0]?.id : "",
        team2MatchResultId: data ? data.team2MatchResult[0]?.id : "",
        team1Result: data ? data.team1MatchResult[0]?.result : 0,
        team2Result: data ? data.team2MatchResult[0]?.result : 0
    })

    const [addMatchSchedules, { isLoading }] = useAddMatchSchedulesMutation()
    const [editMatchSchedules, { isLoading: EditLoading }] = useEditMatchSchedulesMutation()


    const renderInputs = () => {
        switch (link) {
            case "/match-schedules":
                return <>
                    <MDBox m={4} mb={2}>
                        <MDInput value={formValues.date} name="date" type="date" onChange={(e) => setFormValues(value => {
                            return {
                                ...value,
                                date: e.target.value
                            }
                        })} fullWidth />
                    </MDBox>
                    <MDBox m={4} mb={2}>
                        <MDInput value={formValues.day} name="day" type="text" onChange={(e) => setFormValues(value => {
                            return {
                                ...value,
                                day: e.target.value
                            }
                        })} label={formValues.day ? '' : "Day"} fullWidth />
                    </MDBox>
                    <MDBox m={4} mb={2}>
                        <MDInput value={formValues.hour} name="hour" type="text" onChange={(e) => setFormValues(value => {
                            return {
                                ...value,
                                hour: e.target.value
                            }
                        })} label={formValues.hour ? "" : "Hour"} fullWidth />
                    </MDBox>
                    <MDBox m={4} mb={2}>
                        <MDInput value={formValues.team1} name="team1" type="text" onChange={(e) => setFormValues(value => {
                            return {
                                ...value,
                                team1: e.target.value
                            }
                        })} label={formValues.team1 ? "" : "Team 1"} fullWidth />
                    </MDBox>
                    <MDBox m={4} mb={2}>
                        <MDInput value={formValues.team2} name="team2" type="text" onChange={(e) => setFormValues(value => {
                            return {
                                ...value,
                                team2: e.target.value
                            }
                        })} label={formValues.team2 ? "" : "Team 2"} fullWidth />
                    </MDBox>
                    {id ? <>
                        <MDBox m={4} mb={2}>
                            <MDInput value={formValues.team1Result} name="team1Result" type="number" onChange={(e) => setFormValues(value => {
                                return {
                                    ...value,
                                    team1Result: e.target.value
                                }
                            })} label={formValues.team1Result ? "" : "Team 1 Match Result"} fullWidth />
                        </MDBox>
                        <MDBox m={4} mb={2}>
                            <MDInput value={formValues.team2Result} name="team2MatchResult" type="number" onChange={(e) => setFormValues(value => {
                                return {
                                    ...value,
                                    team2Result: e.target.value
                                }
                            })} label={formValues.team2Result ? "" : "Team 2 Match Result"} fullWidth />
                        </MDBox></> : ''}
                </>
            default:
                break;
        }
    }

    const submitHandler = async (e) => {
        try {
            let result
            if (data) {
                switch (link) {
                    case "/match-schedules":
                        result = await editMatchSchedules({ formValues, id, token }).unwrap();
                        if (result?.success) {
                            dispatch(adminActions.setRefetchMatchSchedules("EDIT"))
                            setTimeout(() => {
                                dispatch(adminActions.setRefetchMatchSchedules(''));
                            }, 1000);
                        }
                        break;
                    default:
                        break;
                }
            } else {
                switch (link) {
                    case "/match-schedules":
                        result = await addMatchSchedules({ formValues, token }).unwrap();
                        if (result?.success) {
                            dispatch(adminActions.setRefetchMatchSchedules("ADD"))
                            setTimeout(() => {
                                dispatch(adminActions.setRefetchMatchSchedules(''));
                            }, 1000);
                        }
                        break;
                    default:
                        break;
                }
            }

            toast.success(result?.message)
        } catch (error) {
            dispatch(adminActions.setRefetchMatchSchedules(""))
            if (Array.isArray(error.data?.message)) {
                error.data?.message.map(el => toast.warn(el))
            } else {
                toast.warn(error.data?.message)
            }
        }
    }

    return (
        <>
            {isLoading || EditLoading ? <Loading /> : <div className='popup-container'>
                <ToastContainer />
                <div className='popup' >
                    <div className="closeBtn" >
                        <MDButton onClick={() => setIsPopupOn({
                            isOn: false,
                            link: ""
                        })}  >
                            <CloseIcon />
                        </MDButton>
                    </div>
                    {renderInputs()}
                    <div className="submit" >
                        <MDButton onClick={submitHandler} >
                            Submit
                        </MDButton>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Popup
