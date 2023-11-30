
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
import { useState } from "react";
import { useEffect } from "react";
import MDButton from "components/MDButton";
import moment from "moment/moment";
import { useDeleteMatchSchedulesMutation } from "store/api";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { adminActions } from "store/admin/admin-slice";
import Loading from "components/Loading";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useGetAllLeaguesQuery } from "store/api";
import { useGetOneLeaguesQuery } from "store/api";
import { useDeleteResultTableMutation } from "store/api";
import { useDeleteResultTableRowMutation } from "store/api";

function Tables({ setIsPopupOn, isPopupOn }) {

  const token = getCookie('auth-token')

  const [leagueId, setLeague] = useState("Select League")

  const dispatch = useDispatch()

  const refetchMatches = useSelector((state) => state.admin.refetch)


  const { data: leaguesData } = useGetAllLeaguesQuery();
  const { data: leagueData, refetch: refetchLeagueData } = useGetOneLeaguesQuery({ id: leagueId });
  const [deleteResultTableRow, { isLoading }] = useDeleteResultTableRowMutation()
  const [deleteTable, { isLoading: deleteTableLoading }] = useDeleteResultTableMutation()


  const [data, setData] = useState({
    columns: [
      { Header: "hour", accessor: "hour", align: "center" },
      { Header: "matchcode", accessor: "matchcode", align: "center" },
      {
        Header: "team1", align: "center", columns: [
          { Header: "playerName", accessor: "team1.playerName" },
          { Header: "categorie", accessor: "team1.categorie" }
        ]
      },
      {
        Header: "team2", align: "center", columns: [
          { Header: "playerName", accessor: "team2.playerName" },
          { Header: "categorie", accessor: "team2.categorie" }
        ]
      },
      {
        Header: "set1", align: "center", columns: [
          { Header: "team1", accessor: "set1.team1", },
          { Header: "team2", accessor: "set1.team2", },
        ]
      },
      {
        Header: "set2", align: "center", columns: [
          { Header: "team1", accessor: "set2.team1", },
          { Header: "team2", accessor: "set2.team2", },
        ]
      },
      {
        Header: "set3", align: "center", columns: [
          { Header: "team1", accessor: "set3.team1", },
          { Header: "team2", accessor: "set3.team2" },
        ]
      },
      {
        Header: "matchScore", align: "center", columns: [
          { Header: "team1", accessor: "matchScore.team1" },
          { Header: "team2", accessor: "matchScore.team2" },
        ]
      },
      {
        Header: "matchPoint", align: "center", columns: [
          { Header: "team1", accessor: "matchPoint.team1", },
          { Header: "team2", accessor: "matchPoint.team2", },
        ]
      },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: []
  });

  const editHandler = async (data) => {
    setIsPopupOn(value => {
      return {
        link: "/results",
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
    if (refetchMatches) {
      refetchLeagueData()
      setIsPopupOn(false)
    }
  }, [refetchMatches, setIsPopupOn, refetchLeagueData])

  console.log(leagueData);

  useEffect(() => {
    if (leagueData?.leagues?.results?.matches?.length) {

      const mappedRows = leagueData?.leagues?.results?.matches.map((result) => ({
        hour: (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            hour
          </MDTypography>
        ),
        matchcode: (
          <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            matchcode
          </MDTypography>
        ),
        team1: {
          playerName: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            test
          </MDTypography>,
          categorie: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            categorie
          </MDTypography>,
        },
        team2: {
          playerName: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            playerName
          </MDTypography>,
          categorie: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            categorie
          </MDTypography>,
        },
        set1: {
          team1: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            playerName
          </MDTypography>,
          team2: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            categorie
          </MDTypography>,
        },
        set2: {
          team1: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            playerName
          </MDTypography>,
          team2: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            categorie
          </MDTypography>,
        },
        set3: {
          team1: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            playerName
          </MDTypography>,
          team2: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            categorie
          </MDTypography>,
        },
        matchScore: {
          team1: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            playerName
          </MDTypography>,
          team2: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            categorie
          </MDTypography>,
        },
        matchPoint: {
          team1: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            playerName
          </MDTypography>,
          team2: <MDTypography component="a" variant="caption" color="text" fontWeight="medium">
            categorie
          </MDTypography>,
        },
        action: (
          <>
            <MDButton onClick={() => editHandler(result)}  >
              Edit
            </MDButton>
            <MDButton onClick={() => deleteHandler(result.id)} >
              Remove
            </MDButton>
          </>
        ),
      }));

      console.log(mappedRows)
        ;
      setData((prevData) => ({
        ...prevData,
        rows: mappedRows,
      }));
    }
  }, [leagueData]);


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
        {leagueData?.leagues.results?.length ? leagueData.leagues.results.map(result => (
          <MDBox key={result.id} pt={6} pb={3}>
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
                        {result.identifierName} | {moment(result.date).format('DD.MM.YYYY')}
                      </MDTypography>
                      <MDButton onClick={() => setIsPopupOn({
                        link: '/results/add/row',
                        isOn: true,
                        leagueId
                      })} >
                        Add Match result
                      </MDButton>
                      <MDButton onClick={() => deleteTableHandler(result.id)}  >
                        Remove Match table
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
        )) : ''
        }
        {leagueData?.leagues ? <MDBox display="flex" justifyContent="center" padding="1em"  >
          <MDButton onClick={() => setIsPopupOn({
            link: '/results/add/table',
            isOn: true,
            leagueId
          })} >
            Add Match result
          </MDButton>
        </MDBox> : ''}
      </DashboardLayout>}
    </>
  );
}

export default Tables;
