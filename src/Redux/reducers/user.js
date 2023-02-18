import * as Actions from '../types';
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import * as types from "../types";
import {generateSignature} from "../../Utils/helpers";

const initialState = {
    role: [],//guest
    user: {},
    isAuthenticated: false,
    access_token: null,
    virtualURL: `${process.env.REACT_APP_GLOBALBET_PROD}/engine/web/autologin/account?webRedirectTo=%2Fresponsive%2Fext%2Fskinbs%2Fvspro.jsp%3FhomeUrl%3D${process.env.REACT_APP_SITE_URL}%26signature%3D${generateSignature()}%26agent=${process.env.REACT_APP_GLOBALBET_ID}_WEB`
};

const userData = persistReducer(
    { storage, key: "auth", whitelist: ["user", 'access_token', 'isAuthenticated'] },
    (state = initialState, action) => {
        switch ( action.type )
        {
            case Actions.SET_USER_DATA:
            {
                return {
                    ...initialState,
                    ...action.payload
                };
            }
            case Actions.REMOVE_USER_DATA:
            {
                return {
                    ...initialState
                };
            }
            case Actions.UPDATE_USER_DATA:
            {
                return {
                    ...state,
                    user: action.payload
                };
            }
            case types.UPDATE_USER_BALANCE: {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        balance: action.payload,
                    }
                }
            }
            case Actions.USER_LOGGED_OUT:
            {
                return initialState;
            }
            case types.UPDATE_USERNAME:
            {
                return {
                    ...state,
                    username: action.payload
                };
            }
            case types.UPDATE_VIRTUAL_LINK:
            {
                return {
                    ...state,
                    virtualURL: action.payload
                };
            }
            default:
            {
                return state
            }
        }
    }
);

export default userData;
