import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./components/Home/Home";
import Signin from "./components/Pages/SignUp";
import Signup from "./components/Pages/SignIn";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateRoute from "./utils/PrivateRoute";
import OnlyAdminPrivateRoute from "./utils/OnlyAdminPrivateRoute";
import CreatePost from "./components/Pages/CreatePost";
import UpdatePost from "./components/Pages/UpdatePost";
import About from "./components/Pages/About";
import Projects from "./components/Pages/Projects";

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
        path: "about",
        index: true,
        element: (
          <>
            <About />
          </>
        ),
      },
      {
        path: "projects",
        index: true,
        element: (
          <>
            <Projects />
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
      {
        element: (
          <>
            <OnlyAdminPrivateRoute />
          </>
        ),
        children: [
          {
            path: "create-post",
            index: true,
            element: (
              <>
                <CreatePost />
              </>
            ),
          },
          {
            path: "update-post/:postId",
            index: true,
            element: (
              <>
                <UpdatePost />
              </>
            ),
          },
        ],
      },
    ],
  },
]);
