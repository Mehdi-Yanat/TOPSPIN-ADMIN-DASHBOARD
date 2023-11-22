import Tables from "layouts/tables";
import Profile from "layouts/profile";
import Login from "layouts/authentication/sign-in/index";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/",
    component: <Tables />,
    protected: true, // Mark the route as protected
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    protected: true, // Mark the route as protected
  },
  {
    icon: <Icon fontSize="small">login</Icon>,
    route: "/auth/login",
    component: <Login />,
  },

];

export default routes;
