import React from "react";
import {useDispatch} from "react-redux";
import {SHOW_MODAL} from "../../../Redux/types";

export function MessageTemplate({message, title}) {
    const dispatch = useDispatch();

    return (
        <>
            <div className="modal-head"><p className="modal-head-message"> Authorise - Add Bank Account</p>
                <a className="modal-close" title="close"></a></div>
            <div className="modal-body">
                <div className="txt-c mt20 pl20 pr20">
                    <h4> We have sent an email with your one time<br />password to your
                    registered email address.
                    </h4>
                    <p></p>
                </div>
                <div className="form mt20 pl20 pr20">
                    <div className="form-row mt25">
                        <div className="form-label"></div>
                        <div className="form-input">
                            <input className="" type="number" autoComplete="new-password"
                                                           name="OTP" placeholder=" Enter one time password" value="" />
                        </div>
                    </div>
                </div>
                <div className="btn mt15 ml20 mr20 mb20"> Add Bank Account</div>
            </div>
        </>
    );
}
