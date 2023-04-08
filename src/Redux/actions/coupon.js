import {
    CANCEL_BET,
    SET_BET_PLACED,
    SET_COUPON_DATA,
    RESET_COUPON_AMOUNT, UPDATE_USER_BALANCE, SET_ACTION_PROP, LOADING,
} from "../types";
import {
    calculateBonus,
    calculateTotalOdds,
    calculateWinnings,
    checkBetType, checkIfHasLive,
    groupSelections,
    groupTournament
} from "../../Utils/couponHelpers";
import {Http} from "../../Utils";
import history from "../../Services/history";
import * as _ from 'lodash';
import {calculateExclusionPeriod, validateCombinability} from "../../Utils/helpers";
import {getCombos, getOddsChange, getSplitProps} from "../../Services/apis";
import {toast} from "react-toastify";

export function addToCoupon(fixture, market_id, market_name, odds, odd_id, oddname, ele_id, type='pre') {
    return async (dispatch, getState) => {
        // grab current state
        const state = getState();

        if (odds === '-' || odds === null || odds < 1)
            return false;

        dispatch({type: SET_BET_PLACED, payload: ''});

        const data = {
            provider_id: fixture.provider_id,
            event_id: fixture.event_id,
            event_name: fixture.event_name,
            market_id: market_id,
            market_name: market_name,
            oddname,
            odd_id: odd_id,
            odds: odds,
            element_id: ele_id,
            start_date: fixture.schedule,
            tournament: fixture.sport_tournament_name,
            category: fixture.sport_category_name,
            sport: fixture.sport_name,
            type,
            fixed: false,
            combinability: fixture.combinability || 0

        };
        if (type === 'live') {
            data.in_play_time = fixture.live_data?.match_time ? fixture.live_data?.match_time : "";
            data.in_play_score = fixture.score;
            // data.ht_score = fixture.setscores.;
        }

        let couponData = {...state.couponData.coupon};
        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};
        const bonusList = [...state.sportsBook.SportsbookBonusList];

        if(!couponData.selections.length){
            couponData = {
                selections: [],
                combos:[],
                totalOdds: 1,
                maxBonus: 0,
                minBonus: 0,
                maxWin: 0,
                minWin: 0,
                stake: 0,
                totalStake: 0,
                minOdds: 1,
                maxOdds: 1,
                event_type: type,
                channel: 'mobile',
                wthTax: 0,
                exciseDuty: 0
            };
            couponData.bet_type = 'Single';
            couponData.selections.push(data);
            couponData.totalOdds = (parseFloat(couponData.totalOdds) * parseFloat(data.odds)).toFixed(2);
            //calculate and get pot winnings with bonus
            const winnings = calculateWinnings(couponData, globalVars, bonusList);
            couponData.maxWin = winnings.maxWin;
            couponData.maxBonus = winnings.maxBonus;
            couponData.wthTax = winnings.wthTax;
            couponData.grossWin = winnings.grossWin;
            couponData.grouped = groupSelections(couponData.selections, 'provider_id');
            couponData.tournaments = groupTournament(couponData.selections);

            // check if event is live
            if (type === 'live')
                couponData.hasLive = true;
            //update bets state in redux
            return dispatch({type: SET_COUPON_DATA, payload: couponData});

        }else{
            for (let i = 0; i < couponData.selections.length; i++) {
                //check if it's same event selected and remove it
                if (couponData.selections[i].element_id === data.element_id) {
                    //remove item
                    couponData.selections.splice(i, 1);
                    //check if couponData still has selections
                    if (couponData.selections.length > 0) {
                        // recalculate total odds
                        couponData.totalOdds = calculateTotalOdds(couponData.selections);
                        //group selections by tournament
                        couponData.tournaments = groupTournament(couponData.selections);
                        //check bet type
                        couponData.bet_type = checkBetType(couponData.grouped);

                        const winnings = calculateWinnings(couponData, globalVars, bonusList);
                        couponData.maxWin = winnings.maxWin;
                        couponData.maxBonus = winnings.maxBonus;
                        couponData.wthTax = winnings.wthTax;
                        couponData.grossWin = winnings.grossWin;
                        // check if has live
                        couponData.hasLive  = checkIfHasLive(couponData.selections);
                        return dispatch({type: SET_COUPON_DATA, payload: couponData});
                    } else {
                        return dispatch({type: CANCEL_BET})
                    }
                }
            }
            for (let i = 0; i < couponData.selections.length; i++) {
                if(couponData.selections[i].provider_id === data.provider_id){
                    //remove old selection
                    couponData.selections.splice(i, 1);
                }
            }
            //add selection to selections list
            couponData.selections.push(data);
            // recalculate total odds
            couponData.totalOdds = calculateTotalOdds(couponData.selections);
            //group selections by tournament
            couponData.tournaments = groupTournament(couponData.selections);
            //group selections by match
            couponData.grouped = groupSelections(couponData.selections, 'provider_id');
            //check bet type
            couponData.bet_type = checkBetType(couponData.grouped);
            // check if event is live
            if (type === 'live')
                couponData.hasLive = true;

                // couponData.combos = await getCombos(couponData);
            //calculate and get pot winnings with bonus
            const winnings = calculateWinnings(couponData, globalVars, bonusList);
            couponData.maxWin = winnings.maxWin;
            couponData.maxBonus = winnings.maxBonus;
            couponData.wthTax = winnings.wthTax;
            couponData.grossWin = winnings.grossWin;

            return dispatch({type: SET_COUPON_DATA, payload: couponData});
        }
    }
}

