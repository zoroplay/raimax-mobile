import React, { useCallback, useEffect, useState } from "react";

// import React, { useEffect } from "react";
import Layout from "./Layout";
import { goBack } from "../Utils/helpers";
import Loader from "./Components/Loader";
import { verifyTransaction } from "../Services/apis";
import { toast } from "react-toastify";

export default function PaymentVerification({ history }) {
  const queryParams = new URLSearchParams(window.location.search)
  const trxRef = queryParams.get('trxRef'); 
  const payment = queryParams.get('payment'); 

  useEffect(() => {
    async function verify(data) {
      await verifyTransaction(data).then(res => {
        if(res.success) {
          toast.success('Payment succesful!')
          setTimeout(() => {
            window.location.href = '/';
          }, [3000]);
        } else {
          toast.error('Transaction Failed');
          setTimeout(() => {
            window.location.href = '/account/deposit';
          }, [3000]);
        }
      }).catch(err => toast.error('We are unable to verify payment'));
    }
    verify({paymentChannel: payment, trxRef})
  }, [payment]);

  return (
    <Layout
      footer={false}
      headerLeft={
        <div
          className="h-s__wrap-trigger px15 py10"
          onClick={() => goBack(history)}
        >
          <i className="icon-back" />
          <span className="d-ib ml5">Back</span>
        </div>
      }
    >
      <Loader loading={true} />
      <div style={{textAlign: 'center'}}>
        <h3>Confirming Payment</h3>
        <h3>please wait...</h3>
      </div>
    </Layout>
  );
}

