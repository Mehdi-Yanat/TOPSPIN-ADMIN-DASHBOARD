import Tables from "layouts/tables/matchSchedules";
import PlayOff from "layouts/tables/playoff";
import Leagues from "layouts/tables/leagues";
import Profile from "layouts/profile";
import Login from "layouts/authentication/sign-in/index";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Leagues",
    key: "Leagues",
    icon: <Icon fontSize="small">sports_baseball</Icon>,
    route: "/",
    component: <Leagues />,
    protected: true, // Mark the route as protected
  },
  {
    type: "collapse",
    name: "Match Schedules",
    key: "Match Schedules",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/match-schedules",
    component: <Tables />,
    protected: true, // Mark the route as protected
  },
  {
    type: "collapse",
    name: "Play off",
    key: "Play off",
    icon: <Icon fontSize="small">sports_tennis</Icon>,
    route: "/playoff",
    component: <PlayOff />,
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
