import axios, { type AxiosInstance } from "axios";
import {walletConnectionStore} from "@/stores/wallet.store";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const axiosAuthInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

axiosAuthInstance.interceptors.request.use(
    (config) => {
        return setConfig(config);
    },
    (error) => {
        return Promise.reject(error);
    }
);

const axiosFormDataInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVICE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

axiosFormDataInstance.interceptors.request.use(
    (config) => {
        return setConfig(config);
    }
);

function setConfig(config: any) {
    const store = walletConnectionStore();
    const token = store.getBearerToken;

    const bearerToken = localStorage.getItem("aqaro.auth.token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else if (bearerToken) {
        config.headers.Authorization = `Bearer ${bearerToken}`;
    }

    return config;
}

export {axiosInstance, axiosAuthInstance, axiosFormDataInstance};
