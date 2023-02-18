import axios from "axios";
import store from '../Redux/store';
import {toast} from "react-toastify";
import {createBrowserHistory} from "history";
import {REMOVE_USER_DATA} from "../Redux/types";

export const Http = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API : process.env.REACT_APP_DEV_API,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

Http.interceptors.request.use((config) => {
  const url = config?.url?.split("/") || [];

  const {
    auth: { access_token }
  } = store.getState();
  if (!["login", "forgotten"].includes(url[1]))
    config.headers["Authorization"] = `Bearer ${access_token}`;

  return config;
});

Http.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status) {
        if (error.response.status === 401) {
          store.dispatch({type: REMOVE_USER_DATA});
          toast.error("Your session has expired. Pleas login to continue");
          createBrowserHistory().push('/');
        }

        if (error.response.status === 500) {
          // toast(<Notify body="A server error occurred" type="error" />);
        }

      }

      return Promise.reject(error);
    }
);

export default Http;
