import React from "react";
import {SHOW_MODAL} from "../../../Redux/types";

export function MessageTemplate({message, title, dispatch}) {
    return (
        <div className="p15">
            <div className="modal-content__texts">
                <p className="pb10">{title}</p>
                <span>{message}</span>
            </div>
            <div className="wrap mt10">
                <button className="btn w-full" onClick={() => dispatch({type: SHOW_MODAL, payload: {}})}>Continue</button>
            </div>
        </div>
    );
}
