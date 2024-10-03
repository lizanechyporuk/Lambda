import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomeModule from "./modules/WelcomeModule/WelcomeModule";
import AccountModule from "./modules/AccountModule/AccountModule";
import ProtectedRoute from "components/ProtectedRoute/ProtectedRoute";
import { useEffect } from "react";
import apiClient from "scripts/api/axios";
import "styles/main.scss";
import { refreshAccessToken } from "scripts/auth/auth";

const App: React.FC = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const success = await refreshAccessToken();

        if (!success) {
          console.log("Token refresh failed");
          window.location.href = "/sign-in";
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<WelcomeModule />} />
        <Route path="/sign-up" element={<WelcomeModule />} />
        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <AccountModule />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
