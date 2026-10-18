import axios, { InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from 'src/store/useUserStore'; // Import your store

interface CustomConfig extends InternalAxiosRequestConfig {
  showLoader?: boolean;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let activeRequests = 0;

const showLoader = () => {
  activeRequests++;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('toggle-global-loader', { detail: true }));
  }
};

const hideLoader = () => {
  activeRequests--;
  if (activeRequests <= 0 && typeof window !== 'undefined') {
    activeRequests = 0;
    window.dispatchEvent(new CustomEvent('toggle-global-loader', { detail: false }));
  }
};

apiClient.interceptors.request.use((config: CustomConfig) => {
  if (config.showLoader) showLoader();

  // 1. Get the latest state from the Zustand store
  const { AccessToken } = useUserStore.getState();

  // 2. If token exists, attach it to the Authorization header
  if (AccessToken) {
    config.headers.Authorization = `Bearer ${AccessToken}`;
  }

  // Common Headers
  config.headers['Content-Type'] = 'application/json; charset=utf-8';
  config.headers['Ocp-Apim-Subscription-Key'] = 'ca68279b8598479b83ea8bb15bdfd138';

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if ((response.config as CustomConfig).showLoader) hideLoader();
    return response;
  },
  (error) => {
    if ((error.config as CustomConfig)?.showLoader) hideLoader();

    // Optional: Handle 401 Unauthorized globally
    if (error.response?.status === 401 && useUserStore.getState().IsLoggedIn) {
      useUserStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