export function fastAdd(amount){
    return (dispatch, getState) => {
        // grab current state
        const state = getState();

        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};

        const bonusList = [...state.sportsBook.SportsbookBonusList];

        const  coupondata = {...state.couponData.coupon};
        if (amount === 0) {
            return dispatch({type: RESET_COUPON_AMOUNT})
        }
        if(coupondata.totalStake === '') {
            coupondata.totalStake = 0;
        }

        coupondata.totalStake = coupondata.totalStake + amount;
        coupondata.exciseDuty = coupondata.totalStake * process.env.REACT_APP_EXCISE_DUTY / 100;
        coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;

        //calculate Winnings
        let winnings = calculateWinnings(coupondata, globalVars, bonusList);
        coupondata.maxWin       = winnings.maxWin;
        coupondata.maxBonus     = winnings.maxBonus;
        coupondata.grossWin     = winnings.grossWin;
        coupondata.wthTax       = winnings.wthTax;

        if (coupondata.bet_type === 'Combo') {
            // console.log(coupondata);
            return dispatch(updateComboWinningsFromTotal(coupondata.stake));
        }
        //set coupon data in redux
        return dispatch({type: SET_COUPON_DATA, payload: coupondata});
    }
};

export function updateWinnings(stake){
    return (dispatch, getState) => {
        // const stake = e.target.value;
        // grab current state
        const state = getState();
        const coupondata = {...state.couponData.coupon};
        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};
        const bonusList = [...state.sportsBook.SportsbookBonusList];
        coupondata.totalStake = stake;

        if (stake !== '') {
            coupondata.exciseDuty = coupondata.totalStake * process.env.REACT_APP_EXCISE_DUTY / 100;
            coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;
            //calculate Winnings
            let winnings = calculateWinnings(coupondata, globalVars, bonusList);
            coupondata.maxWin = winnings.maxWin;
            coupondata.maxBonus = winnings.maxBonus;
            coupondata.wthTax = winnings.wthTax;
            coupondata.grossWin = winnings.grossWin;
        }
        //set coupon data in redux
        return dispatch({type: SET_COUPON_DATA, payload: coupondata});
    }
};

