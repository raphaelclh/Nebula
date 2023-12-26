import React, { Suspense, lazy } from "react";
import RouteList from "./components/Routes";
import TopBar from "./components/TopBar";
import {
  BrowserRouter,
  Route,
  Routes,
  useMatch,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import { DrawerHeader } from "./components/SideMenu";

import LazyPageLoader from "../../components/LazyPageLoader/index";
import { CssBaseline, Box, useTheme } from "@mui/material";
import SideMenu from "./components/SideMenu";
import Container from "@mui/material/Container";
import FrontPageWrapper from "./components/FrontPage/FrontPageWrapper";
import CustomRoute from "./components/CustomRoutes";
import NotFound from "../../components/NotFoundPage";
import Dashboard from "../dashboard";

export const drawerWidth = 240;

const Login = lazy(() => import("./components/FrontPage/Login"));

const Schedule = lazy(() => import("../schedule"));

interface PageInformationContextProps {
  pageTitle: string;
  changePageTitle: (pageTitle: string) => void;
}

export const PageInfomationContext =
  React.createContext<PageInformationContextProps>({
    pageTitle: "",
    changePageTitle: () => {},
  });

const DefaultContainer = () => {
  const [open, setOpen] = React.useState<boolean>(true);

  const [pageTitle, setPageTitle] = React.useState<string>("");

  const changePageTitle = React.useCallback((pageTitle: string) => {
    setPageTitle(pageTitle);
  }, []);

  const theme = useTheme();

  return (
    <Box sx={{ display: "flex" }}>
      <PageInfomationContext.Provider
        value={{
          pageTitle: pageTitle,
          changePageTitle,
        }}
      >
        <TopBar open={open} setOpen={setOpen} />
        <SideMenu open={open} setOpen={setOpen} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Outlet />
        </Box>
      </PageInfomationContext.Provider>
    </Box>
  );
};

const Root: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DefaultContainer />,
      errorElement: <NotFound />,
      children: [
        {
          path: "/dashboard",
          lazy: async () => ({
            Component: (await import("../dashboard")).default,
          }),
        },
        {
          path: "schedule",
          lazy: async () => ({
            Component: (await import("../schedule")).default,
          }),
        },
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("../settings")).default,
          }),
        },
      ],
    },
    {
      path: "/login",
      lazy: async () => ({
        Component: (await import("./components/FrontPage/Login")).default,
      }),
    },
  ]);
  console.log(router);
  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
    </>
  );
};

export default Root;
