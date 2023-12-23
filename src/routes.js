import Tables from "layouts/tables/matchSchedules";
import PlayOff from "layouts/tables/playoff";
import Leagues from "layouts/tables/leagues";
import Results from "layouts/tables/results";
import Players from "layouts/tables/players";
import Profile from "layouts/profile";
import Login from "layouts/authentication/sign-in/index";

// @mui icons
import Icon from "@mui/material/Icon";
import Error from "components/Error";
import PopupManager from "layouts/popupManager/popup";

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
    name: "Players",
    key: "Players",
    icon: <Icon fontSize="small">groups</Icon>,
    route: "/players",
    component: <Players />,
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
    name: "Results",
    key: "Results",
    icon: <Icon fontSize="small">scoreboard</Icon>,
    route: "/results",
    component: <Results />,
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
    type: "collapse",
    name: "Popup",
    key: "popup",
    icon: <Icon fontSize="small">design_services</Icon>,
    route: "/popup",
    component: <PopupManager />,
    protected: true, // Mark the route as protected
  },
  {
    icon: <Icon fontSize="small">login</Icon>,
    route: "/auth/login",
    component: <Login />,
  },
  {
    route: "*",
    component: <Error />,
  },

];

export default routes;
