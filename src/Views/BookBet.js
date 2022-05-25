import React, {useState} from "react";
import Layout from "./Layout";
import {goBack} from "../Utils/helpers";
import {useDispatch} from "react-redux";
import {loadCoupon} from "../Services/apis";
import {groupSelections} from "../Utils/couponHelpers";
import {SET_COUPON_DATA, SHOW_MODAL} from "../Redux/types";

export default function BookBet({ history }) {
    const [code, setCode] = useState('');
    const dispatch = useDispatch();

    const findCoupon = () => {
        if (code !== '') {
            loadCoupon(code, 'booking').then(res => {
                if (res.message === 'found') {
                    let couponData = res.coupon;
                    couponData.grouped = groupSelections(couponData.selections);
                    dispatch({type: SET_COUPON_DATA, payload: couponData});
                    history.push('/betslip');
                } else {
                    dispatch({type: SHOW_MODAL, payload: {show: true, type: 'error', message: 'Coupon not found'}})
                }
            });
        }
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
                <div>Book a Bet</div>
            </div>
            <div className="credentials">
                <p className="txt-gray">Enter a Booking Number below and the selection will be
                added to your betslip.</p>
                <div className="mt15">
                    <label className="txt-gray">Booking Number:
                        <input className="credentials__input mt10" type="text" value={code} onChange={(e) => setCode(e.target.value)} />
                    </label>
                </div>
                <button className="btn w-full mt15" onClick={(e) => findCoupon(e)}>Add to Betslip</button>
            </div>
          </Layout>
      );
}
