import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {ErrorTemplate} from "./ModalContents/ErrorTemplate";
import {MessageTemplate} from "./ModalContents/MessageTemplate";
import {ConfirmBonus} from "./ModalContents/ConfirmBonus";
import {SHOW_MODAL} from "../../Redux/types";

export default function Modal(){
    const {modal} = useSelector((state) => state.sportsData);
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);
    const dispatch = useDispatch();

    return (
        <div className="modals info-modal">
            <div className="info-modal">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <a href="javascript:;" onClick={() => dispatch({type: SHOW_MODAL, payload: {}})} className="modal-close m15" title="Close">x</a>
                        { modal?.type === 'error' && <ErrorTemplate dispatch={dispatch} message={modal?.message} /> }
                        { modal?.type === 'message' && <MessageTemplate dispatch={dispatch} message={modal?.message} title={modal?.title} /> }
                        { modal?.type === 'bonus' && <ConfirmBonus dispatch={dispatch} amount={modal?.amount} currency={SportsbookGlobalVariable.Currency} /> }
                    </div>
                </div>
            </div>
            <div className="modal-mask"></div>
        </div>
    );
}
