import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import * as types from "../types";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const initialState = {
    betPlaced: {},
    loadedCoupon: null,
    tipsterBetslip: '',
    coupon:{
        selections: [],
        combos:[],
        totalOdds: 1,
        maxBonus: 0,
        minBonus: 0,
        grossWin: 0,
        maxWin: 0,
        minWin: 0,
        stake: 0,
        totalStake: 0,
        minOdds: 1,
        maxOdds: 1,
        wthTax: 0,
        exciseDuty: 0,
        useBonus: false,
    },
}

const couponData = persistReducer(
    { storage, key: "couponData", whitelist: ["coupon"], stateReconciler: autoMergeLevel2 },
    (state = initialState, action) => {
        switch (action.type) {
            case types.SET_COUPON_DATA:
                return { ...state, coupon: action.payload };

            case types.SET_BET_PLACED:
                return { ...state, betPlaced: action.payload };

            case types.SET_USE_BONUS:
                return {
                    ...state,
                    coupon: {
                        ...state.coupon,
                        useBonus: true
                    }
                };

            case types.SET_LOADED_DATA:
                return { ...state, loadedCoupon: action.payload };

            case types.CANCEL_BET:
                let coupon = {
                    selections: [],
                    combos:[],
                    totalOdds: 1,
                    bonus: 0,
                    maxWin: 0,
                    stake: 0,
                    totalStake: 0,
                    useBonus: false
                };
                return {...state, coupon};

            case types.RESET_COUPON_AMOUNT:
                return {
                    ...state,
                    coupon: {
                        ...state.coupon,
                        stake: 0,
                        maxWin: 0,
                        maxBonus: 0,
                        totalStake: 0,
                        wthTax: 0,
                        exciseDuty: 0,
                        grossWin: 0
                    }
                };
                break;
            case types.SET_TIPSTER_BETSLIPID:
                return {...state, tipsterBetslip: action.payload}
                break;
            default:
                return state;
        }
    }
);


export default couponData;
