import React, {useState} from "react";
import Layout from "./Layout";
import {goBack} from "../Utils/helpers";
import {useDispatch} from "react-redux";
import {groupSelections} from "../Utils/couponHelpers";
import {SET_LOADED_DATA, SHOW_MODAL} from "../Redux/types";
import {findCoupon} from "../Services/apis";

export default function CouponCheck({ history }) {
    const [code, setCode] = useState('');
    const dispatch = useDispatch();

    const doFindCoupon = () => {
        if (code !== '') {
            findCoupon(code).then(res => {
                if (res.message === 'found') {
                    let couponData = res.coupon;
                    couponData.grouped = groupSelections(couponData.selections);
                    dispatch({type: SET_LOADED_DATA, payload: couponData});
                    history.push(`/couponCheckResult/${code}`);
                } else {
                    dispatch({type: SHOW_MODAL, payload: {show: true, type: 'error', message: 'Invalid coupon'}})
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
                <div>Check Your Bet</div>
            </div>
            <div className="credentials" style={{display: 'block' }}>
                <p className="txt-gray">Enter the Bet ID to check the current Status of your bet.</p>
                <div className="mt15">
                    <label className="txt-gray">
                    Bet ID:
                    <input type="text" name="coupon-code" className="credentials__input mt10" value={code} onChange={(e) => setCode(e.target.value)} />
                    </label>
                </div>
                <button className="btn w-full mt15" onClick={doFindCoupon}>Check Your Bet</button>
            </div>
          </Layout>
      );
}
