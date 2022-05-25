import React, {Fragment} from "react";
import {calculateBonus, comboName} from "../../../Utils/couponHelpers";
import {useSelector} from "react-redux";
import {SET_COUPON_DATA} from "../../../Redux/types";
import {formatNumber} from "../../../Utils/helpers";

export const SplitBet = ({coupon, dispatch}) => {
    const {SportsbookBonusList, SportsbookGlobalVariable} = useSelector(state => state.sportsBook);
    const amounts = process.env.REACT_APP_FAST_ADD_AMOUNTS.split(',');

    const updateSplitWinnings = (stake) => {
        let coupondata = {...coupon};
        coupondata.totalStake = stake;

        if(stake !== '') {

            coupondata.exciseDuty = coupondata.totalStake * process.env.REACT_APP_EXCISE_DUTY / 100;
            coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;

            coupondata.minStake = parseFloat(stake) / coupondata.noOfCombos;

            //calculate winnings
            let minWinnings = parseFloat(coupondata.minOdds) * parseFloat(coupondata.minStake);
            let maxWinnings = parseFloat(coupondata.maxOdds) * parseFloat(coupondata.minStake);
            //calculate bonus
            coupondata.minBonus = calculateBonus(minWinnings, coupondata, SportsbookGlobalVariable, SportsbookBonusList);
            coupondata.maxBonus = calculateBonus(maxWinnings, coupondata, SportsbookGlobalVariable, SportsbookBonusList);
            coupondata.minGrossWin = parseFloat(coupondata.minBonus) + minWinnings;
            coupondata.minWTH = (coupondata.minGrossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
            coupondata.minWin = coupondata.minGrossWin - coupondata.minWTH;
            coupondata.grossWin = parseFloat(coupondata.maxBonus) + maxWinnings;
            coupondata.wthTax = (coupondata.grossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
            coupondata.maxWin = coupondata.grossWin - coupondata.wthTax;
        }
        return dispatch({type: SET_COUPON_DATA, payload: coupondata});
    }

    const fastAdd = (amount) => {
        let stake = 0;
        if (amount !== 0) {
            stake = amount + parseFloat(coupon.stake);
        }
        updateSplitWinnings(stake);
    }

    return (
        <Fragment>
            <div className="basket-type">
                <div className="table-f">
                    <div className="basket-type__item title">
                        <div>
                            <span>{comboName(coupon.grouped.length)}</span>
                            <span className="pull-right">({coupon.noOfCombos} Bets)</span>
                        </div>
                    </div>
                    <div className="basket-type__item">
                        <div className="betslip__stake pull-right">
                            <div className="stakes">
                                <div className="currency">
                                    <wraptag>{SportsbookGlobalVariable.Currency}</wraptag>
                                </div>
                                <input type="number" onChange={(e) => updateSplitWinnings(e.target.value)} placeholder="Stake" value={coupon.stake} />
                            </div>
                        </div>
                    </div>
                </div>
                {coupon.maxWin > 0 && <div className="txt-r mt5">Potential Win: {formatNumber(coupon.minWin)} to {formatNumber(coupon.maxWin)}</div>}
            </div>
            <div className="basket-preset-values mt10">
                <div className="preset" id="clearStakeButton" onClick={() => fastAdd(0)}>Clear</div>
                {amounts && amounts.map(amount => <div key={amount} className="preset" onClick={() => fastAdd(parseInt(amount))}>{amount}</div>)}

            </div>
        </Fragment>
    )
}
