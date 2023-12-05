
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import { getCookie } from "react-use-cookie";
import React, { useState } from "react";
import { useEffect } from "react";
import MDButton from "components/MDButton";
import moment from "moment/moment";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { adminActions } from "store/admin/admin-slice";
import Loading from "components/Loading";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useGetAllLeaguesQuery } from "store/api";
import { useGetOneLeaguesQuery } from "store/api";
import { useDeleteResultTableMutation } from "store/api";
import { useDeleteResultMacthesTableRowMutation } from "store/api";
import { Navigate } from "react-router-dom";

function Tables({ setIsPopupOn, isPopupOn }) {

  const token = getCookie('auth-token')

  const [leagueId, setLeague] = useState(0)
  const [leagueGroupId, setLeagueGroup] = useState(0)

  const dispatch = useDispatch()

  const refetchMatches = useSelector((state) => state.admin.refetch)


  const { data: leaguesData } = useGetAllLeaguesQuery();
  const { data: leagueData, refetch: refetchLeagueData } = useGetOneLeaguesQuery({ id: leagueId, groupId: leagueGroupId });
  const [deleteResultTableRow, { isLoading }] = useDeleteResultMacthesTableRowMutation()
  const [deleteTable, { isLoading: deleteTableLoading }] = useDeleteResultTableMutation()
  const [resultData, setResultData] = useState([])


  useEffect(() => {
    if (leagueId || leagueGroupId) {
      const findData = leagueData?.leagues?.leaguesGroups.find(el => el.id === leagueGroupId)
      setResultData(findData?.results)
    }
  }, [leagueId, leagueGroupId, refetchMatches])

  const [data, setData] = useState({
    columns: [
      { Header: "hour", accessor: "hour", align: "center" },
      { Header: "matchcode", accessor: "matchcode", align: "center" },
      {
        Header: "team1", align: "center", columns: [
          { Header: "playerName", accessor: "team1.playerName", align: "center" },
          { Header: "categorie", accessor: "team1.categorie", align: "center" },
          { Header: "teamName", accessor: "team1.teamName", align: "center" },
          { Header: "teamCode", accessor: "team1.teamCode", align: "center" },
        ]
      },
      {
        Header: "team2", align: "center", columns: [
          { Header: "playerName", accessor: "team2.playerName", align: "center" },
          { Header: "categorie", accessor: "team2.categorie", align: "center" },
          { Header: "teamName", accessor: "team2.teamName", align: "center" },
          { Header: "teamCode", accessor: "team2.teamCode", align: "center" },
        ]
      },
      {
        Header: "set1", align: "center", columns: [
          { Header: "team1", accessor: "set1.team1", align: "center" },
          { Header: "team2", accessor: "set1.team2", align: "center" },
        ]
      },
      {
        Header: "set2", align: "center", columns: [
          { Header: "team1", accessor: "set2.team1", align: "center" },
          { Header: "team2", accessor: "set2.team2", align: "center" },
        ]
      },
      {
        Header: "set3", align: "center", columns: [
          { Header: "team1", accessor: "set3.team1", align: "center" },
          { Header: "team2", accessor: "set3.team2", align: "center" },
        ]
      },
      {
        Header: "matchScore", align: "center", columns: [
          { Header: "team1", accessor: "matchScore.team1", align: "center" },
          { Header: "team2", accessor: "matchScore.team2", align: "center" },
        ]
      },
      {
        Header: "matchPoint", align: "center", columns: [
          { Header: "team1", accessor: "matchPoint.team1", align: "center" },
          { Header: "team2", accessor: "matchPoint.team2", align: "center" },
        ]
      },
      { Header: "action", accessor: "action", align: "center" },
    ],
  });

  const editHandler = async (data) => {
    setIsPopupOn(value => {
      return {
        link: "/results/add/row",
        isOn: true,
        isEditMode: {
          data,
        }
      }
    })
  }

  const deleteHandler = async (id) => {
    try {
      let result = await deleteResultTableRow({ id, token }).unwrap();
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

  const deleteTableHandler = async (id) => {
    try {
      let result = await deleteTable({ id, token }).unwrap();
      console.log(result);
      if (result?.success) {
        dispatch(adminActions.setRefetch("DELETE-TABLE"))
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
    if (refetchMatches) {
      refetchLeagueData()
      setIsPopupOn(false)
    }
  }, [refetchMatches, setIsPopupOn, refetchLeagueData])

  const [tableData, setTableData] = useState([]);


  useEffect(() => {
    if (resultData?.length > 0) {
      const mappedTables = resultData.map((table) => {
        const mappedMatches = table.matches.map((match) => ({
          hour: (
            <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {match.hour}
            </MDTypography>
          ),
          matchcode: (
            <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {match.matchCode}
            </MDTypography>
          ),
          team1: {
            playerName: < >
              {match.team1[0].players.map(el => <MDTypography mt={match.team1[0].players.length > 1 ? ".5em" : ''} component="p" variant="caption" color="text" fontWeight="medium">
                {el.playerName}
              </MDTypography>)}
            </>,
            categorie: < >
              {match.team1[0].players.map(el => <MDTypography mt={match.team1[0].players.length > 1 ? ".5em" : ''} component="p" variant="caption" color="text" fontWeight="medium">
                {el.categorie}
              </MDTypography>)}
            </>,
            teamName: (
              <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
                {match.team1[0].teamName}
              </MDTypography>
            ),
            teamCode: (
              <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
                {match.team1[0].teamCode}
              </MDTypography>
            ),
          },
          team2: {
            playerName: < >
              {match.team2[0].players.map(el => <MDTypography mt={match.team2[0].players.length > 1 ? ".5em" : ''} component="p" variant="caption" color="text" fontWeight="medium">
                {el.playerName}
              </MDTypography>)}
            </>,
            categorie: < >
              {match.team2[0].players.map(el => <MDTypography mt={match.team2[0].players.length > 1 ? ".5em" : ''} component="p" variant="caption" color="text" fontWeight="medium">
                {el.categorie}
              </MDTypography>)}
            </>,
            teamName: (
              <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
                {match.team2[0].teamName}
              </MDTypography>
            ),
            teamCode: (
              <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
                {match.team2[0].teamCode}
              </MDTypography>
            ),
          },
          set1: {
            team1: <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {match.team1[0].set1}
            </MDTypography>,
            team2: <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {match.team2[0].set1}
            </MDTypography>,
          },
          set2: {
            team1: <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {match.team1[0].set2}
            </MDTypography>,
            team2: <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {match.team2[0].set2}
            </MDTypography>,
          },
          set3: {
            team1: <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {match.team1[0].set3}
            </MDTypography>,
            team2: <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {match.team2[0].set3}
            </MDTypography>,
          },
          matchScore: {
            team1: <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {match.team1[0].matchScore}
            </MDTypography>,
            team2: <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {match.team2[0].matchScore}
            </MDTypography>,
          },
          matchPoint: {
            team1: <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {match.team1[0].matchPoint}
            </MDTypography>,
            team2: <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {match.team2[0].matchPoint}
            </MDTypography>,
          },
          action: (
            <>
              <MDButton onClick={() => editHandler(match)}>
                Edit
              </MDButton>
              <MDButton onClick={() => deleteHandler(match.id)}>
                Remove
              </MDButton>
            </>
          ),
        }));

        const tableInfo = (
          <MDBox key={table.id} pt={6} pb={3}>
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
                    <MDBox display="flex" alignItems="center" gap="10px">
                      <MDTypography variant="h6" color="white">
                        {table.identifierName} | {moment(table.date).format('DD.MM.YYYY')}
                      </MDTypography>
                      <MDButton onClick={() => setIsPopupOn({
                        link: '/results/add/row',
                        isOn: true,
                        resultId: table.id
                      })}>
                        Add Match result
                      </MDButton>
                      <MDButton onClick={() => deleteTableHandler(table.id)}>
                        Remove Match table
                      </MDButton>
                    </MDBox>
                  </MDBox>
                  <MDBox pt={3}>
                    <DataTable
                      table={{ columns: data.columns, rows: mappedMatches }}
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
        );

        return {
          tableInfo,
          matches: mappedMatches,
        };
      });

      setTableData(mappedTables);
    }
  }, [resultData]);

  return (
    <>
      {isLoading || deleteTableLoading ? <Loading /> : <DashboardLayout>
        <DashboardNavbar />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">League</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={leagueId}
            label="league"
            onChange={(e) => setLeague(e.target.value)}
            sx={{ padding: "1em" }}
          >
            {
              leaguesData?.leagues?.map(el => <MenuItem value={el.id}>{el.leagueName}</MenuItem>)
            }
          </Select>
        </FormControl>
        {leagueId ? <FormControl style={{ marginTop: '1em' }} fullWidth>
          <InputLabel mt="1em" id="demo-simple-select-label">League Group</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={leagueGroupId}
            label="league"
            onChange={(e) => setLeagueGroup(e.target.value)}
            sx={{ padding: "1em" }}
          >
            {
              leagueData?.leagues?.leaguesGroups.map(el => <MenuItem value={el.id}>{el.groupIdentifier}</MenuItem>)
            }
          </Select>
        </FormControl> : ''}
        {
          !resultData?.length ? <MDBox display="flex" alignItems="center" justifyContent="center" padding="2em"  >
            <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              No Data Found
            </MDTypography>
          </MDBox> :

            tableData.map((table, index) => (
              <React.Fragment key={index}>
                {table.tableInfo}
              </React.Fragment>
            ))

        }
        {leagueGroupId ? <MDBox display="flex" justifyContent="center" padding="1em"  >
          <MDButton onClick={() => setIsPopupOn({
            link: '/results/add/table',
            isOn: true,
            leagueGroupId
          })} >
            Add Match result Table
          </MDButton>
        </MDBox> : ''}
      </DashboardLayout>}
    </>
  );
}

export default Tables;
