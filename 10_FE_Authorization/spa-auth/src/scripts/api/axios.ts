import axios from "axios";

const API_URL = "http://142.93.134.108:1111";

let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken");

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await apiClient.post("/refresh", null, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        accessToken = data.accessToken;
        localStorage.setItem("accessToken", data.accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        console.error("Refresh token expired or invalid", err);
        localStorage.clear();
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
