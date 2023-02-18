import React from "react";
import {formatBetslipId, formatDate, formatNumber} from "../../Utils/helpers";
import {loadCoupon} from "../../Services/apis";
import {groupSelections} from "../../Utils/couponHelpers";
import {SET_COUPON_DATA, SET_LOADING_PROP, SHOW_MODAL} from "../../Redux/types";
import {useDispatch, useSelector} from "react-redux";

export function SingleSlip({betslip, history, type, tipster = null}) {
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);

    const toggleView = (id) => {
        const ele = document.getElementById(id);
        ele.parentElement.classList.toggle('collapsed');
    }

    const reloadCoupon = () => {
        dispatch({type: SET_LOADING_PROP, payload: {show: true, message: 'Loading Games...'}});

        loadCoupon(betslip?.betslip_id, 'rebet').then(res => {
            dispatch({type: SET_LOADING_PROP, payload: {show: false, message: ''}});

            if (res.message === 'found') {
                let couponData = res.coupon;
                couponData.grouped = groupSelections(couponData.selections);
                couponData.tipster = type === 'tipster';
                dispatch({type: SET_COUPON_DATA, payload: couponData});
                history.push('/betslip');
            } else {
                dispatch({type: SHOW_MODAL, payload: {show: true, type: 'error', message: 'Coupon not found'}})
            }
        }).catch(err => {
            dispatch({type: SET_LOADING_PROP, payload: {show: false, message: ''}});
        });
    }

    return (
        <div className="betslip-holder">
            <div className="betslip placed">
                <div id={`betselement_heading_${betslip.betslip_id}`} onClick={() => toggleView(`betselement_heading_${betslip.betslip_id}`)}
                     className="betslip__heading wrap">
                    <div className="pull-left icon arrow"/>
                    <div className="pull-left placed--text">{betslip?.bet_type}</div>
                </div>
                <hr className="gray" />
                <div className="betslip__content" onClick={() => toggleView(`betselement_heading_${betslip.betslip_id}`)}>
                    <div className="betslip__selection-details">
                        <div>
                            <div className="table-f">
                                <div>
                                    <div className="ellipsis">
                                        {betslip?.selections.map(selection => (selection.event))}
                                    </div>
                                </div>
                                {betslip?.status === 1 ?
                                    <div className="betslip__odd-holder txt-r"><span>{formatNumber(betslip?.winnings)}</span></div>
                                    :
                                    <div className="betslip__odd-holder txt-r"><span>{betslip?.odds}</span></div>
                                }
                            </div>
                            <div className="table-f mt5">
                                {type === 'betslip' ?
                                    <div><span>Stake: {formatNumber(betslip?.stake)}</span></div>
                                    :
                                    <div><span>Min Stake: {formatNumber(betslip?.minimum_stake)}</span></div>
                                }
                                {betslip?.status === 1 &&<div className="txt-r"><span className="txt-green">Won</span></div>}
                                {betslip?.status === 2 &&<div className="txt-r"><span className="txt-red">Lost</span></div>}
                                {betslip?.status === 3 &&<div className="txt-r"><span className="txt-gray">Void</span></div>}
                                {betslip?.status === 0 &&<div className="txt-r">
                                    To win:&nbsp;{formatNumber(betslip?.pot_winnings)} {type === 'tipster' && `less ${betslip?.percentage}%`}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="accordion-content">
                    <div className="accordion-inner">
                        <div className="betslip__id txt-gray table-a">
                            <div>BET ID: {type === 'tipster' ? formatBetslipId(betslip?.betslip_id) : betslip?.betslip_id}</div>
                            <div className="txt-r pr10"><span>{formatDate(betslip?.created_at, 'DD/MM/YYYY HH:mm')}</span></div>
                        </div>
                        {betslip?.selections.map(selection =>
                            <div key={selection.element_id}>
                                <div className="betslip__content" >
                                    <div className="betslip__selection-details">
                                        {type !== 'tipster' &&
                                        <>
                                            <div className="mb5">
                                                <span className="dib txt-medium txt-white">{selection.odd_name}</span>
                                                <span className="pull-right">{selection.odds}</span>
                                            </div>
                                            <div className="txt-gray mb5">{selection.market_name}</div>
                                        </>
                                        }
                                        <div className="table-f txt-gray mb5">
                                            <div><span className="ellipsis">{selection.event}</span></div>
                                            {selection.score && <div className="w-15"><span className="txt-bold">{selection.score}</span></div>}
                                            {selection?.status === 1 &&<div className="txt-r"><span className="ellipsis txt-green">Won</span></div>}
                                            {selection?.status === 2 &&<div className="txt-r"><span className="ellipsis txt-red">Lost</span></div>}
                                            {selection?.status === 3 &&<div className="txt-r"><span className=" ellipsis txt-gray">Void</span></div>}
                                            {selection?.status === 0 &&<div className="txt-r"><span className=" ellipsis txt-gray">{formatDate(selection.start_date, 'DD MMM HH:mm')}</span></div>}
                                        </div>
                                        <div className="txt-gray">{selection.tournament}</div>
                                    </div>
                                </div>
                                <hr className="gray" />
                            </div>
                        )}
                        {tipster?.id !== user.id &&
                        <div className="p10">
                            <button
                                onClick={reloadCoupon}
                                className="btn w-full btn-border mt10">{type === 'tipster' ? 'Play this ticket' : 'Reload Open Selection'}
                            </button>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
