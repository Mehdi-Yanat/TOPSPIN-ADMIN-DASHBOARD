
// @mui material components
import Grid from "@mui/material/Grid";



// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";


// Overview page components
import Header from "layouts/profile/components/Header";
import { useCheckTokenQuery } from "store/api";
import { getCookie } from "react-use-cookie";
import moment from "moment";
import { useListAdminQuery } from "store/api";
import { useEffect } from "react";
import { useEditAdminMutation } from "store/api";
import { useAddAdminMutation } from "store/api";
import { useLogoutMutation } from "store/api";
import Loading from "components/Loading";
import { useDeleteAdminMutation } from "store/api";




function Overview() {


  const token = getCookie('auth-token')
  const { data, refetch } = useCheckTokenQuery(token);
  const { data: admin, refetch: refetchLists } = useListAdminQuery(token);
  const [editAdmin, { isLoading, data: editAdminData }] = useEditAdminMutation()
  const [addAdmin, { isLoading: addLoading, data: addAdminData }] = useAddAdminMutation()
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation()
  const [deleteAdmin, { isLoading: deleteAdminLoading, refetch: refetchAdmin, data: deleteData }] = useDeleteAdminMutation()

  useEffect(() => {
    if (editAdminData?.success || addAdminData?.success || deleteData?.success) {
      refetchLists()
      refetch()
    }
  }, [editAdminData, deleteData, deleteData])

  return (
    <>
      {isLoading || addLoading || logoutLoading || deleteAdminLoading ? <Loading /> : <DashboardLayout>
        <DashboardNavbar />
        <MDBox mb={2} />
        <Header deleteAdmin={deleteAdmin} editAdmin={editAdmin} addAdmin={addAdmin} logout={logout} lists={admin?.lists} data={data?.user} >
          <MDBox mt={5} mb={3}>
            <Grid container spacing={1}>
              <Grid item width={"100%"} sx={{ display: "flex" }}>
                <ProfileInfoCard
                  title={`${data?.user.firstName} ${data?.user?.lastName}`}
                  description="Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
                  info={{
                    fullName: `${data?.user?.firstName} ${data?.user?.lastName}`,
                    mobile: `${data?.user?.mobile || ''}`,
                    email: `${data?.user?.email}`,
                    lastLogin: moment(data.user?.lastLogin).format('YYYY-MM-DD'),
                    createdAt: moment(data.user?.createdAt).format('YYYY-MM-DD')
                  }}
                  action={{ route: "", tooltip: "Edit Profile" }}
                  shadow={false}
                />
              </Grid>
            </Grid>
          </MDBox>
        </Header>
        <Footer />
      </DashboardLayout>}
    </>
  );
}

export default Overview;
