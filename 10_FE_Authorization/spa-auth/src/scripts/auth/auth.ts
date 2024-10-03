import apiClient from "../api/axios";

export const signUp = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/sign_up", { email, password });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      return { error: "User is already signed up" };
    } else {
      console.error("Sign Up Error:", error);
      return { error: "An error occurred during sign up. Please try again." };
    }
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/login", null, {
      params: {
        email: email,
        password: password,
      },
    });

    if (response.status === 200 && response.data.body) {
      const { access_token, refresh_token } = response.data.body;

      if (access_token && refresh_token) {
        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("userEmail", email);

        return true;
      }
    }
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert("Invalid email or password!");
    } else {
      console.error("Login Error:", error);
    }

    return false;
  }
};

export const getUserData = async () => {
  try {
    const response = await apiClient.get("/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await apiClient.post("/refresh", null, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });

    if (response.status === 200 && response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      return true;
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return false;
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    localStorage.clear();
    return false;
  }
};

export const logout = () => {
  localStorage.clear();
};
