import React, { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return children;
};

export default ProtectedRoute;
