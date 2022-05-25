import React, {useCallback, useEffect, useState} from "react";
import Layout from "./Layout";
import {formatDate, formatNumber, goBack} from "../Utils/helpers";
import {useDispatch, useSelector} from "react-redux";
import {findCoupon, loadCoupon} from "../Services/apis";
import {groupSelections} from "../Utils/couponHelpers";
import {SET_COUPON_DATA, SET_LOADED_DATA, SHOW_MODAL} from "../Redux/types";
import Loader from "./Components/Loader";

export default function BookBet({match, history }) {
    const {loadedCoupon} = useSelector((state) => state.couponData);
    const [loading, setLoading] = useState(false);
    const code = match.params.betslip;
    const dispatch = useDispatch();

    const fetchCoupon = useCallback(() => {
        if(!loadedCoupon) {
            setLoading(true);
            findCoupon(code).then(res => {
                setLoading(false);
                if (res.message === 'found') {
                    let couponData = res.coupon;
                    couponData.grouped = groupSelections(couponData.selections);
                    dispatch({type: SET_LOADED_DATA, payload: couponData});
                } else {
                    dispatch({type: SHOW_MODAL, payload: {show: true, type: 'error', message: 'Invalid coupon'}})
                }
            }).catch(err => {
                setLoading(false);
            });
        }
    }, [code, dispatch, loadedCoupon]);

    useEffect(() => {
        fetchCoupon();
    }, []);

    const reloadCoupon = () => {
        setLoading(true);
        loadCoupon(code, 'rebet').then(res => {
            setLoading(false);
            if (res.message === 'found') {
                let couponData = res.coupon;
                couponData.grouped = groupSelections(couponData.selections);
                dispatch({type: SET_COUPON_DATA, payload: couponData});
                history.push('/betslip');
            } else {
                dispatch({type: SHOW_MODAL, payload: {show: true, type: 'error', message: 'Coupon not found'}})
            }
        }).catch(err => setLoading(false));
    }

    return (
        <Layout
            headerLeft={
                <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                    <i className="icon-back" />
                    <span className="d-ib ml5">Back</span>
                </div>
            }>
            <div className="callout-sb">
                <div>Check Your Bet</div>
            </div>
            {loading ? <Loader loading={loading} /> :
            <div className="betslip-holder">
                <div className="betslip placed collapsed">
                    <div className="betslip__heading wrap">
                        <div className="pull-left icon arrow"/>
                        <div className="pull-left placed--text">{loadedCoupon?.bet_type}</div>
                    </div>
                    <hr className="gray" />
                    <div className="betslip__content">
                        <div className="betslip__selection-details">
                            <div>
                                <div className="table-f">
                                    <div>
                                        <div className="ellipsis">
                                            {loadedCoupon?.selections.map(selection => (selection.event))}
                                        </div>
                                    </div>
                                    <div className="betslip__odd-holder txt-r"><span>{loadedCoupon?.odds}</span></div>
                                </div>
                                <div className="table-f mt5">
                                    <div><span>Stake: {formatNumber(loadedCoupon?.stake)}</span></div>
                                    {loadedCoupon?.status === 1 &&<div className="txt-r"><span className="txt-green">Won</span></div>}
                                    {loadedCoupon?.status === 2 &&<div className="txt-r"><span className="txt-red">Lost</span></div>}
                                    {loadedCoupon?.status === 3 &&<div className="txt-r"><span className="txt-gray">Void</span></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="accordion-content">
                        <div className="accordion-inner">
                            <div className="betslip__id txt-gray table-a">
                                <div>BET ID: {loadedCoupon?.betslip_id}</div>
                                <div className="txt-r pr10"><span>{formatDate(loadedCoupon?.created_at, 'DD/MM/YYYY HH:mm')}</span></div>
                            </div>
                            {loadedCoupon?.selections.map(selection =>
                                <>
                                    <div className="betslip__content">
                                        <div className="betslip__selection-details">
                                            <div className="mb5"><span className="dib txt-medium txt-white">{selection.odd_name}</span><span
                                                className="pull-right">{selection.odds}</span></div>
                                            <div className="txt-gray mb5">{selection.market_name}</div>
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
                                </>
                            )}
                            <div className="p10">
                                {/*<button
                                    className="btn w-full">Show
                                    Cashout
                                </button>*/}
                                <button
                                    onClick={reloadCoupon}
                                    className="btn w-full btn-border mt10">Reload
                                    Open Selection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
          </Layout>
      );
}