export function updateComboWinningsFromTotal (stake) {
    return (dispatch, getState) => {
        const state = getState();
        // console.log('updating');

        let noOfCombos = 0
        let coupondata = {...state.couponData.coupon};
        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};
        const bonusList = [...state.sportsBook.SportsbookBonusList];

        coupondata.totalStake = stake ? stake : coupondata.totalStake;

        coupondata.exciseDuty = coupondata.totalStake * process.env.REACT_APP_EXCISE_DUTY/100;
        coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;

        if(stake !== '') {
            for (let x = 0; x < coupondata.combos.length; x++) {
                const checkBox = document.getElementById('comb_'+x);
                if(checkBox.checked){
                    coupondata.combos[x].checked = true;
                    // document.getElementById('combo-'+x).classList.add('sel');
                    noOfCombos += coupondata.combos[x].numberOfCombos
                }
            }
            let minStake = parseFloat(stake) / noOfCombos;
            let max = 0
            let min_t = 0;
            let tmp_min = 10000000;
            let comboLength = 0
            for (let x = 0; x < coupondata.combos.length; x++) {
                const checkBox = document.getElementById('comb_'+x);
                if(checkBox.checked){
                    coupondata.combos[x].checked = true;
                    comboLength += coupondata.combos[x].comboLength;

                    let minWin = parseFloat(coupondata.combos[x].minOdds) * parseFloat(minStake);
                    let maxWin = parseFloat(coupondata.combos[x].maxOdds) * parseFloat(minStake);

                    max += maxWin;
                    if (minWin < tmp_min && minWin !== 0)
                        tmp_min = minWin;
                    coupondata.combos[x].minStake = minStake.toFixed(2);
                    coupondata.combos[x].minWins = minWin;
                    coupondata.combos[x].maxWins = maxWin;

                }else{
                    // document.getElementById('combo-'+x).classList.remove('sel');
                    coupondata.combos[x].minStake =  '';
                    coupondata.combos[x].checked = false;
                    coupondata.combos[x].minWins = 0
                    coupondata.combos[x].maxWins = 0
                    // document.getElementById('min_max_'+x).innerText = 0;
                }
            }
            min_t = tmp_min;
            if (min_t === 100000000)
                min_t = 0;
            coupondata.comboSelection = comboLength;
            coupondata.noOfCombos = noOfCombos;
            coupondata.minStake = minStake;
            // coupondata.bet_type = 'Combo';
            //calculate bonus
            coupondata.minBonus = calculateBonus((Math.round(min_t * 100) / 100), coupondata, globalVars, bonusList);
            coupondata.maxBonus = calculateBonus(max, coupondata, globalVars, bonusList);
            coupondata.minGrossWin = parseFloat(coupondata.minBonus) + Math.round(min_t * 100) / 100;
            coupondata.minWTH = (coupondata.minGrossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
            coupondata.minWin = coupondata.minGrossWin - coupondata.minWTH;
            coupondata.grossWin = parseFloat(coupondata.maxBonus) + max;
            coupondata.wthTax = (coupondata.grossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
            coupondata.maxWin = coupondata.grossWin - coupondata.wthTax;
        }
        return dispatch({type: SET_COUPON_DATA, payload: coupondata});
    }
}

export function removeSelection(selection){
    return async (dispatch, getState) => {
        // grab current state
        const state = getState();

        let  coupondata = {...state.couponData.coupon};
        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};
        const bonusList = [...state.sportsBook.SportsbookBonusList];
        //find item index
        let index = coupondata.selections.findIndex(item => (item.event_id === selection.event_id && item.odd_id === selection.odd_id));
        //remove item from list
        coupondata.selections.splice(index, 1)
        //check if couponData still has selections
        if (coupondata.selections.length > 0) {
            const prevBetType = coupondata.bet_type;
            //group selections by match
            coupondata.grouped = groupSelections(coupondata.selections, 'provider_id');
            //check bet type
            coupondata.bet_type = checkBetType(coupondata.grouped);

            if (coupondata.bet_type === 'Split') {
                coupondata = await getSplitProps(coupondata);
            } else {
                // recalculate totalOdds if prev bet type was Split
                if (prevBetType === 'Split') {
                    coupondata.totalOdds = calculateTotalOdds(coupondata.selections);
                    //calculate winnings
                    const minWinnings = parseFloat(coupondata.minOdds) * parseFloat(coupondata.minStake);
                    const maxWinnings = parseFloat(coupondata.maxOdds) * parseFloat(coupondata.minStake);
                    //calculate bonus
                    coupondata.minBonus = calculateBonus(minWinnings, coupondata, globalVars, bonusList);
                    coupondata.maxBonus = calculateBonus(maxWinnings, coupondata, globalVars, bonusList);
                    coupondata.minGrossWin = parseFloat(coupondata.minBonus) + minWinnings;
                    coupondata.minWTH = (coupondata.minGrossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
                    coupondata.minWin = coupondata.minGrossWin - coupondata.minWTH;
                    coupondata.grossWin = parseFloat(coupondata.maxBonus) + maxWinnings;
                    coupondata.wthTax = (coupondata.grossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
                    coupondata.maxWin = coupondata.grossWin - coupondata.wthTax;
                } else { // else remove selection from total odds
                    coupondata.totalOdds = (parseFloat(coupondata.totalOdds) / parseFloat(selection.odds)).toFixed(2);
                }
                //calculate and get pot winnings with bonus
                const winnings = calculateWinnings(coupondata, globalVars, bonusList);

                coupondata.maxWin = winnings.maxWin;
                coupondata.maxBonus = winnings.maxBonus;
                coupondata.wthTax = winnings.wthTax;
                coupondata.grossWin = winnings.grossWin;

                coupondata.combos = await getCombos(coupondata);

                // check if has live
                coupondata.hasLive  = checkIfHasLive(coupondata.selections);
            }

            return dispatch({type: SET_COUPON_DATA, payload: coupondata});
        } else {
            return dispatch({type: CANCEL_BET})
        }
    }
};

export function placeBet(e, type, giftCode){
    return (dispatch, getState) => {
        // set button ele
        let ele = e.target;
        // grab current state
        const state = getState();

        const coupondata = {...state.couponData.coupon};
        // add giftCode to coupondata
        coupondata.giftCode = giftCode;

        if (type === 'bet' && coupondata.stake === 0){
            dispatch({type: LOADING});
            toast.error('Stake cannot be 0');
            return;
        }

        // if (coupondata.selections.length === 2 && coupondata.stake > 2000){
        //     dispatch({type: LOADING});
        //     toast.error('Maximum stake for 2 selections is N2,000');
        //     return;
        // }

        // if (coupondata.hasLive) {
        //     ele = document.getElementById('placeBetBtn');
        //     // toast.error('We cannot accept live bets at the moment');
        //     return;
        // }
        let url;
        if (type === 'bet') {
            url = `sports/place-bet?channel=mobile`;
            // check if user has been self excluded
            const {user} = {...state.auth};

            if (user.settings?.self_exclusion_period) {
                return dispatch({type: SET_ACTION_PROP, payload: {
                        show: true,
                        title: 'Self Exclusion',
                        message: `You have been temporary locked out for the next ${calculateExclusionPeriod(user.settings?.self_exclusion_period)} days due to your responsible gaming self exclusion settings.`
                    }});
            }

        } else {
            url = 'sports/book-bet?channel=mobile'
        }

        //validate combinability
        const combinability = validateCombinability(coupondata.selections.length, coupondata.tournaments);
        // console.log(combinability)
        if (!combinability.success) {
            coupondata.errorMsg = combinability.message;

            window.scrollTo({
                top: 100,
                left: 100,
                behavior: 'smooth'
            });

            toast.error(combinability.message);

            return dispatch({type: SET_COUPON_DATA, payload: coupondata});

        } else {
            coupondata.errorMsg = null;
            dispatch({type: SET_COUPON_DATA, payload: coupondata})
        }

        ele.disabled = true;
        ele.innerHTML = 'Submitting...';

        Http.post(url, coupondata).then(res => {
            ele.disabled = false;
            ele.innerHTML = 'Place Bet';
            if (res.success) {

                if (type === 'bet') {
                    // update user balance
                    dispatch({type: UPDATE_USER_BALANCE, payload: res.balance});
                    // dispatch({type: CANCEL_BET});
                }
                return dispatch({type: SET_BET_PLACED, payload: res});
            } else if (res.message === 'auth_fail') {
                history.go('/login');
            } else if (res.error === 'odds_change') {
                // let bets = this.$store.getters.bets;
                _.each(coupondata.selection, function (value) {
                    _.each(res.events, function (item) {
                        if (value.event_id === item.event_id && value.odd_name === item.odd_name) {
                            value.hasError = true;
                        }
                    });
                });
                toast.error('Attention! some odds have been changed');

                coupondata.errorMsg = 'Attention! some odds have been changed';
                coupondata.hasError = true;
                //update bets state in redux
                return dispatch({type: SET_COUPON_DATA, payload: coupondata});

            } else if (res.error === 'events_started') {
                _.each(coupondata.selections, (value) => {
                    _.each(res.events, (item) => {
                        if (value.event_id === item.event_id) {
                            value.started = true
                        }
                    });
                    return value;
                });
                toast.error('Attention! Some events have started');

                coupondata.errorMsg = 'Attention! Some events have started';
                coupondata.hasError = true;
                coupondata.grouped = groupSelections(coupondata.selections);

                //update bets state in redux
                return dispatch({type: SET_COUPON_DATA, payload: coupondata});

            } else if (res.error === 'events_finished') {
                _.each(coupondata.selections, (value) => {
                    _.each(res.events, (item) => {
                        if (value.event_id === item.event_id) {
                            value.hasError = true
                        }
                    });
                });
                toast.error('Attention! Some events have ended. Remove them to continue.');

                coupondata.errorMsg = 'Attention! Some events have ended. Remove them to continue.';
                coupondata.hasError = true;
                coupondata.grouped = groupSelections(coupondata.selections);

                //update bets state in redux
                return dispatch({type: SET_COUPON_DATA, payload: coupondata});

            } else {
                toast.error(res.message);
            }
        }).catch(err => {

            ele.disabled = false;
            ele.innerHTML = 'Place Bet';
            if(err.response.status === 401){
                toast.error('Please login to place bets');
            }
            // console.log(err);
        });
    }
};

export function oddsChange() {
    return (dispatch, getState) => {
        const state = getState();
        let couponData = {...state.couponData.coupon}
        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};
        const bonusList = [...state.sportsBook.SportsbookBonusList];
        const selections = couponData.selections;
        const data = [];

        selections.forEach(selection => {
            data.push({
                is_live: selection.event_type === 'live' ? true : false,
                match_id: selection.provider_id,
                market_id: selection.market_id,
                odd_id: selection.odd_id,
                odds_value: selection.odds,
                odds_type: selection.oddname
            })
        });

        getOddsChange(data).then(async (res) => {
            if(res.success) {
                const changes = res.data
                // console.log(changes);
                for (let i = 0; i < changes.length; i++) {
                    const selection = selections.find(item => item.odd_id === changes[i].odds_id && item.provider_id === changes[i].match_id);
                    if (selection) {
                        selection.odds = changes[i].odds;
                    }
                }
                couponData.totalOdds = calculateTotalOdds(couponData.selections);
                
                if (couponData.bet_type === 'Split') {
                    couponData = await getSplitProps(couponData);
                    couponData.minStake = parseFloat(couponData.stake) / couponData.noOfCombos;
    
                    //calculate winnings
                    const minWinnings = parseFloat(couponData.minOdds) * parseFloat(couponData.minStake);
                    const maxWinnings = parseFloat(couponData.maxOdds) * parseFloat(couponData.minStake);
                    //calculate bonus
                    couponData.minBonus = calculateBonus(minWinnings, couponData, globalVars, bonusList);
                    couponData.maxBonus = calculateBonus(maxWinnings, couponData, globalVars, bonusList);
                    couponData.minGrossWin = parseFloat(couponData.minBonus) + minWinnings;
                    couponData.minWTH = (couponData.minGrossWin - couponData.stake) * process.env.REACT_APP_WTH_PERC / 100;
                    couponData.minWin = couponData.minGrossWin - couponData.minWTH;
                    couponData.grossWin = parseFloat(couponData.maxBonus) + maxWinnings;
                    const wthTax = (couponData.grossWin - couponData.stake) * process.env.REACT_APP_WTH_PERC / 100;
                    couponData.wthTax = wthTax < 1 ? 0 : wthTax;
                    couponData.maxWin = couponData.grossWin - couponData.wthTax;
    
                    return dispatch({type: SET_COUPON_DATA, payload: couponData});
                } else {
                    // couponData.combos = await getCombos(couponData);
                    //calculate and get pot winnings with bonus
                    const winnings = calculateWinnings(couponData, globalVars, bonusList);
                    couponData.maxWin = winnings.maxWin;
                    couponData.maxBonus = winnings.maxBonus;
                    couponData.wthTax = winnings.wthTax;
                    couponData.grossWin = winnings.grossWin;

                    return dispatch({type: SET_COUPON_DATA, payload: couponData});
                
                }
            }
        }).catch(e => {
            console.log(e.message);
        })
    }
}