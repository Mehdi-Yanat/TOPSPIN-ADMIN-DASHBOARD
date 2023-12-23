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
import { useAddLeaguesMutation } from 'store/api';
import { useEditLeaguesMutation } from 'store/api';
import { useAddResultTableMutation } from 'store/api';
import { useAddResultsMatchesTableRowMutation } from 'store/api';
import { useEditResultsMatchesTableRowMutation } from 'store/api';
import MDTypography from './MDTypography';
import { useAddGroupsMutation } from 'store/api';

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
        team1Result: data?.team1MatchResult || 0,
        team2Result: data?.team2MatchResult || 0,
        leagueGroupId: popup.leagueGroupId
    })

    const [formValuesPlayOff, setFormValuesPlayOff] = useState({
        identifierName: data ? data.identifierName : "",
        playoffNumber: data ? data.playoffNumber : 0,
        team: data ? data.team : "",
        result: data ? data.result : 0
    })

    const [formValuesLeagues, setFormValuesLeagues] = useState({
        leagueName: data ? data.leagueName : "",
        leaguesGroups: data ? data.leaguesGroups : [{
            groupIdentifier: ""
        }]
    })

    const [formValuesResultTable, setFormValuesResultTable] = useState({
        identifierName: data ? data.identifierName : "",
        date: data ? moment(data.date).format('YYYY-MM-DD') : "",
        leagueGroupId: popup.leagueGroupId
    })

    const [formValuesResultTableRow, setFormValuesResultTableRow] = useState(link !== "/results/add/row" ? {} : {
        hour: data ? data.hour : "",
        matchCode: data ? data.matchCode : "",
        team1Name: data ? data?.team1[0].teamName : "",
        team1Code: data ? data?.team1[0].teamCode : "",
        team2Name: data ? data?.team2[0].teamName : "",
        team2Code: data ? data?.team2[0].teamCode : "",
        team1: data ? data?.team1[0].players : [{
            playerName: "",
            categorie: ""
        }],
        team2: data ? data?.team2[0].players : [{
            playerName: "",
            categorie: ""
        }],
        set1: {
            team1: data ? data?.team1[0].set1 : 0,
            team2: data ? data?.team2[0].set1 : 0,
        },
        set2: {
            team1: data ? data?.team1[0].set2 : 0,
            team2: data ? data?.team2[0].set2 : 0,
        },
        set3: {
            team1: data ? data?.team1[0].set3 : 0,
            team2: data ? data?.team2[0].set3 : 0,
        },
        team1Id: data ? data?.team1[0].id : 0,
        team2Id: data ? data?.team2[0].id : 0,
        resultId: popup.resultId
    })

    const [formValuesPlayers, setFormValuesPlayers] = useState({
        identifierGroup: data ? data.identifierGroup : "",
        file: null
    })

    const [addMatchSchedules, { isLoading }] = useAddMatchSchedulesMutation()
    const [addLeagues, { isLoading: leaguesLoading }] = useAddLeaguesMutation()
    const [addResultsTable, { isLoading: resultsTableLoading }] = useAddResultTableMutation()
    const [addPlayOffTable, { isLoading: addPlayOffTableLoading }] = useAddPlayOffTableMutation()
    const [addPlayOffRowTable, { isLoading: addPlayOffTableRowLoading }] = useAddPlayOffTableRowMutation()
    const [addResultsMatchesTableRow, { isLoading: addResultsMatchesTableRowLoading }] = useAddResultsMatchesTableRowMutation()
    const [addGroup, { isLoading: addGroupLoading }] = useAddGroupsMutation()
    const [editResultsMatchesTableRow, { isLoading: editResultsMatchesTableRowLoading }] = useEditResultsMatchesTableRowMutation()
    const [editMatchSchedules, { isLoading: EditLoading }] = useEditMatchSchedulesMutation()
    const [editPlayOffRowTable, { isLoading: EditPlayOfFLoading }] = useEditPlayOffTableRowMutation()
    const [editLeagues, { isLoading: EditLeaguesLoading }] = useEditLeaguesMutation()


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
            case "/leagues":
                return <>
                    <MDBox m={4} mb={2}>
                        <MDInput
                            value={formValuesLeagues.leagueName}
                            name="team"
                            type="text"
                            onChange={(e) =>
                                setFormValuesLeagues((prevValues) => ({
                                    ...prevValues,
                                    leagueName: e.target.value,
                                }))
                            }
                            label={formValuesLeagues.leagueName ? '' : "League Name"}
                            fullWidth
                        />
                    </MDBox>

                    {formValuesLeagues.leaguesGroups.map((group, index) => (
                        <MDBox display="flex" alignItems="center" gap="1em" key={index} m={4} mb={2}>
                            <MDInput
                                value={group.groupIdentifier}
                                name={`group-${index}`}
                                type="text"
                                onChange={(e) =>
                                    setFormValuesLeagues((prevValues) => {
                                        const updatedGroups = [...prevValues.leaguesGroups];
                                        updatedGroups[index] = { ...updatedGroups[index], groupIdentifier: e.target.value };
                                        return { ...prevValues, leaguesGroups: updatedGroups };
                                    })
                                } label={group.groupIdentifier ? "" : `Group ${index + 1}`}
                                fullWidth
                            />
                            <MDButton
                                onClick={() =>
                                    setFormValuesLeagues((prevValues) => {
                                        const updatedGroups = [...prevValues.leaguesGroups];
                                        updatedGroups.splice(index, 1); // Remove the group at the specified index
                                        return { ...prevValues, leaguesGroups: updatedGroups };
                                    })
                                }
                            >
                                Remove
                            </MDButton>
                        </MDBox>
                    ))}

                    <MDBox mt={2} display="flex" justifyContent="center">
                        <MDButton
                            onClick={() =>
                                setFormValuesLeagues((prevValues) => ({
                                    ...prevValues,
                                    leaguesGroups: [...prevValues.leaguesGroups, { groupIdentifier: "" }],
                                }))
                            }
                        >
                            Add Group
                        </MDButton>
                    </MDBox>

                </>
            case "/results/add/table":
                return <>
                    <MDBox m={4} mb={2}>
                        <MDInput value={formValuesResultTable.identifierName} name="team" type="text" onChange={(e) => setFormValuesResultTable(value => {
                            return {
                                ...value,
                                identifierName: e.target.value
                            }
                        })} label={formValuesResultTable.identifierName ? '' : "Result Table Name"} fullWidth />
                    </MDBox>
                    <MDBox m={4} mb={2}>
                        <MDInput value={formValuesResultTable.date} name="date" type="date" onChange={(e) => setFormValuesResultTable(value => {
                            return {
                                ...value,
                                date: e.target.value
                            }
                        })} fullWidth />
                    </MDBox>
                </>
            case "/results/add/row":
                return <>
                    <MDBox m={4} mb={2}>
                        <MDInput value={formValuesResultTableRow.hour} name="hour" type="text" onChange={(e) => setFormValuesResultTableRow(value => {
                            return {
                                ...value,
                                hour: e.target.value
                            }
                        })} label={formValuesResultTableRow.hour ? '' : "Hour"} fullWidth />
                    </MDBox>
                    <MDBox m={4} mb={0}>
                        <MDInput value={formValuesResultTableRow.matchCode} name="matchCode" type="text" onChange={(e) => setFormValuesResultTableRow(value => {
                            return {
                                ...value,
                                matchCode: e.target.value
                            }
                        })} label={formValuesResultTableRow.matchCode ? '' : "Match Code"} fullWidth />
                    </MDBox>
                    <MDBox display="flex" alignItems="center" >
                        <MDBox m={4} mb={0}>
                            <MDInput value={formValuesResultTableRow.team1Name} name="team1Name" type="text" onChange={(e) => setFormValuesResultTableRow(value => {
                                return {
                                    ...value,
                                    team1Name: e.target.value
                                }
                            })} label={formValuesResultTableRow.team1Name ? '' : "Team 1 Name"} fullWidth />
                        </MDBox>
                        <MDBox m={4} mb={0}>
                            <MDInput value={formValuesResultTableRow.team1Code} name="team1Code" type="text" onChange={(e) => setFormValuesResultTableRow(value => {
                                return {
                                    ...value,
                                    team1Code: e.target.value
                                }
                            })} label={formValuesResultTableRow.team1Code ? '' : "Team 1 Code"} fullWidth />
                        </MDBox>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" >
                        <MDBox m={4} >
                            <MDInput value={formValuesResultTableRow.team2Name} name="team2Name" type="text" onChange={(e) => setFormValuesResultTableRow(value => {
                                return {
                                    ...value,
                                    team2Name: e.target.value
                                }
                            })} label={formValuesResultTableRow.team2Name ? '' : "Team 2 Name"} fullWidth />
                        </MDBox>
                        <MDBox m={4} >
                            <MDInput value={formValuesResultTableRow.team2Code} name="team2Code" type="text" onChange={(e) => setFormValuesResultTableRow(value => {
                                return {
                                    ...value,
                                    team2Code: e.target.value
                                }
                            })} label={formValuesResultTableRow.team2Code ? '' : "Team 2 Code"} fullWidth />
                        </MDBox>
                    </MDBox>
                    {formValuesResultTableRow.team1.map((player, index) => (
                        <MDBox display="flex" alignItems="center" mt={2} key={index}>
                            <MDBox ml={4} mr={4} >
                                <MDInput
                                    value={player.playerName}
                                    name={`team1-player-${index}`}
                                    type="text"
                                    onChange={(e) => setFormValuesResultTableRow((prevValues) => {
                                        const updatedTeam1 = [...prevValues.team1];
                                        updatedTeam1[index] = { ...updatedTeam1[index], playerName: e.target.value };
                                        return { ...prevValues, team1: updatedTeam1 };
                                    })}
                                    label={player.playerName ? '' : `Team 1 Player ${index + 1}`}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox display="flex" justifyContent="center">
                                <MDButton onClick={() => setFormValuesResultTableRow((prevValues) => {
                                    const updatedTeam1 = [...prevValues.team1];
                                    updatedTeam1.splice(index, 1); // Remove the player at the specified index
                                    return { ...prevValues, team1: updatedTeam1 };
                                })}>
                                    Remove
                                </MDButton>
                            </MDBox>
                            <MDBox ml={4} mr={4} >
                                <MDInput
                                    value={player.categorie}
                                    name={`team1-categorie-${index}`}
                                    type="text"
                                    onChange={(e) => setFormValuesResultTableRow((prevValues) => {
                                        const updatedTeam1 = [...prevValues.team1];
                                        updatedTeam1[index] = { ...updatedTeam1[index], categorie: e.target.value };
                                        return { ...prevValues, team1: updatedTeam1 };
                                    })}
                                    label={player.categorie ? '' : `Team 1 Category ${index + 1}`}
                                    fullWidth
                                />
                            </MDBox>
                        </MDBox>
                    ))}
                    <MDBox mt={2} display="flex" justifyContent="center">
                        <MDButton onClick={() => setFormValuesResultTableRow((prevValues) => ({
                            ...prevValues,
                            team1: [...prevValues.team1, { playerName: "", categorie: "" }]
                        }))}>
                            Add Player on Team 1
                        </MDButton>
                    </MDBox>
                    {formValuesResultTableRow.team2.map((player, index) => (
                        <MDBox display="flex" alignItems="center" mt={2} key={index}>
                            <MDBox ml={4} mr={4}>
                                <MDInput
                                    value={player.playerName}
                                    name={`team2-player-${index}`}
                                    type="text"
                                    onChange={(e) => setFormValuesResultTableRow((prevValues) => {
                                        const updatedTeam2 = [...prevValues.team2];
                                        updatedTeam2[index] = { ...updatedTeam2[index], playerName: e.target.value };;
                                        return { ...prevValues, team2: updatedTeam2 };
                                    })}
                                    label={player.playerName ? '' : `Team 2 Player ${index + 1}`}
                                    fullWidth
                                />
                            </MDBox>
                            <MDBox display="flex" justifyContent="center">
                                <MDButton onClick={() => setFormValuesResultTableRow((prevValues) => {
                                    const updatedTeam2 = [...prevValues.team2];
                                    updatedTeam2.splice(index, 1); // Remove the player at the specified index
                                    return { ...prevValues, team2: updatedTeam2 };
                                })}>
                                    Remove
                                </MDButton>
                            </MDBox>
                            <MDBox ml={4} mr={4}>
                                <MDInput
                                    value={player.categorie}
                                    name={`team2-categorie-${index}`}
                                    type="text"
                                    onChange={(e) => setFormValuesResultTableRow((prevValues) => {
                                        const updatedTeam2 = [...prevValues.team2];
                                        updatedTeam2[index] = { ...updatedTeam2[index], categorie: e.target.value };
                                        return { ...prevValues, team2: updatedTeam2 };
                                    })}
                                    label={player.categorie ? '' : `Team 2 Category ${index + 1}`}
                                    fullWidth
                                />
                            </MDBox>
                        </MDBox>
                    ))}
                    <MDBox mt={2} display="flex" justifyContent="center">
                        <MDButton onClick={() => setFormValuesResultTableRow((prevValues) => ({
                            ...prevValues,
                            team2: [...prevValues.team2, { playerName: "", categorie: "" }]
                        }))}>
                            Add Player on Team 2
                        </MDButton>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" mt={2}>
                        <MDBox ml={4} mr={4}>
                            <MDInput
                                value={formValuesResultTableRow.set1.team1}
                                name="set1-team1"
                                type="number"
                                onChange={(e) => setFormValuesResultTableRow((prevValues) => ({
                                    ...prevValues,
                                    set1: { ...prevValues.set1, team1: e.target.value }
                                }))}
                                label="Set 1 Team 1"
                                fullWidth
                            />
                        </MDBox>

                        <MDBox ml={4} mr={4}>
                            <MDInput
                                value={formValuesResultTableRow.set1.team2}
                                name="set1-team2"
                                type="number"
                                onChange={(e) => setFormValuesResultTableRow((prevValues) => ({
                                    ...prevValues,
                                    set1: { ...prevValues.set1, team2: e.target.value }
                                }))}
                                label="Set 1 Team 2"
                                fullWidth
                            />
                        </MDBox>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" mt={2}>
                        <MDBox ml={4} mr={4}>
                            <MDInput
                                value={formValuesResultTableRow.set2.team1}
                                name="set2-team1"
                                type="number"
                                onChange={(e) => setFormValuesResultTableRow((prevValues) => ({
                                    ...prevValues,
                                    set2: { ...prevValues.set2, team1: e.target.value }
                                }))}
                                label="Set 2 Team 1"
                                fullWidth
                            />
                        </MDBox>

                        <MDBox ml={4} mr={4}>
                            <MDInput
                                value={formValuesResultTableRow.set2.team2}
                                name="set2-team2"
                                type="number"
                                onChange={(e) => setFormValuesResultTableRow((prevValues) => ({
                                    ...prevValues,
                                    set2: { ...prevValues.set2, team2: e.target.value }
                                }))}
                                label="Set 2 Team 2"
                                fullWidth
                            />
                        </MDBox>
                    </MDBox>
                    <MDBox display="flex" alignItems="center" mt={2}>
                        <MDBox ml={4} mr={4}>
                            <MDInput
                                value={formValuesResultTableRow.set3.team1}
                                name="set3-team1"
                                type="number"
                                onChange={(e) => setFormValuesResultTableRow((prevValues) => ({
                                    ...prevValues,
                                    set3: { ...prevValues.set3, team1: e.target.value }
                                }))}
                                label="Set 3 Team 1"
                                fullWidth
                            />
                        </MDBox>

                        <MDBox ml={4} mr={4}>
                            <MDInput
                                value={formValuesResultTableRow.set3.team2}
                                name="set3-team2"
                                type="number"
                                onChange={(e) => setFormValuesResultTableRow((prevValues) => ({
                                    ...prevValues,
                                    set3: { ...prevValues.set3, team2: e.target.value }
                                }))}
                                label="Set 3 Team 2"
                                fullWidth
                            />
                        </MDBox>
                    </MDBox>
                </>
            case "/groups":
                return <>
                    <MDBox m={4} mb={2}>
                        <MDInput
                            value={formValuesPlayers.identifierGroup}
                            name="identifierGroup"
                            type="text"
                            onChange={(e) =>
                                setFormValuesPlayers((prevValues) => ({
                                    ...prevValues,
                                    identifierGroup: e.target.value,
                                }))
                            }
                            label={formValuesPlayers.identifierGroup ? '' : "Group Identifier"}
                            fullWidth
                        />
                    </MDBox>
                    <MDBox m={4} mb={2}>
                        <MDTypography mb={1} component="p" variant="caption" color="text" fontWeight="medium">
                            Excel File (to add multi groups and players)
                        </MDTypography>
                        <MDInput
                            name="file"
                            type="file"
                            onChange={(e) => {
                                // Use e.target.files to get the selected files
                                const selectedFile = e.target.files[0];

                                // Update the state with the selected file
                                setFormValuesPlayers((prevValues) => ({
                                    ...prevValues,
                                    file: selectedFile,
                                }));
                            }}
                            fullWidth
                        />
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
                    case "/leagues":
                        result = await editLeagues({ formValues: formValuesLeagues, id: data.id, token }).unwrap();
                        if (result?.success) {
                            dispatch(adminActions.setRefetch("EDIT"))
                            setTimeout(() => {
                                dispatch(adminActions.setRefetch(''));
                            }, 1000);
                        }
                        break;
                    case "/results/add/row":
                        result = await editResultsMatchesTableRow({ formValues: formValuesResultTableRow, id: data.id, token }).unwrap();
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
                    case "/leagues":
                        result = await addLeagues({ formValues: formValuesLeagues, token }).unwrap();
                        if (result?.success) {
                            dispatch(adminActions.setRefetch("ADD"))
                            setTimeout(() => {
                                dispatch(adminActions.setRefetch(''));
                            }, 1000);
                        }
                        break;
                    case "/results/add/table":
                        result = await addResultsTable({ formValues: formValuesResultTable, token }).unwrap();
                        if (result?.success) {
                            dispatch(adminActions.setRefetch("ADD"))
                            setTimeout(() => {
                                dispatch(adminActions.setRefetch(''));
                            }, 1000);
                        }
                        break;
                    case "/results/add/row":
                        result = await addResultsMatchesTableRow({ formValues: formValuesResultTableRow, token }).unwrap();
                        if (result?.success) {
                            dispatch(adminActions.setRefetch("ADD"))
                            setTimeout(() => {
                                dispatch(adminActions.setRefetch(''));
                            }, 1000);
                        }
                        break;
                    case "/groups":
                        const formData = new FormData()
                        formData.append("identifierGroup", formValuesPlayers.identifierGroup);
                        formData.append("file", formValuesPlayers.file);
                        formData.append("leagueGroupId", popup.leagueGroupId);

                        result = await addGroup({ formValues: formData, token }).unwrap();
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
                || addPlayOffTableRowLoading || EditLoading || EditPlayOfFLoading || leaguesLoading || resultsTableLoading
                || addResultsMatchesTableRowLoading || EditLeaguesLoading || editResultsMatchesTableRowLoading || addGroupLoading ? <Loading /> : <div className='popup-container'>
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
