
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import DataTable from "examples/Tables/DataTable";

// Data
import { getCookie } from "react-use-cookie";
import { useState } from "react";
import { useEffect } from "react";
import MDButton from "components/MDButton";
import moment from "moment/moment";
import { toast } from "react-toastify";

function AdminTables({ lists , deleteAdmin }) {

  const token = getCookie('auth-token')



  const [data, setData] = useState({
    columns: [
      { Header: "firstName", accessor: "firstName", align: "center" },
      { Header: "lastName", accessor: "lastName", align: "center" },
      { Header: "email", accessor: "email", align: "center" },
      { Header: "lastLogin", accessor: "lastLogin", align: "center" },
      { Header: "createdAt", accessor: "createdAt", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: []
  });



  const deleteHandler = async (id) => {
    try {
      let result = await deleteAdmin({ id, token }).unwrap();
      toast.success(result?.message)
    } catch (error) {
      if (Array.isArray(error.data?.message)) {
        error.data?.message.map(el => toast.warn(el))
      } else {
        toast.warn(error.data?.message)
      }
    }
  }



  useEffect(() => {
    if (lists) {
      const mappedRows = lists.map((match) => ({
        firstName: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {match.firstName}
          </MDTypography>
        ),
        lastName: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {match.lastName}
          </MDTypography>
        ),
        email: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {match.email}
          </MDTypography>
        ),
        lastLogin: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {moment(match.lastLogin).format('YYYY.MM.DD')}
          </MDTypography>
        ),
        createdAt: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {moment(match.createdAt).format('YYYY.MM.DD')}
          </MDTypography>
        ),
        action: (
          <>
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
  }, [lists]);




  return (
    <>
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
                    Admin Lists
                  </MDTypography>
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
    </>
  );
}

export default AdminTables;
