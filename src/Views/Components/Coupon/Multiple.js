import React, {Fragment} from "react";
import {formatNumber} from "../../../Utils/helpers";
import {fastAdd, updateWinnings} from "../../../Redux/actions";
import {useSelector} from "react-redux";

export const Multiple = ({coupon, dispatch}) => {
    const amounts = process.env.REACT_APP_FAST_ADD_AMOUNTS.split(',');
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);

    return (
        <Fragment>
            <div className="basket-type">
                <div className="table-f">
                    <div className="basket-type__item title">
                        <div>
                            <span> Total Odds</span>
                            <span className="txt-primary ml10">{formatNumber(coupon.totalOdds)}</span>
                        </div>
                    </div>
                    <div className="basket-type__item">
                        <div className="betslip__stake pull-right">
                            <div className="stakes">
                                <div className="currency">
                                    <span>{SportsbookGlobalVariable.Currency}</span>
                                </div>
                                <input type="number"
                                       onChange={(e) => dispatch(updateWinnings(e.target.value))}
                                       placeholder="Stake" value={coupon.totalStake} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="txt-r mt5">Potential Win: {formatNumber(coupon.maxWin)}</div>
            </div>
            <div className="basket-preset-values mt10">
                <div className="preset" id="clearStakeButton" onClick={() => dispatch(fastAdd(0))}>Clear</div>
                {amounts && amounts.map(amount => <div key={amount} className="preset" onClick={() => dispatch(fastAdd(parseInt(amount)))}>{amount}</div>)}
            </div>
        </Fragment>

    )
}
