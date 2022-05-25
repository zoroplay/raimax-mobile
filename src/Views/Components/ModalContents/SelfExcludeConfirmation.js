import React from "react";
import {useDispatch} from "react-redux";
import {SHOW_MODAL} from "../../../Redux/types";

export function SelfExcludeConfirmation({message, title}) {
    const dispatch = useDispatch();

    return (
        <div className="modal-body">
            <div className="txt-c p20">
                <h4>Are you sure you want to<br />self exclude?</h4>
                <div className="form mt20">
                    <div className="form-row">
                        <div className="">
                            <hr className="m0" />
                            <div className="table-f my10">
                                <div className="txt-l"><strong>Product</strong></div>
                                <div className="txt-r"><strong>Self Exclusion Period</strong></div>
                            </div>
                            <div className="categoriesToExcluded">
                                <div className="bt-thick">
                                    <div className="table-f my10">
                                        <div className="txt-l"><strong>All</strong></div>
                                        <div className="txt-r"><strong>15 Days</strong></div>
                                    </div>
                                </div>
                            </div>

                            <hr className="m0" />
                        </div>
                    </div>
                    <div className="table-f mt20">
                        <div className="pr5">
                            <div className="btn lightgray" id="selfExcludeCancel">Cancel</div>
                        </div>
                        <div className="pl5">
                            <div className="btn" id="selfExcludeConfirm" disabled="disabled">Self Exclude</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
