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

function Popup({ setIsPopupOn, link, data, id }) {

    const token = getCookie('auth-token')

    const [formValues, setFormValues] = useState({
        date: data ? moment(data.date).format('YYYY-MM-DD') : null,
        day: data ? data.day : "",
        hour: data ? data.hour : "",
        team1: data ? data.team1 : "",
        team2: data ? data.team2 : "",
    })

    const [addMatchSchedules] = useAddMatchSchedulesMutation()
    const [editMatchSchedules] = useEditMatchSchedulesMutation()


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
                        console.log(formValues);
                        result = await editMatchSchedules({ formValues , id , token }).unwrap();
                        break;
                    default:
                        break;
                }
            } else {
                switch (link) {
                    case "/match-schedules":
                        result = await addMatchSchedules({ formValues, token }).unwrap();
                        break;
                    default:
                        break;
                }
            }

            toast.success(result?.message)
        } catch (error) {
            console.log(error.data.message);
            console.log(Array.isArray(error.data?.message));
            if (Array.isArray(error.data?.message)) {
                error.data?.message.map(el => toast.warn(el))
            } else {
                toast.warn(error.data?.message)
            }
        }
    }

    return (
        <div className='popup-container'>
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
        </div>
    )
}

export default Popup
