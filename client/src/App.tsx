import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const App = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default App;
