import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";

const App = () => {
  return (
    <>
    <Header />
      <Outlet />
    </>
  );
};

export default App;
