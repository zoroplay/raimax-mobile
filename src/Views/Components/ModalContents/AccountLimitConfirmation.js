import React from "react";
import {useDispatch} from "react-redux";
import {SHOW_MODAL} from "../../../Redux/types";

export function AccountLimitConfirmation({message, title}) {
    const dispatch = useDispatch();

    return (
        <div className="modal-body">
            <div className="txt-c p20">
                <h4>Are you sure you want to set<br /> Deposit Limits?</h4>
                <div className="form mt20">
                    <div className="form-row">
                        <div className="">
                            <hr className="m0" />
                            <div className="table-f my10">
                                <div className="txt-l"><strong>Time Period</strong></div>
                                <div><strong>Amount</strong></div>
                                <div className="txt-r"><strong>Effective</strong></div>
                            </div>
                            <div className="bt-thick containerRowLimits">
                                <div className="table-f my10 containerLimitUpdated">
                                    <div className="txt-l">
                                        <strong><span className="period">Weekly Limit</span></strong>
                                    </div>
                                    <div><strong><span className="amount">15.000</span></strong></div>
                                    <div className="txt-r"><strong><span className="effective">Immediate</span></strong></div>
                                </div>
                            </div>
                            <hr className="m0" />
                        </div>
                    </div>
                    <div className="table-f mt20">
                        <div className="pr5">
                            <div className="btn lightgray" id="cancelLimits">Cancel</div>
                        </div>
                        <div className="pl5">
                            <div className="btn green" id="confirmLimits">Apply Limits</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
