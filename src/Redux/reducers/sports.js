import {
    SET_SPORT,
    SET_FIXTURE,
    SET_FIXTURES,
    SET_SPORTS,
    SET_CATEGORIES,
    SET_TOURNAMENTS,
    SET_ACTIVE_PERIOD,
    SET_BONUS_LIST,
    SET_GLOBAL_VAR, SET_TOAST_PROPS, SET_LOADING_PROP, SHOW_MODAL, SET_ACTION_PROP, SET_SHOW_DOWNLOAD,
} from '../types'
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
    sport: {},
    sports: [],
    categories: [],
    tournaments: [],
    fixtures: [],
    fixture: {},
    activePeriod: 'all',
    SportsbookBonusList: [],
    SportsbookGlobalVariable: {},
    toastProp: {
        show: false,
        message: '',
        color: 'danger'
    },
    loadingProp: {},
    modal: {},
    actionProp: {},
    showDownload: true
}

export const sportsBook = persistReducer(
    { storage, key: "config", whitelist: ["SportsbookBonusList", "SportsbookGlobalVariable"] },
    (state = initialState, action) => {
        switch (action.type) {
            case SET_BONUS_LIST: {
                return {...state, SportsbookBonusList: action.payload };
            }
            case SET_GLOBAL_VAR: {
                return {...state, SportsbookGlobalVariable: action.payload };
            }
            default:
                return state;
        }
    }
);

export const sportsData = (state = initialState, action) => {
    switch (action.type) {
        case SET_SPORT:
            return { ...state, sport: action.payload };

        case SET_SPORTS:
            return { ...state, sports: action.payload };

        case SET_ACTIVE_PERIOD:
            return { ...state, activePeriod: action.payload };

        case SET_CATEGORIES:
            return { ...state, categories: action.payload };

        case SET_TOURNAMENTS:
            return { ...state, tournaments: action.payload };

        case SET_FIXTURES:
            return { ...state, fixtures: action.payload };

        case SET_FIXTURE:
            return { ...state, fixture: action.payload };

        case SET_TOAST_PROPS:
            return { ...state, toastProp: action.payload };

        case SET_LOADING_PROP:
            return { ...state, loadingProp: action.payload };

        case SET_ACTION_PROP:
            return { ...state, actionProp: action.payload };

        case SHOW_MODAL:
            return { ...state, modal: action.payload };

        case SET_SHOW_DOWNLOAD:
            return { ...state, showDownload: false };

        default:
            return state;
    }
}
