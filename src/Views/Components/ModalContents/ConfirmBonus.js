import React, {useState} from "react";
import {SET_USER_DATA, SHOW_MODAL} from "../../../Redux/types";
import {formatNumber} from "../../../Utils/helpers";
import {redeemBonus} from "../../../Services/apis";
import {toast} from "react-toastify";

export function ConfirmBonus({amount, currency, dispatch}) {
    const [sending, setSending] = useState(false);

    const doRedeem = () => {
        setSending(true);
        redeemBonus().then(res => {
            setSending(false);
            if (res.success) {
                toast.success(res.message)
                dispatch({type: SET_USER_DATA, payload: res.data});
                dispatch({type: SHOW_MODAL, payload: {}});
            } else {
                toast.error(res.message);
                dispatch({type: SHOW_MODAL, payload: {}});
            }
        }).catch(err => {
            setSending(false);
            toast.error('Something went wrong. Unable to process request');
        })
    }

    return (
        <div className="p15">
            <div className="modal-content__texts">
                <p className="pb10">Redeem bonus Winnings</p>
                <span>
                    Congratulations!! You can now redeem your bonus winning of <strong>{currency + ' ' + formatNumber(amount)}</strong> to your real balance.
                    <p>Are you sure you want to continue?</p>
                </span>
            </div>
            <div className="wrap mt10">
                <button className="btn w-full" disabled={sending} onClick={doRedeem}>Continue</button>
            </div>
        </div>
    );
}
