
import { useState, useEffect, useMemo } from "react";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";

// RTL plugins
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "./assets/logo.svg";
import brandDark from "./assets/blacklogo.svg";
import { useCheckTokenQuery } from "store/api";
import { getCookie } from "react-use-cookie";
import Loading from "components/Loading";
import { cloneElement } from "react";
import Popup from "components/Popup";

export default function App() {

  const token = getCookie('auth-token')
  const { data: isAuth, isLoading } = useCheckTokenQuery(token)
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();


  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const [isPopupOn, setIsPopupOn] = useState({
    link: '',
    isOn: false,
    isEditMode: {
      data: {},
    },
  })


  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        // Check if the route requires authentication
        const isProtected = route.protected || false;

        // Use a regular Route or a Navigate based on authentication status
        return isProtected ? (
          <Route
            path={route.route}
            element={isAuth?.success ? cloneElement(route.component, { setIsPopupOn, isPopupOn })
              : <Navigate to="/auth/login" />}
            key={route.key}
            setIsPopupOn={setIsPopupOn}
          />
        ) : (
          <Route exact path={route.route} element={route.component} key={route.key} />
        );
      }

      return null;
    });


  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          {isPopupOn.isOn ? <Popup setIsPopupOn={setIsPopupOn} link={isPopupOn.link} id={isPopupOn.isEditMode?.data.id} popup={isPopupOn} data={isPopupOn.isEditMode?.data} /> : ''}
          {isLoading && <Loading />}
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="Topspin Dashboard"
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
        </>
      )}
      <Routes>
        {getRoutes(routes)}
      </Routes>
    </ThemeProvider>
  );
}
