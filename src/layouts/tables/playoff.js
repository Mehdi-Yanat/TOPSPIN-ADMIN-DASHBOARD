
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
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { adminActions } from "store/admin/admin-slice";
import Loading from "components/Loading";
import { useGetAllPlayOffQuery } from "store/api";
import { useDeletePlayOffTableRowMutation } from "store/api";
import { useDeletePlayOffTableMutation } from "store/api";

function TablesPlayOff({ setIsPopupOn, isPopupOn }) {

  const token = getCookie('auth-token')

  const refetchPlayOff = useSelector((state) => state.admin.refetch)
  const dispatch = useDispatch()

  const { data: dataPlayOff, refetch } = useGetAllPlayOffQuery(token);
  const [deletePlayOff, { isLoading }] = useDeletePlayOffTableRowMutation()
  const [deletePlayOffTable, { isLoading: tableLoading }] = useDeletePlayOffTableMutation()


  const [tables, setTables] = useState([]);

  const editHandler = async (data) => {
    setIsPopupOn(value => {
      return {
        link: "/playoff/row",
        isOn: true,
        isEditMode: {
          data,
        }
      }
    })
  }

  const deleteHandler = async (id) => {
    try {
      let result = await deletePlayOff({ rowId: id, token }).unwrap();
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
    if (refetchPlayOff) {
      refetch()
      setIsPopupOn(false)
    }
  }, [refetchPlayOff, setIsPopupOn, refetch])


  useEffect(() => {
    if (dataPlayOff?.playoff) {
      // Map over playoff data and generate tables
      const mappedTables = dataPlayOff.playoff.map((table) => {
        const headers = [
          { Header: "team", accessor: "team", align: "center" },
          { Header: "result", accessor: "result", align: "center" },
          { Header: "action", accessor: "action", align: "center" },
        ];

        const mappedRows = table.playoffTable.map((playoff) => ({
          team: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              {playoff.team}
            </MDTypography>
          ),
          result: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              {playoff.result}
            </MDTypography>
          ),
          action: (
            <>
              <MDButton onClick={() => editHandler(playoff)}  >
                Edit
              </MDButton>
              <MDButton onClick={() => deleteHandler(playoff.id)} >
                Remove
              </MDButton>
            </>
          ),
        }));

        return {
          id: table.id,
          title: `${table.identifierName} PLAYOFF ${table.playoffNumber} STANDINGS`,
          columns: headers,
          rows: mappedRows,
        };
      });

      setTables(mappedTables);
    }
  }, [dataPlayOff]);


  const deletePlayOffTableHandler = async (id) => {
    try {
      let result = await deletePlayOffTable({ id, token }).unwrap();
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


  return (
    <>
      {isLoading || tableLoading ? <Loading /> : <DashboardLayout>
        <DashboardNavbar />
        <MDBox display={'flex'} alignItems="center" justifyContent='center' >
          <MDButton onClick={() => setIsPopupOn({
            link: '/playoff/table',
            isOn: true
          })} >
            Add Play Off Table
          </MDButton>
        </MDBox>
        <MDBox pt={6} pb={3}>
          <Grid container spacing={6}>
            {tables.map(table => <Grid key={table.id} item xs={12}>
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
                      {table.title}
                    </MDTypography>
                    <MDButton onClick={() => setIsPopupOn({
                      link: `/playoff/row`,
                      isOn: true,
                      tableId: table.id
                    })} >
                      Add Play Off Row
                    </MDButton>
                    <MDButton onClick={() => deletePlayOffTableHandler(table.id)} >
                      Remove Play Off table
                    </MDButton>
                  </MDBox>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: table.columns, rows: table.rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>)}
          </Grid>
        </MDBox>
        <Footer />
      </DashboardLayout>}
    </>
  );
}

export default TablesPlayOff;
