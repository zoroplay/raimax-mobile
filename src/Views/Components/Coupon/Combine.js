import React from "react";
import {calculateBonus, comboName} from "../../../Utils/couponHelpers";
import {useSelector} from "react-redux";
import {SET_COUPON_DATA} from "../../../Redux/types";
import {formatNumber} from "../../../Utils/helpers";

export const Combine = ({coupon, dispatch}) => {
    const {SportsbookBonusList, SportsbookGlobalVariable} = useSelector(state => state.sportsBook);

    const minMaxWin = (e, combo, i) => {
        let val = e.target.value
        let coupondata = {...coupon};

        if(val !== '' && val !== 0){
            // document.getElementById('comb_'+i).checked = true
            let minWin = parseFloat(combo.minOdds) * val
            let maxWin = parseFloat(combo.maxOdds) * val

            coupondata.combos[i].minWins = minWin;
            coupondata.combos[i].maxWins = maxWin;
            coupondata.combos[i].minStake= val;
            coupondata.combos[i].checked = true;

            let total = 0;
            let min = 0;
            let max = 0;
            let min_t = 0;
            let tmp_min = 100000000;
            let comboLength = 0;
            let noOfCombos = 0;
            let minStake = 0
            for (let x = 0; x < coupondata.combos.length; x++) {
                // console.log(coupondata.combos[x].minOdds)
                if(coupondata.combos[x].minStake !== undefined && coupondata.combos[x].minStake !== ''){
                    comboLength += coupondata.combos[x].comboLength;
                    noOfCombos += coupondata.combos[x].numberOfCombos;
                    total += parseFloat(coupondata.combos[x].numberOfCombos) * parseFloat(coupondata.combos[x].minStake)
                    min = parseFloat(coupondata.combos[x].minOdds) * parseFloat(coupondata.combos[x].minStake)
                    max += parseFloat(coupondata.combos[x].maxOdds) * parseFloat(coupondata.combos[x].minStake)
                    if (min < tmp_min && min !== 0)
                        tmp_min = min;
                }
            }
            min_t = tmp_min;
            if (min_t === 100000000)
                min_t = 0;

            minStake = (total/noOfCombos);
            //calculate bonus
            coupondata.minBonus = calculateBonus((Math.round(min_t * 100) / 100), coupondata, SportsbookGlobalVariable, SportsbookBonusList);
            coupondata.maxBonus =  calculateBonus(max, coupondata, SportsbookGlobalVariable, SportsbookBonusList);

            coupondata.minGrossWin = parseFloat(coupondata.minBonus) + Math.round(min_t * 100) / 100;
            coupondata.minWTH = (coupondata.minGrossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
            coupondata.minWin = coupondata.minGrossWin - coupondata.minWTH;
            coupondata.grossWin = parseFloat(coupondata.maxBonus) + max;
            coupondata.wthTax = (coupondata.grossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
            coupondata.maxWin = coupondata.grossWin - coupondata.wthTax;
            coupondata.totalStake =  total;
            coupondata.exciseDuty = coupondata.totalStake * process.env.REACT_APP_EXCISE_DUTY / 100;
            coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;
            coupondata.comboSelection = comboLength;
            coupondata.noOfCombos = noOfCombos;
            coupondata.minStake = minStake.toFixed(2);
            coupondata.bet_type = 'Combo';

            // document.getElementById('min_max_'+i).innerText = formatNumber(minWin) + '/' + formatNumber(maxWin);

            return dispatch({type: SET_COUPON_DATA, payload: coupondata});

        }
    }
    return (
        <>
            {coupon.combos.map((combo, index) =>
            <>
                <div className="basket-type ">
                    <div className="table-f">
                        <div className="basket-type__item title">
                            <div>
                                <span>{comboName(combo.comboLength)}</span>
                                <span className="txt-primary ml10" />
                                <span className="pull-right">({combo.numberOfCombos} Bet{combo.numberOfCombos > 1 && 's'})</span>
                            </div>
                        </div>
                        <div className="basket-type__item">
                            <div className="betslip__stake pull-right">
                                <div className="stakes">
                                    <div className="currency">
                                        <wraptag>{SportsbookGlobalVariable.Currency}</wraptag>
                                    </div>
                                    <input
                                        type="number"
                                        id="inputStake-combination-5"
                                        placeholder="Stake"
                                        value={combo.minStake}
                                        onChange={(e) => minMaxWin(e, combo, index)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {combo.maxWins > 0 && <div className="txt-r mt5">Potential Win: <b>{formatNumber(combo.minWins)}</b> to <b>{formatNumber(combo.maxWins)}</b></div>}
                </div>
                <hr className="gray mt5" />
            </>
            )}
        </>
    )
}
