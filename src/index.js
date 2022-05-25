import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import "./Assets/scss/app.scss";
import "react-datepicker/dist/react-datepicker.css";
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { PersistGate } from "redux-persist/integration/react";
import {Router} from 'react-router-dom';
import history from './Services/history';
import store, { persistor } from "./Redux/store";

ReactDOM.render(
    <React.StrictMode>
        {/* Provide Redux store */}
        <Provider store={store}>
            {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
            <PersistGate persistor={persistor} >
            <Router history={history}>
                <App />
            </Router>
            </PersistGate>
        </Provider>
    </React.StrictMode>,
  document.getElementById('project')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
