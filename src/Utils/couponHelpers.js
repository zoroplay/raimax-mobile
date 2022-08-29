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
    if (eventMarkets && eventMarkets.length) {
        _.each(eventMarkets, function (value, key) {
            if (value.active === '1' && value.id === market.id && !market.hasSpread) {
                _.each(value.odds, function (item, index) {
                    if (item.active === '1' && item.type === selection.type) {
                        item.market_id = value.id;
                        odd = item;
                    }
                });
            } else if (value.active === '1' && value.type_id === market.id && market.hasSpread) {
                _.each(value.odds, function (item, index) {
                    if (item.active === '1' && item.type === selection.type) {
                        item.market_id = value.id;
                        odd = item;
                    }
                });
            }
        });
    }


    return odd;
}
export const getSpread = (eventMarkets, market) => {
    let specialValue;
    if (eventMarkets && eventMarkets.length) {
        _.each(eventMarkets, (value, key) => {
            if (value.specialOddsValue && value.type_id === market.id && value.active === '1') {
                if(value.specialOddsValue > 0) specialValue = value.specialOddsValue;
            }
        });
    }
    return specialValue;
}


export const checkOddsChange = async (couponData, fixtures, dispatch, globalVars, bonusList) => {
    let updated = false;
    let coupon = {...couponData};
    const selections = coupon.selections;
    // loop through selection
    fixtures.filter(fixture => {
        selections.filter((selection, i) => {
            if(selection.provider_id === fixture.provider_id) {
                // console.log('found fixture');
                if(fixture.live_data && fixture.live_data.markets.length) {
                    const markets = fixture.live_data.markets;
                    // console.log('looping through markets', markets)
                    markets.forEach(market => {
                        if (market.id === selection.market_id) {
                            // console.log('found market', market)

                            market.odds.forEach(odd => {
                                if(odd.type === selection.oddname ) {
                                    if(odd.active === '1' && odd.odds > selection.odds) {
                                        selection.classList = 'valueChanged valueIncreased flashSuccess';
                                        selection.oldOdds = selection.odds;
                                        selection.odds = odd.odds;
                                        coupon.hasError = true;
                                        coupon.errorMsg = 'Attention! some odds have been changed';
                                        updated = true;
                                    } else if (odd.active === '1' && odd.odds < selection.odds) {
                                        selection.classList = 'valueChanged valueDecreased flashDanger';
                                        selection.oldOdds = selection.odds;
                                        selection.odds = odd.odds;
                                        coupon.hasError = true;
                                        coupon.errorMsg = 'Attention! some odds have been changed';
                                        updated = true;
                                    } else if (odd.active === '0') {
                                        // selections.splice(i, 1);
                                        selection.classList = 'valueChanged valueDecreased flashDanger';
                                        coupon.hasError = true;
                                        coupon.errorMsg = 'Attention! some odds have been changed';
                                        selection.hasError = true;
                                        selection.disabled = true;
                                        updated = true;
                                    }
                                }
                            });
                        }
                    })
                    const findMarket = markets.filter(market => market.id === selection.market_id);
                    // console.log('not found', findMarket);
                    if(findMarket.length === 0) {
                        updated = true;
                        coupon.hasError = true;
                        coupon.errorMsg = 'Attention! some odds have been changed';
                        selection.error = true;
                        selection.disabled = true;
                    }
                }
            }
        })
    })
    
    if (updated) {
        coupon.hasLive  = checkIfHasLive(coupon.selections);
      
        if (coupon.selections.length > 0) {
            coupon.totalOdds = calculateTotalOdds(coupon.selections);;
            coupon.selections = selections;
            coupon.hasError = true;
            coupon.errorMsg = 'Attention! some odds have been changed';
            coupon.fixtures = groupSelections(coupon.selections);
            //check bet type
            coupon.bet_type = checkBetType(coupon);

            const winnings = calculateWinnings(coupon, globalVars, bonusList);
            coupon.maxWin = winnings.maxWin;
            coupon.maxBonus = winnings.maxBonus;
            coupon.wthTax = winnings.wthTax;
            coupon.grossWin = winnings.grossWin;

            // check if has live
            coupon.hasLive  = checkIfHasLive(coupon.selections);
            coupon.fixtures = groupSelections(coupon.selections);
            // update coupon
            dispatch({type: SET_COUPON_DATA, payload: coupon});
        } else {
            dispatch({type: CANCEL_BET});
        }
    }
    // return updated;
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
