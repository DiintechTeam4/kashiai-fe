import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import NavbarForAuth from "./components/NavbarForAuth";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import WelcomePage from "./components/WelcomePage";
import Astro from "./components/modules/Astro";
import Pooja from "./components/modules/Pooja";
import Store from "./components/modules/Store";
import Darshan from "./components/modules/Darshan";
import "./App.css";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import PhotoGallery from "./components/Gallery";
import Keys from "./components/modules/Keys";
import Credit from "./components/modules/Credit";
import UserProfile from "./components/modules/UserProfile";
import Overview from "./components/modules/Overview";
import Layout from "./components/Layout";
import Poojas from "./components/modules/Poojas";
import Payments from "./components/modules/Payments";
import Notifications from "./components/modules/Notifications";
import User from "./components/modules/User";
import Pandit from "./components/modules/Pandit";
import Yatra from "./components/modules/Yatra";
import Chat from "./components/modules/Chat";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        <Route
          path="/admin"
          element={
            !isAuthenticated ? <WelcomePage /> : <Navigate to="/dashboard" />
          }
        />

        {/* Show NavbarForAuth for login and signup pages */}
        <Route
          path="/login"
          element={
            <>
              <NavbarForAuth />
              <LoginForm setIsAuthenticated={setIsAuthenticated} />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <NavbarForAuth />
              <SignupForm />
            </>
          }
        />

        {/* Show Navbar only for authenticated users */}

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Layout>
                <Overview />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard/astro"
          element={
            isAuthenticated ? (
              <Layout>
                <Astro />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard/pandit"
          element={
            isAuthenticated ? (
              <Layout>
                <Pandit/>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard/yatra"
          element={
            isAuthenticated ? (
              <Layout>
                <Yatra/>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard/pooja"
          element={
            isAuthenticated ? (
              <Layout>
                <Poojas />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard/darshan"
          element={
            isAuthenticated ? (
              <Layout>
                <Darshan />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard/store"
          element={
            isAuthenticated ? (
              <Layout>
                <Store />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard/keys"
          element={
            isAuthenticated ? (
              <Layout>
                <Keys />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/dashboard/credit"
          element={
            isAuthenticated ? (
              <Layout>
                <Credit />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard/astro/chat/:astroId"
          element={
          (
          <Layout>
            <Chat/>
          </Layout>
          
          )}
        />

        <Route
          path="/dashboard/users"
          element={
            isAuthenticated ? (
              <Layout>
                <UserProfile />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard/payments"
          element={
            isAuthenticated ? (
              <Layout>
                <Payments/>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
         <Route
          path="/dashboard/notifications"
          element={
            isAuthenticated ? (
              <Layout>
                <Notifications/>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/dashboard/user/:userid"
          element={
            isAuthenticated ? (
              <Layout>
                <User/>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/gallery"
          element={
            <>
              <Navbar />
              <PhotoGallery />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
