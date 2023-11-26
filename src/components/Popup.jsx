import React from 'react'
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
import { useAddPlayOffTableMutation } from 'store/api';
import { useAddPlayOffTableRowMutation } from 'store/api';
import { useEditPlayOffTableRowMutation } from 'store/api';

function Popup({ setIsPopupOn, link, data, id, popup }) {

    const dispatch = useDispatch()
    const token = getCookie('auth-token')

    const [formValues, setFormValues] = useState({
        date: data ? moment(data.date).format('YYYY-MM-DD') : "",
        day: data ? data.day : "",
        hour: data ? data.hour : "",
        team1: data ? data.team1 : "",
        team2: data ? data.team2 : "",
        team1MatchResultId: data?.team1MatchResult?.[0]?.id || "",
        team2MatchResultId: data?.team2MatchResult?.[0]?.id || "",
        team1Result: data?.team1MatchResult?.[0]?.result || 0,
        team2Result: data?.team2MatchResult?.[0]?.result || 0
    })

    const [formValuesPlayOff, setFormValuesPlayOff] = useState({
        identifierName: data ? data.identifierName : "",
        playoffNumber: data ? data.playoffNumber : 0,
        team: data ? data.team : "",
        result: data ? data.result : 0
    })

    const [addMatchSchedules, { isLoading }] = useAddMatchSchedulesMutation()
    const [addPlayOffTable, { isLoading: addPlayOffTableLoading }] = useAddPlayOffTableMutation()
    const [addPlayOffRowTable, { isLoading: addPlayOffTableRowLoading }] = useAddPlayOffTableRowMutation()
    const [editMatchSchedules, { isLoading: EditLoading }] = useEditMatchSchedulesMutation()
    const [editPlayOffRowTable, { isLoading: EditPlayOfFLoading }] = useEditPlayOffTableRowMutation()


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
            case "/playoff/table":
                return <>
                    <MDBox m={4} mb={2}>
                        <MDInput value={formValuesPlayOff.identifierName} name="identifierName" type="text" onChange={(e) => setFormValuesPlayOff(value => {
                            return {
                                ...value,
                                identifierName: e.target.value
                            }
                        })} label={formValuesPlayOff.identifierName ? '' : "Identifier Name"} fullWidth />
                    </MDBox>
                    <MDBox m={4} mb={2}>
                        <MDInput value={formValuesPlayOff.playoffNumber} name="playoffNumber" type="number" onChange={(e) => setFormValuesPlayOff(value => {
                            return {
                                ...value,
                                playoffNumber: e.target.value
                            }
                        })} label={formValuesPlayOff.playoffNumber ? '' : "Playoff Number"} fullWidth />
                    </MDBox>
                </>
            case "/playoff/row":
                return <>
                    <MDBox m={4} mb={2}>
                        <MDInput value={formValuesPlayOff.team} name="team" type="text" onChange={(e) => setFormValuesPlayOff(value => {
                            return {
                                ...value,
                                team: e.target.value
                            }
                        })} label={formValuesPlayOff.team ? '' : "Team"} fullWidth />
                    </MDBox>
                    <MDBox m={4} mb={2}>
                        <MDInput value={formValuesPlayOff.result} name="result" type="number" onChange={(e) => setFormValuesPlayOff(value => {
                            return {
                                ...value,
                                result: e.target.value
                            }
                        })} label={formValuesPlayOff.result ? '' : "Result"} fullWidth />
                    </MDBox>
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
                            dispatch(adminActions.setRefetch("EDIT"))
                            setTimeout(() => {
                                dispatch(adminActions.setRefetch(''));
                            }, 1000);
                        }
                        break;
                    case "/playoff/row":
                        result = await editPlayOffRowTable({ formValues: formValuesPlayOff, rowId: data.id, token }).unwrap();
                        if (result?.success) {
                            dispatch(adminActions.setRefetch("EDIT"))
                            setTimeout(() => {
                                dispatch(adminActions.setRefetch(''));
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
                            dispatch(adminActions.setRefetch("ADD"))
                            setTimeout(() => {
                                dispatch(adminActions.setRefetch(''));
                            }, 1000);
                        }
                        break;
                    case "/playoff/table":
                        result = await addPlayOffTable({ formValues: formValuesPlayOff, token }).unwrap();
                        if (result?.success) {
                            dispatch(adminActions.setRefetch("ADD"))
                            setTimeout(() => {
                                dispatch(adminActions.setRefetch(''));
                            }, 1000);
                        }
                        break;
                    case "/playoff/row":
                        result = await addPlayOffRowTable({ formValues: formValuesPlayOff, id: popup.tableId, token }).unwrap();
                        if (result?.success) {
                            dispatch(adminActions.setRefetch("ADD"))
                            setTimeout(() => {
                                dispatch(adminActions.setRefetch(''));
                            }, 1000);
                        }
                        break;
                    default:
                        break;
                }
            }

            toast.success(result?.message)
        } catch (error) {
            dispatch(adminActions.setRefetch(""))
            if (Array.isArray(error.data?.message)) {
                error.data?.message.map(el => toast.warn(el))
            } else {
                toast.warn(error.data?.message)
            }
        }
    }

    return (
        <>
            {isLoading || addPlayOffTableLoading || addPlayOffTableLoading 
            || addPlayOffTableRowLoading || EditLoading || EditPlayOfFLoading ? <Loading /> : <div className='popup-container'>
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
