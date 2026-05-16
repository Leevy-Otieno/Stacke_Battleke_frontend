import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import SignUp from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Arena from "./pages/Arena";
import Groups from "./pages/Groups";
import Leaderboards from "./pages/Leaderboards";
import Profile from "./pages/Profile";
import Challenge from "./pages/Challenge";

export default function App() {
  const [currentPage, setCurrentPage] = useState("signup");

  // If on the authorization layout page, render full screen view frame.
  if (currentPage === "signup") {
    return <SignUp setCurrentPage={setCurrentPage} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case "arena":
        return <Arena setCurrentPage={setCurrentPage} />;
      case "groups":
        return <Groups />;
      case "leaderboards":
        return <Leaderboards />;
      case "profile":
        return <Profile />;
      case "challenge":
        return <Challenge />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <Navbar title={currentPage} />
      <main className="pl-72 pr-8 pt-24 pb-8 min-h-screen">{renderPage()}</main>
    </div>
  );
}
