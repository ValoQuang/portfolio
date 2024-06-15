import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../Dashboard/DashSidebar";
import DashProfile from "../Dashboard/DashProfile";
import DashPosts from "../Dashboard/DashPosts";
import DashUsers from "../Dashboard/DashUsers";
import DashComments from "../Dashboard/DashComments";
import DashboardComp from "../Dashboard/DashboardComp";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    console.log(location);
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === "profile" && <DashProfile />}
      {/* posts... */}
      {tab === "posts" && <DashPosts />}
      {/* users */}
      {tab === "users" && <DashUsers />}
      {/* comments  */}
      {tab === "comments" && <DashComments />}
      {/* dashboard comp */}
      {tab === "dash" && <DashboardComp />}
    </div>
  );
}
