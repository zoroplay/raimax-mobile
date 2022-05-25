import store from '../Redux/store';
import * as _ from 'lodash';
import {CANCEL_BET, SET_COUPON_DATA} from "../Redux/types";
import {getCombos, getLiveFixtureData, getSplitProps} from "../Services/apis";

const state = store.getState();

export const calculateWinnings = (couponData, globalVars, bonusList) => {
    //calculate winnings
    let maxWin = parseFloat(couponData.totalOdds) * parseFloat(couponData.stake);
    //calculate bonus
    let maxBonus = calculateBonus(maxWin, couponData, globalVars, bonusList);
    //add bonus to max winnings
    let total = (parseFloat(maxWin) + parseFloat(maxBonus));
    // calculate With-holding tax
    let wthTax = (total - couponData.stake) * process.env.REACT_APP_WTH_PERC / 100;

    return {maxWin: parseFloat(total - wthTax).toFixed(2), grossWin: total, maxBonus:maxBonus, wthTax};
};

export const calculateTotalOdds = (selections) => {
    let totalOdds = 1;

    selections.forEach(selection => totalOdds = totalOdds * selection.odds);

    return totalOdds;
}

export const calculateBonus = (maxWin, coupondata, globalVars, bonusList) => {
    let ticket_length = 0,
        minBonusOdd = globalVars.MinBonusOdd,
        bonusInfo = [],
        bonus = 0;
    //count eligible tickets for bonus
    coupondata.selections.forEach((item, i) => {
        if(item.odds >= minBonusOdd){
            ticket_length++;
        }
    });
    // console.log(minBonusOdd);
    //get bonus settings for ticket length
    bonusList.forEach((item, i) => {
        if(item.ticket_length === ticket_length)
            bonusInfo = item;
    })
    //calculate total bonus
    if(bonusInfo.bonus !== undefined){
        bonus = (maxWin * parseFloat(bonusInfo.bonus))/100;
    }
    return bonus;
};

export const checkBetType = (grouped) => {
    let betType = 'Multiple';
    grouped.forEach((item) => {
        if(item.selections.length > 1){
            betType = 'Split';
            return false;
        }
    })
    return betType;
};


export const createID = (event_id, market_id, odd_name, odd_id) => {
    let oddname = String(odd_name).replace(/[^a-zA-Z0-9]/g,'_');
    return event_id+'_'+market_id+'_'+oddname+'_'+odd_id
};


export const printTicket = (ticket) => {
    let url = process.env.baseURL+'/print-ticket/'+ticket;
    window.open(url, 'mywin','left=350,top=250,width=250,height=300,toolbar=1,resizable=0');
}

export const groupSelections = (data) => {
    let ArrKeyHolder = [];
    let Arr = [];
    data.forEach(function(item){
        ArrKeyHolder[item.provider_id] = ArrKeyHolder[item.provider_id]||{};
        let obj = ArrKeyHolder[item.provider_id];

        if(Object.keys(obj).length === 0)
            Arr.push(obj);

        obj.event_name  = item.event_name;
        obj.event_id    = item.event_id;
        obj.type        = item.type;
        obj.started     = item.start_date;
        obj.score       = item.score;
        obj.selections  = obj.selections || [];

        obj.selections.push(item);
    });
    return Arr;
};

export const getLiveOdds = (eventMarkets, market, selection) => {
    let odd = 0;
    if (eventMarkets.length) {
        _.each(eventMarkets, function (value, key) {
            if (value.TypeId === market.TypeId) {
                _.each(value.Selections, function (item, index) {
                    if (item.TypeId === selection.TypeId && item.Name === selection.Name) {
                        // if (item.status === 100) {
                        odd = item;
                        // }
                    }
                });
            }
        });
    }

    return odd;
}

export const getSpread = (eventMarkets, market) => {
    let specialValue = 0;
    if (eventMarkets.length) {
        _.each(eventMarkets, function (value, key) {
            if (value.TypeId === market.id) {
                specialValue = value.SpecialValue;
            }
        });
    }

    return specialValue;
}


export const checkOddsChange = async (couponData, dispatch, globalVars, bonusList) => {
    let updated = false;
    let coupon = {...couponData};
    const selections = coupon.selections;
    // loop through selection
    for (let i = 0; i < selections.length; i++){
        if (selections[i]?.type === 'live') {
            await getLiveFixtureData(selections[i]?.event_id).then(res => {
                if (res.Id !== 0) {
                    // get event
                    const match = res.Tournaments[0].Events[0];
                    // get markets
                    const markets = match.Markets;

                    markets.forEach((item, key) => {
                        item.Selections.forEach((newSelection, s) => {
                            if (newSelection.Id === selections[i]?.odd_id) {
                                // update score
                                selections[i].score = match.Score;
                                selections[i].ht_score = match.SetScores;

                                if (newSelection.Odds[0].Value === 0) {
                                    coupon.hasError = true;
                                    coupon.errorMsg = 'Attention! An expired or suspended event has been removed from betslip';
                                    // remove selection from coupon
                                    selections.splice(i, 1);
                                    updated = true;
                                } else if (newSelection.Odds[0].Value !== selections[i]?.odds) {
                                    updated = true;
                                    if (newSelection.Odds[0].Value > selections[i].odds) {
                                        selections[i].oddsClass = 'icon-odds-up txt-odds-up';
                                    } else if (newSelection.Odds[0].Value < selections[i].odds) {
                                        selections[i].oddsClass = 'icon-odds-down txt-odds-down';
                                    }
                                    selections[i].odds = newSelection.Odds[0].Value;
                                    selections[i].hasError = true;

                                }
                            }
                        });
                    });
                }
            });
        }
    }
    if (updated) {
        if (coupon.selections.length > 0) {
            coupon.totalOdds = calculateTotalOdds(coupon.selections);
            coupon.selections = selections;
            coupon.hasError = true;
            // coupon.errorMsg = 'Attention! some odds? have been changed';
            coupon.grouped = groupSelections(selections);
            //check bet type
            couponData.bet_type = checkBetType(couponData.grouped);

            if (couponData.bet_type === 'Split') {
                coupon = await getSplitProps(coupon);
            } else {
                coupon.combos = await getCombos(coupon);
                // calculate winnings
                let maxWin = parseFloat(coupon.totalOdds) * parseFloat(coupon.stake);
                // calculate bonus
                let maxBonus = calculateBonus(maxWin, coupon, globalVars, bonusList);
                // add bonus to max winnings
                coupon.maxWin = (parseFloat(maxWin) + parseFloat(maxBonus));
                coupon.maxBonus = maxBonus;
            }
            // check if has live
            couponData.hasLive  = checkIfHasLive(couponData.selections);

            // update coupon
            dispatch({type: SET_COUPON_DATA, payload: coupon});
        } else {
            dispatch({type: CANCEL_BET});
        }
    }
    return updated;
}

export const comboName = (len) => {
    switch (len) {
        case 1:
            return ' Singles'
            break;
        case 2:
            return ' Doubles'
            break;
        case 3:
            return ' Trebles'
            break;
        default:
            return +' '+ len + ' folds'
            break;
    }
}

export const checkIfHasLive = (selections) => {
    let hasLive = false;
    selections.forEach((item) => {
        if(item.type === 'live'){
            hasLive = true;
        }
    })
    return hasLive;
};
