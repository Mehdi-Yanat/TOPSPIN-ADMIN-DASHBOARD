
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
import { useGetAllMatchSchedulesQuery } from "store/api";
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

function Tables({ setIsPopupOn, isPopupOn }) {

  const token = getCookie('auth-token')

  const refetchMatchSchedules = useSelector((state) => state.admin.refetch)
  const dispatch = useDispatch()

  const { data: matchSchedulesData, refetch } = useGetAllMatchSchedulesQuery(token);
  const [deleteMatchSchedules, { isLoading }] = useDeleteMatchSchedulesMutation()



  const [data, setData] = useState({
    columns: [
      { Header: "date", accessor: "date", align: "center" },
      { Header: "day", accessor: "day", align: "center" },
      { Header: "hour", accessor: "hour", align: "center" },
      { Header: "team1", accessor: "team1", align: "center" },
      { Header: "team2", accessor: "team2", align: "center" },
      { Header: "team1MatchResult", accessor: "team1MatchResult", align: "center" },
      { Header: "team2MatchResult", accessor: "team2MatchResult", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: []
  });

  const editHandler = async (data) => {
    setIsPopupOn(value => {
      return {
        link: "/match-schedules",
        isOn: true,
        isEditMode: {
          data,
        }
      }
    })
  }


  const deleteHandler = async (id) => {
    try {
      let result = await deleteMatchSchedules({ id, token }).unwrap();
      console.log(result);
      if (result?.success) {
        dispatch(adminActions.setRefetchMatchSchedules("DELETE"))
        setTimeout(() => {
          dispatch(adminActions.setRefetchMatchSchedules(''));
        }, 1000);
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

  useEffect(() => {
    if (refetchMatchSchedules) {
      refetch()
      setIsPopupOn(false)
    }
  }, [refetchMatchSchedules, setIsPopupOn, refetch])

  useEffect(() => {
    if (matchSchedulesData?.matches) {
      // Extract only the necessary properties from matchSchedulesData
      // Map over matchSchedulesData.matches and generate rows
      const mappedRows = matchSchedulesData.matches.map((match) => ({
        date: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {moment(match.date).format('YYYY.MM.DD')}
          </MDTypography>
        ),
        day: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {match.day}
          </MDTypography>
        ),
        hour: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {match.hour}
          </MDTypography>
        ),
        team1: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {match.team1}
          </MDTypography>
        ),
        team2: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {match.team2}
          </MDTypography>
        ),
        team1MatchResult: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {match?.team1MatchResult.length ? match.team1MatchResult[0].result : "-"}
          </MDTypography>
        ),
        team2MatchResult: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {match?.team2MatchResult.length ? match.team2MatchResult[0].result : "-"}
          </MDTypography>
        ),
        action: (
          <>
            <MDButton onClick={() => editHandler(match)}  >
              Edit
            </MDButton>
            <MDButton onClick={() => deleteHandler(match.id)} >
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
  }, [matchSchedulesData]);




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
                      Match Schedule
                    </MDTypography>
                    <MDButton onClick={() => setIsPopupOn({
                      link: '/match-schedules',
                      isOn: true
                    })} >
                      Add Match Schedule
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
  );
}

export default Tables;
