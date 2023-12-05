import { Card, Grid } from '@mui/material'
import Loading from 'components/Loading'
import MDBox from 'components/MDBox'
import MDButton from 'components/MDButton'
import MDTypography from 'components/MDTypography'
import Footer from 'examples/Footer'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import DataTable from 'examples/Tables/DataTable'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getCookie } from 'react-use-cookie'
import { adminActions } from 'store/admin/admin-slice'
import { useDeleteLeaguesMutation } from 'store/api'
import { useGetAllLeaguesQuery } from 'store/api'

function Leagues({ setIsPopupOn }) {

    const token = getCookie('auth-token')

    const refetchLeagues = useSelector((state) => state.admin.refetch)

    const { data: leaguesData, refetch, isLoading } = useGetAllLeaguesQuery();
    const [deleteLeagues] = useDeleteLeaguesMutation()


    const dispatch = useDispatch()

    const [data, setData] = useState({
        columns: [
            { Header: "league Name", accessor: "leagueName", align: "center" },
            { Header: "league Groups", accessor: "leagueGroups", align: "center" },
            { Header: "action", accessor: "action", align: "center" },
        ],
        rows: []
    });


    useEffect(() => {
        if (leaguesData) {
            const mappedRows = leaguesData.leagues.map((league) => ({
                leagueName: (
                    <MDTypography component="p" href="#" variant="caption" color="text" fontWeight="medium">
                        {league.leagueName}
                    </MDTypography>
                ),
                leagueGroups: (
                    <>
                        {league.leaguesGroups.map(el => <MDTypography mt={league.leaguesGroups.length > 1 ? ".5em" : ''} component="p" href="#" variant="caption" color="text" fontWeight="medium">
                            {el.groupIdentifier}
                        </MDTypography>)}
                    </>
                ),
                action: (
                    <>
                        <MDButton onClick={() => editHandler(league)}  >
                            Edit
                        </MDButton>
                        <MDButton onClick={() => deleteHandler(league.id)} >
                            Remove
                        </MDButton>
                    </>
                ),
            }));

            setData((prevData) => ({
                ...prevData,
                rows: mappedRows,
            }));
        }
    }, [leaguesData]);

    const editHandler = async (data) => {
        setIsPopupOn(value => {
            return {
                link: "/leagues",
                isOn: true,
                isEditMode: {
                    data,
                }
            }
        })
    }


    const deleteHandler = async (id) => {
        try {
            let result = await deleteLeagues({ id, token }).unwrap();
            console.log(result);
            if (result?.success) {
                dispatch(adminActions.setRefetch("DELETE"))
                setTimeout(() => {
                    dispatch(adminActions.setRefetch(''));
                }, 1000);
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


    useEffect(() => {
        if (refetchLeagues) {
            refetch()
            setIsPopupOn(false)
        }
    }, [refetchLeagues, setIsPopupOn, refetch])


    return (
        <>
            {isLoading ? <Loading /> : <DashboardLayout>
                <DashboardNavbar />
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                >
                                    <MDBox display="flex" alignItems="center" gap="10px"  >
                                        <MDTypography variant="h6" color="white">
                                            Leagues
                                        </MDTypography>
                                        <MDButton onClick={() => setIsPopupOn({
                                            link: '/leagues',
                                            isOn: true
                                        })} >
                                            Add League
                                        </MDButton>
                                    </MDBox>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={data}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
                <Footer />
            </DashboardLayout>}
        </>
    )
}

export default Leagues
