import store from '../Redux/store';
import * as _ from 'lodash';
import {CANCEL_BET, SET_COUPON_DATA} from "../Redux/types";
import {getCombos, getLiveFixtureData, getSplitProps} from "../Services/apis";
import { updateComboWinningsFromTotal } from '../Redux/actions';
import { formatLiveMarkets } from './helpers';

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
    let minBonusOdd = globalVars.MinBonusOdd,
        bonusInfo = [],
        bonus = 0;
    
    const events = [];
    // get eligible events for bonus
    coupondata.selections.forEach((item, i) => {
        if(item.odds >= minBonusOdd) events.push(item);
    });

    // get unique events in case of split bet
    const uniqueEvents = _.uniqBy(events, 'provider_id');

    // console.log(minBonusOdd);
    //get bonus settings for ticket length
    bonusList.forEach((item, i) => {
        if (coupondata.bet_type === 'Combo') {
            const lastGrouping = coupondata.Groupings[coupondata.Groupings.length - 1];
            if(item.ticket_length === lastGrouping.Grouping)
                bonusInfo = item;
        } else {
            if(item.ticket_length === uniqueEvents.length)
                bonusInfo = item;
        }
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

export const updateLiveData = (msg, fixtures) => {
    const fixtureIndex = fixtures.findIndex(item => item.provider_id === parseInt(msg.Match.matchid));

    if (fixtureIndex !== -1) {
        console.log('found fixture', )

        if (msg.Match.active !== '1') {// remove fixture from array
            fixtures.splice(fixtureIndex, 1);

        } else {// update fixture markets
            const fixture = fixtures[fixtureIndex];
            console.log(fixture.sport_name, fixture.event_name);
            const liveData = fixture.live_data;
            let markets = [];
    
            if (liveData && liveData.markets) {
                markets = liveData.markets;
            }
    
            if (Array.isArray(msg.Match.Odds)) {
                for (const odds of msg.Match.Odds) {
                    if (markets.length) {
                        //find market in existing markets
                        const marketIndex = markets.findIndex(
                            (item) => item.id === odds.id,
                        );
                        if (marketIndex !== -1) {
                            markets[marketIndex] = formatLiveMarkets(odds);
                        } else {
                            const market = formatLiveMarkets(odds);
                            markets.push(market);
                        }
                    } else {
                        const market = formatLiveMarkets(odds);
                        markets.push(market);
                    }
                }
            } else {
                const odds = msg.Match.Odds;
                if (markets.length) {
                    //find market in existing markets
                    const marketIndex = markets.findIndex(
                        (item) => item.id === odds.id,
                    );
                    if (marketIndex !== -1) {
                        markets[marketIndex] = formatLiveMarkets(odds);
                    } else {
                        const market = formatLiveMarkets(odds);
                        markets.push(market);
                    }
                } else {
                    const market = formatLiveMarkets(odds);
                    markets.push(market);
                }
            }
            
            fixture.score = msg.Match.score;
            fixture.match_status = msg.Match.status;
            fixture.status = msg.Match.active;
    
            const live_data = {
                betstatus: msg.Match.betstatus || null,
                match_time: msg.Match.matchtime || null,
                homeRedCards: msg.Match.redcardshome,
                homeYellowCards: msg.Match.yellowcardshome,
                awayRedCards: msg.Match.redcardsaway,
                markets,
                awayYellowCards: msg.Match.yellowcardsaway,
            };
    
            fixture.live_data = live_data;
    
            if (msg.Match.setscores) fixture.setscores = msg.Match.setscores;
            
            fixtures[fixtureIndex] = fixture;
        }
        return fixtures;
    }
}

export const groupTournament = (data) => {
    let ArrKeyHolder = [];
    let Arr = [];
    data.forEach(function(item){
        ArrKeyHolder[item.tournament] = ArrKeyHolder[item.tournament]||{};
        let obj = ArrKeyHolder[item.tournament];

        if(Object.keys(obj).length === 0)
            Arr.push(obj);

        obj.tournamentName  = item.tournament;
        obj.category        = item.category;
        obj.combinability   = item.combinability;
        obj.events          = obj.events || [];

        obj.events.push(item);
        obj.fixtures = groupSelections(obj.events);
    });
    return Arr;
};


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
