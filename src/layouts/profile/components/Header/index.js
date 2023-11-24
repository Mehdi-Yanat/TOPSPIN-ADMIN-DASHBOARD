

import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/blacklogo.svg";
import backgroundImage from "assets/banner_expansion_desktop.png";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { toast } from "react-toastify";
import { getCookie } from "react-use-cookie";
import AdminTables from "layouts/profile/adminsList";

function Header({ children, data, lists, logout, addAdmin, editAdmin, deleteAdmin }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");

  const token = getCookie('auth-token')
  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);


  const [formValues, setFormValues] = useState({
    email: data ? data.email : "",
    password: data ? data.password : "",
    mobile: data ? data.mobile : "",
    firstName: data ? data.firstName : "",
    lastName: data ? data.lastName : "",
  })

  const [formValuesAdd, setFormValuesAdd] = useState({
    email: "",
    password: ""
  })


  const [openForm, setOpenForm] = useState(false)


  const editAdminHandler = async () => {
    try {
      let result = await editAdmin({ formValues, token }).unwrap();
      toast.success(result?.message)
    } catch (error) {
      if (Array.isArray(error.data?.message)) {
        error.data?.message.map(el => toast.warn(el))
      } else {
        toast.warn(error.data?.message)
      }
    }
  }

  const addAdminHandler = async () => {
    try {
      let result = await addAdmin({ formValuesAdd, token }).unwrap();
      toast.success(result?.message)
    } catch (error) {
      if (Array.isArray(error.data?.message)) {
        error.data?.message.map(el => toast.warn(el))
      } else {
        toast.warn(error.data?.message)
      }
    }
  }

  const logoutHandler = async () => {
    try {
      let result = await logout({ token }).unwrap();
      toast.success(result?.message)
      window.location.reload()
    } catch (error) {
      if (Array.isArray(error.data?.message)) {
        error.data?.message.map(el => toast.warn(el))
      } else {
        toast.warn(error.data?.message)
      }
    }
  }

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar src={burceMars} alt="profile-image" size="xl" shadow="sm" />
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {`${data?.lastName} ${data?.firstName}`}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {`${data.roles.map(el => `${el} /`)}`}
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
        {children}
        <Grid width={'100%'} display={"flex"} justifyContent={"end"}  >
          <MDButton onClick={() => setOpenForm(value => !value)}>
            {!openForm ? 'Open' : 'Close'} Admin controllers
          </MDButton>
        </Grid>
        {openForm ? <><Grid>
          <MDBox mr={4} ml={4} mb={2}>
            <MDTypography variant="h5" mb="10px" fontWeight="medium">
              {`Edit Admin`}
            </MDTypography>
            <MDBox >
              <MDInput value={formValues.email} name="email" type="email" onChange={(e) => setFormValues(value => {
                return {
                  ...value,
                  email: e.target.value
                }
              })} label={formValues.email ? '' : 'Email'} fullWidth />
            </MDBox>
            <MDBox mt={2} >
              <MDInput value={formValues.mobile} name="mobile" type="text" onChange={(e) => setFormValues(value => {
                return {
                  ...value,
                  mobile: e.target.value
                }
              })} label={formValues.mobile ? '' : "Mobile"} fullWidth />
            </MDBox>
            <MDBox mt={2}>
              <MDInput value={formValues.firstName} name="firstName" type="text" onChange={(e) => setFormValues(value => {
                return {
                  ...value,
                  firstName: e.target.value
                }
              })} label={formValues.firstName ? '' : 'First Name'} fullWidth />
            </MDBox>
            <MDBox mt={2}>
              <MDInput value={formValues.lastName} name="lastName" type="text" onChange={(e) => setFormValues(value => {
                return {
                  ...value,
                  lastName: e.target.value
                }
              })} label={formValues.lastName ? '' : 'Last Name'} fullWidth />
            </MDBox>
            <MDBox mt={2} >
              <MDInput name="password" type="password" onChange={(e) => setFormValues(value => {
                return {
                  ...value,
                  password: e.target.value
                }
              })} label="Password" fullWidth />
            </MDBox>
            <MDBox display="flex" justifyContent='center' mt={2}>
              <MDButton onClick={editAdminHandler}>
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </Grid>
          <Grid>
            <MDBox mr={4} ml={4} mb={2}>
              <MDTypography variant="h5" mb="10px" fontWeight="medium">
                {`Add Admin`}
              </MDTypography>
              <MDBox >
                <MDInput value={formValuesAdd.email} name="email" type="email" onChange={(e) => setFormValuesAdd(value => {
                  return {
                    ...value,
                    email: e.target.value
                  }
                })} label={formValuesAdd.email ? '' : 'Email'} fullWidth />
              </MDBox>
              <MDBox mt={2} >
                <MDInput name="password" type="password" onChange={(e) => setFormValuesAdd(value => {
                  return {
                    ...value,
                    password: e.target.value
                  }
                })} label="Password" fullWidth />
              </MDBox>
              <MDBox display="flex" justifyContent='center' mt={2}>
                <MDButton onClick={addAdminHandler}>
                  Submit
                </MDButton>
              </MDBox>
            </MDBox>
          </Grid>
          <Grid>
            <AdminTables deleteAdmin={deleteAdmin} lists={lists} />
          </Grid>
        </> : ''}
        <Grid width={'100%'} display={"flex"} justifyContent={"end"}  >
          <MDButton onClick={logoutHandler}>
            Logout
          </MDButton>
        </Grid>
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
