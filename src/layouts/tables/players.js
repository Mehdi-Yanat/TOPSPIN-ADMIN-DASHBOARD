
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
import { useDeleteGroupsMutation } from "store/api";

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
  const [deleteGroups, { isLoading: deleteGroupsLoading }] = useDeleteGroupsMutation()
  const [playersGroupData, setPlayersGroupData] = useState([])


  useEffect(() => {
    if (leagueId || leagueGroupId) {
      const findData = leagueData?.leagues?.leaguesGroups.find(el => el.id === leagueGroupId)
      setPlayersGroupData(findData?.playersGroup)
    }
  }, [leagueId, leagueGroupId, refetchMatches])

  const [data, setData] = useState({
    columns: [
      { Header: "playerName", accessor: "playerName", align: "center" },
      { Header: "categorie", accessor: "categorie", align: "center" },
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
      let result = await deleteGroups({ id, token }).unwrap();
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
    if (playersGroupData?.length > 0) {
      const mappedTables = playersGroupData.map((group) => {
        const mappedMatches = group.players.map((player) => ({
          playerName: (
            <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {player.playerName}
            </MDTypography>
          ),
          categorie: (
            <MDTypography component="p" variant="caption" color="text" fontWeight="medium">
              {player.categories}
            </MDTypography>
          ),
          action: (
            <>
              <MDButton onClick={() => editHandler(player)}>
                Edit
              </MDButton>
              <MDButton onClick={() => deleteHandler(player.id)}>
                Remove
              </MDButton>
            </>
          ),
        }));

        const tableInfo = (
          <MDBox key={group.id} pt={6} pb={3}>
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
                        {group.identifierName} | {moment(group.date).format('DD.MM.YYYY')}
                      </MDTypography>
                      <MDButton onClick={() => setIsPopupOn({
                        link: '/results/add/row',
                        isOn: true,
                        resultId: group.id
                      })}>
                        Add Match result
                      </MDButton>
                      <MDButton onClick={() => deleteTableHandler(group.id)}>
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
  }, [playersGroupData]);

  return (
    <>
      {isLoading || deleteTableLoading || deleteGroupsLoading ? <Loading /> : <DashboardLayout>
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
          !playersGroupData?.length ? <MDBox display="flex" alignItems="center" justifyContent="center" padding="2em"  >
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
            link: '/groups',
            isOn: true,
            leagueGroupId
          })} >
            Add Group
          </MDButton>
        </MDBox> : ''}
      </DashboardLayout>}
    </>
  );
}

export default Tables;
