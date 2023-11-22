

import { useEffect, useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";


// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/banner_expansion_desktop.png";
import { getCookie, setCookie } from "react-use-cookie";
import { toast } from "react-toastify";
import { useLoginMutation } from "store/api";
import { useSendVerificationCodeMutation } from "store/api";
import Loading from "components/Loading";
import { useCheckTokenQuery } from "store/api";

function Basic() {

  const navigate = useNavigate()

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    verificationCode: ""
  })

  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const token = getCookie('auth-token')

  const [login, { data: loginMutation, isLoading: loginLoading }] = useLoginMutation();
  const [sendVerificationCode, { isLoading: sendCodeLoading }] = useSendVerificationCodeMutation();
  const { data: isAuth, isLoading:isAuthLoading } = useCheckTokenQuery(token)


  const handleLogin = async (credentials) => {
    try {
      const result = await login(credentials).unwrap();
      if (result.success) {
        setCookie('auth-token', result.token, {
          days: rememberMe ? 7 : 1,
          Secure: true,
        });
      }
      toast.success(result?.message)
    } catch (error) {
      if (Array.isArray(error.data?.message)) {
        error.data?.message.map(el => toast.warn(el))
      } else {
        toast.warn(error.data?.message)
      }
    }
  };

  const handleSendEmail = async (email) => {
    try {
      const result = await sendVerificationCode(email).unwrap();
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
    if (loginMutation?.success || isAuth?.success) {
      navigate('/')
    }
  }, [loginMutation, isAuth, navigate])



  if (loginLoading || sendCodeLoading || isAuthLoading) {
    return <Loading />
  }


  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput type="email" onChange={(e) => setFormValues(value => {
                return {
                  ...value,
                  email: e.target.value
                }
              })} label="Email" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="password" onChange={(e) => setFormValues(value => {
                return {
                  ...value,
                  password: e.target.value
                }
              })} label="Password" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput onChange={(e) => setFormValues(value => {
                return {
                  ...value,
                  verificationCode: e.target.value
                }
              })} type="text" label="Verification Code" fullWidth />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox onClick={() => handleLogin(formValues)} mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth>
                sign in
              </MDButton>
            </MDBox>
            <MDBox onClick={() => handleSendEmail(formValues.email)} mt={1} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth>
                Send Code
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Forget password?{" "}
                <MDTypography
                  component={Link}
                  to="/auth/reset"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Reset
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
