"use client";
import React, { useEffect, useState } from "react";
import "./VerifyCashout.scss";
import { Button, Spinner } from "@/_components";
import { closeComponentModal } from "@/_redux/slices/modal.slice";
import { useAppDispatch } from "@/_hooks";
import { HiMiniXMark } from "react-icons/hi2";
import { GiCheckMark } from "react-icons/gi";
import { formatNumber } from "@/_utils/helpers";
import { useCashoutRequestMutation } from "@/_services/bet.service";

type Props = {
  data: any
};

const VerifyCashoutModal = ({data}: Props) => {
  const [cashout, {isLoading, isSuccess, data: cashoutData, error}] = useCashoutRequestMutation();

  const dispatch = useAppDispatch();

  const handleConfirm = () => {
    cashout({
      betId: data.id, 
      amount: data.cashOutAmount
    })
  };

  useEffect(() => {
    if(isSuccess) {
      if (data.success) {}
    }
  }, [isSuccess, cashoutData, error])
  
  return (
    <div className="verify-cashout-modal">
      {isSuccess ? (
        <div className='verify-cashout-modal-success'>
          <div className="success-mark">
            <GiCheckMark />
          </div>
          
          <div className="modal_content_title">Cashout Successful</div>
        
            <Button
              text="Close"
              onClick={() => {
                dispatch(closeComponentModal());
              }}
              className="to_deposit_btn2" 
            />
        </div>
      ) : isLoading ? (
        <Spinner />
      ) : (
        <>
          {/* <div className="verify-cashout-modal-message">
            <p>C</p>
          </div> */}
          <div className="verify-cashout-modal-head">
            <h2>Cashout {formatNumber(data.cashOutAmount)}</h2>
          </div>
          
          <div className="modal-btn-block">
            <Button
              text="Cancel"
              className="to_deposit_btn1"
              onClick={() => {
                dispatch(closeComponentModal());
              }}
            />
            <Button
              text="Confirm"
              onClick={handleConfirm}
              className="to_deposit_btn2"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VerifyCashoutModal;
