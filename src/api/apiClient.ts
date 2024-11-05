import axios, { AxiosError, AxiosInstance } from 'axios';
import { API } from '../config/api.config';

interface IResponse<T> {
  data: T | null;
  message: string;
  status: boolean;
}

interface IGets {
  [key: string]: string | number | boolean | undefined;
}

const createPrivateAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API.HOST || 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
    },
  });
  return instance;
};

export const Axios = createPrivateAxiosInstance();


class Api {
  static async get(endpoint: string, args?: IGets) {
    try {
      const url = new URL(`${API.HOST}${endpoint}`);
      if (args) {
        const searchParams = new URLSearchParams(url.search);
        for (const [key, value] of Object.entries(args)) {
          if (value !== undefined) {
            searchParams.set(key, String(value));
          }
        }
        url.search = searchParams.toString();
      }

      const response = await Axios.get(url.toString());
      return {
        data: response?.data || response.data.data || null,
        message: 'Fetch successfully',
        status: true,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      let message = (axiosError.response?.data as {message: string})?.message || 'An error occurred';
      
      if (axiosError.response?.status === 429) {
        message = 'Too many requests. Please try again later.';
      }
      
      return {
        data: null,
        message,
        status: false,
      };
    }
  }

  static async post<T, U = Record<string, unknown>>(
    endpoint: string,
    data: U
  ): Promise<IResponse<T>> {
    try {
      const response = await Axios.post(endpoint, data);
      return {
        data: response?.data?.data || response?.data,
        message: 'Operation successful',
        status: true,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        data: null,
        message: (axiosError.response?.data as { message?: string })?.message || 'An error occurred',
        status: false,
      };
    }
  }

  static async patch<T, U = Record<string, unknown>>(
    endpoint: string,
    data: U
  ): Promise<IResponse<T>> {
    try {
      const response = await Axios.patch(endpoint, data);
      return {
        data: response?.data?.data || response?.data,
        message: 'Update successful',
        status: true,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        data: null,
        message: (axiosError.response?.data as { message?: string })?.message || 'An error occurred',
        status: false,
      };
    }
  }
}

export default Api;