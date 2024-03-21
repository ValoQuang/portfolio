import { Outlet, createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import App from "./App";
import Home from "./components/Pages/Home";
import Signin from "./components/Pages/Signin";
import Signup from "./components/Pages/Signup";
import Dashboard from "./components/Pages/Dashboard";

const LazyApp = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <App />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <LazyApp />,
    children: [
      {
        path: "",
        index: true,
        element: (
          <>
            <Home />
          </>
        ),
      },
      {
        path: "sign-in",
        index: true,
        element: (
          <>
            <Signin />
          </>
        ),
      },
      {
        path: "sign-up",
        index: true,
        element: (
          <>
            <Signup />
          </>
        ),
      },
      {
        path: "dash-board",
        index: true,
        element: (
          <>
            <Dashboard />
          </>
        ),
      },
    ],
  },
]);
