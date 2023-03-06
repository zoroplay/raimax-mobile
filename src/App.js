import React from "reactn";
/**
 * packages
 */
import { SWRConfig } from "swr";
import { ToastContainer } from "react-toastify";

/**
 * others
 */
import { ErrorBoundary, Http } from "./Utils";
import reducer from "./Reducers";
import Routes from "./Routes";
import {useCallback, useEffect} from "react";
import {fetchBonusList, fetchGlobalVars} from "./Services/apis";
import {useDispatch, useSelector} from "react-redux";
import * as types from './Redux/types';

/**
 * inits
 */
reducer();

export default function App() {
    const dispatch = useDispatch();

    const {modal} = useSelector((state) => state.sportsData);

    const init = useCallback(() => {
        Promise.all([
            fetchBonusList(),
            fetchGlobalVars()
        ]).then(res => {
            dispatch({type: types.SET_BONUS_LIST, payload: res[0]});
            dispatch({type: types.SET_GLOBAL_VAR, payload: res[1]});
        });

    }, [dispatch]);

    useEffect(() => {
        init();
    }, [init]);

    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
  return (
      <ErrorBoundary>
          <SWRConfig
              value={{
                  fetcher: (url) => Http.get(url).then((res) => res),
                  refreshInterval: 15 * 60 * 1000,
                  shouldRetryOnError: false,
                  revalidateOnFocus: false,
                  errorRetryInterval: 0,
                  errorRetryCount: 2,
              }}
          >
              <div className={`app ${(modal?.show) ? 'modal-open' : ''}`}>
                  <Routes />
              </div>
          </SWRConfig>
          <ToastContainer position="bottom-center" hideProgressBar closeOnClick/>
      </ErrorBoundary>
  );
}
