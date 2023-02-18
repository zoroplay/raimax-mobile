import React, {Fragment, useEffect, useState} from "react";
import { placeBet, removeSelection} from "../../Redux/actions";
import {CANCEL_BET, SET_COUPON_DATA, SET_USE_BONUS} from "../../Redux/types";
import {formatNumber} from "../../Utils/helpers";
import {useSelector} from "react-redux";
import { checkOddsChange, } from "../../Utils/couponHelpers";
import {SplitBet} from "./Coupon/SplitBet";
import {Multiple} from "./Coupon/Multiple";
import {Combine} from "./Coupon/Combine";
// import {toast} from "react-toastify";

export default function Selections({coupon, dispatch}){
    const {isAuthenticated, user} = useSelector((state) => state.auth);
    const {SportsbookGlobalVariable, SportsbookBonusList} = useSelector((state) => state.sportsBook);
    const [allowChange, setAllowChange] = useState(true);

    // const listenForOddsChange = async (couponData) => {
    //     if (couponData.hasLive) {
    //         await checkOddsChange(couponData, dispatch, SportsbookGlobalVariable, SportsbookBonusList);
    //     }
    // }

    // useEffect(() => {

    //     const interval = setInterval(async () => {
    //         await listenForOddsChange(coupon);
    //     }, 10000);

    //     return () => clearInterval(interval);
    // }, [coupon]);

    const setTab = (tab) => {
        let newCoupon = {...coupon};
        if (tab === 'Single' && coupon.selections.length > 1) {
            newCoupon.bet_type = 'Single';
        } else if (coupon.selections.length === 1){
            return;
        } else {
            newCoupon.bet_type = tab;
        }
        return dispatch({type: SET_COUPON_DATA, payload: newCoupon});
    }

    return (
        <Fragment>
            <div className="selection-counter table-f pt10 pb10">
                <div className="selection-counter__selections"><span>{coupon.selections.length}</span><span
                    className="txt-gray">&nbsp;Selections</span></div>
            </div>
            <div className="selections">
                {coupon.grouped.map(match =>
                    <div className="betslip-holder" key={`sel-${match.event_id}`}>
                        <div className="betslip" >
                            <div className="betslip__heading wrap">
                                <div className="pull-left">
                                    {match.score && <span className="txt-secondary pr5">{match.score}</span>}
                                    <span>{match.event_name}</span>
                                </div>
                            </div>
                            <hr className="gray" />
                            {match.selections.map(selection =>
                                <div className="betslip__content table-f" key={selection.element_id}>
                                    {!coupon.tipster &&
                                    <div className="betslip__remove" onClick={() => dispatch(removeSelection(selection))}>
                                        <div className="icon remove" />
                                    </div>}
                                    <div className="betslip__selection-details">
                                        <div className="table-f">
                                            <div className="betslip__selection">
                                                <strong><span>{coupon.tipster ? '**' : selection?.oddname}</span>
                                                    <span className={`pull-right ${selection.oddsClass ? selection.oddsClass : 'txt-primary'}`}>{coupon.tipster ? '**' : selection.odds}</span>
                                                </strong>
                                                <div className="txt-gray">{coupon.tipster ? '***' : selection.market_name}</div>
                                                {selection.started && <div className="txt-red">This event has started</div> }
                                            </div>
                                        </div>
                                    </div>
                                </div>)}
                        </div>
                    </div>
                )}
                <div className="betslip-holder clear pb5">
                    <div className="betslip">
                        <div className="betslip__heading table-f">
                            <div onClick={() => dispatch({type: CANCEL_BET})}>
                                <div className="icon remove-all"/>
                                <div className="dib pl5" id="clearBetslipEventList">Clear Betslip</div>
                            </div>
                            <div className="txt-r">
                                <div className="checkbox">
                                    <input id="c-02" type="checkbox" checked={allowChange} onChange={() => setAllowChange(!allowChange)} />
                                    <label className="checkbox__content">
                                        <span className="checkbox__label">Accept odds change</span>
                                        <div className="checkbox__box ml10"/>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="basket">
                {/* <div className="basket-nav">
                    {coupon.bet_type === 'Split' ?
                        <div className="table-a">
                            <div className={`basket-nav--item active`} id="betslipTab-1">
                                <div className="basket-nav--inner">Split Column Bet</div>
                            </div>
                        </div>
                    :
                    <div className="table-a">
                        <div className={`basket-nav--item ${coupon.bet_type === 'Single' ? 'active' : ''}`} onClick={() => setTabsetTab('Single')} id="betslipTab-1">
                            <div className="basket-nav--inner">Singles</div>
                        </div>
                        <div className={`basket-nav--item ${coupon.bet_type === 'Multiple' ? 'active' : ''}`} onClick={() => setTab('Multiple')} id="betslipTab-2">
                            <div className="basket-nav--inner">Multiple</div>
                        </div>
                        <div className={`basket-nav--item ${coupon.bet_type === 'Combo' ? 'active' : ''}`} onClick={() => setTab('Combo')} id="betslipTab-3">
                            <div className="basket-nav--inner">System</div>
                        </div>
                    </div>}
                </div>*/}
                <div className="basket-quickbet p10">
                    {
                        {
                            'Split': <SplitBet coupon={coupon} dispatch={dispatch} />,
                            'Combo' : <Combine coupon={coupon} dispatch={dispatch} />,
                        }[coupon.bet_type] || <Multiple dispatch={dispatch} coupon={coupon} />
                    }
                </div>
                <hr className="gray" />
                <div className="basket-total p10">
                    <div className="basket-total__row">
                        <div className="dib">Total Stake</div>
                        <div className="pull-right dib txt-bold">{formatNumber(coupon.totalStake)}</div>
                    </div>
                    {/* <div className="basket-total__row">
                        <div className="dib txt-bold">Excise Duty:</div>
                        <div className="pull-right dib txt-bold">{formatNumber(coupon.exciseDuty)}</div>
                    </div> */}
                    {/* <div className="basket-total__row">
                        <div className="dib txt-bold">Net Stake:</div>
                        <div className="pull-right dib txt-bold">{formatNumber(coupon.stake)}</div>
                    </div> */}
                    {/* <div className="basket-total__row">
                        <div className="dib txt-bold">Winnings (Gross):</div>
                        <div className="pull-right dib txt-bold">{formatNumber(coupon.grossWin)}</div>
                    </div> */}
                    <div className="basket-total__row">
                        <div className="dib txt-bold">Bonus:</div>
                        <div className="pull-right dib txt-bold">{formatNumber(coupon.maxBonus)}</div>
                    </div>
                    {/* <div className="basket-total__row">
                        <div className="dib txt-bold">WTH Tax:</div>
                        <div className="pull-right dib txt-bold">{formatNumber(coupon.wthTax)}</div>
                    </div> */}
                    <div className="basket-total__row">
                        <div className="dib txt-bold">Potential Win:</div>
                        <div className="pull-right dib txt-bold">{(coupon.bet_type === 'Split' || coupon.bet_type === 'Combo') ? `${formatNumber(coupon.minWin)} / ${formatNumber(coupon.maxWin)}` : formatNumber(coupon.maxWin) }</div>
                    </div>
                    {coupon.errorMsg &&
                        <>
                            <hr className="gray mt10" />
                            <div className="txt-orange txt-c mt10">{coupon.errorMsg}</div>
                        </>
                    }
                    {!isAuthenticated && <button onClick={(e) => dispatch(placeBet(e, 'booking'))} className="btn w-full mt10">Book a bet</button> }
                    {user && user?.bonus_balance >= coupon.stake && parseFloat(coupon.totalOdds) >= process.env.REACT_APP_MIN_BONUS_ODD
                        && coupon.bet_type !== 'Split' && coupon.bet_type !== 'Combo' &&
                        <button onClick={async (e) => {
                            await dispatch({type: SET_USE_BONUS});
                            const placeBetBtn = document.getElementById('placeBetBtn');
                            placeBetBtn.click();
                        }} id="bonusBtn" className="btn green w-full mt10">Use Bonus</button>
                    }
                    {isAuthenticated && <button onClick={(e) => dispatch(placeBet(e,'bet'))} id="placeBetBtn" className="btn w-full mt10">Place bet</button>}
                </div>
            </div>
        </Fragment>
    );
}
