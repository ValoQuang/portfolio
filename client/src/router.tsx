import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/Pages/Home";
import Signin from "./components/Pages/SignUp";
import Signup from "./components/Pages/SignIn";
import Dashboard from "./components/Pages/Dashboard";
import PrivateRoute from "./utils/PrivateRoute";

export const router = createBrowserRouter([
  {
    element: <App />,
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
        element: (
          <>
            <PrivateRoute />
          </>
        ),
        children: [
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
    ],
  },
]);
