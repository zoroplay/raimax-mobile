import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { useDispatch, useSelector } from "react-redux";
import { goBack } from "../../Utils/helpers";
import { useParams } from "react-router";
import {
  SET_ACTION_PROP,
  SET_LOADING_PROP,
  SET_TOAST_PROPS,
} from "../../Redux/types";
import { initializeTransaction } from "../../Services/apis";

const Deposit = ({ history }) => {
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [errMsg, setErrMsg] = useState(null);
  const { SportsbookGlobalVariable } = useSelector((state) => state.sportsBook);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [panel, setPanel] = useState("form");
  const { type } = useParams();

  useEffect(() => {
    if (!isAuthenticated) history.replace("/");
  }, [isAuthenticated]);

  useEffect(() => {
    if (user?.email === null) {
      history.replace("/account/details");
    }
  }, [type]);

  const [paymentSuccess, setPaymentSuccess] = useState("");
  const dispatch = useDispatch();

  const updateAmount = (value) => {
    if (value === 0) {
      setAmount(0);
      return;
    }
    let currentAmount = amount;
    if (currentAmount === "") {
      currentAmount = 0;
    }
    const newAmount = currentAmount + value;
    setAmount(newAmount);
  };

  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    dispatch({ type: SET_LOADING_PROP, payload: { show: true, message: "" } });
    initializeTransaction({ amount: amount, payment_method: type })
      .then((res) => {
        dispatch({
          type: SET_LOADING_PROP,
          payload: { show: false, message: "" },
        });
        if (res.success) {
          setAmount("");
          if (type === "shop") {
            setPaymentSuccess(res.data);
          } else {
            window.location.href = res.url;
          }
        } else {
          setErrMsg(res?.message);
          dispatch({
            type: SET_TOAST_PROPS,
            payload: { show: true, message: res.message, color: "danger" },
          });
        }
      })
      .catch((err) => {
        setBusy(false);
        dispatch({
          type: SET_LOADING_PROP,
          payload: { show: false, message: "" },
        });
        dispatch({
          type: SET_ACTION_PROP,
          payload: {
            show: true,
            title: "Error",
            message: "Unable to process request. Please try again",
          },
        });
      });
  };

  return (
    <Layout
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
      <div className="page-title"> Deposit from {type}</div>
      <div className="t-menu second">
        <a
          className={`t-menu__item ${panel === "form" ? "active" : ""}`}
          href={`#/Form`}
          onClick={() => setPanel("form")}
        >
          <strong className="t-menu__item-title"> Deposit Form</strong>
        </a>
        <a
          className={`t-menu__item ${panel === "pending" ? "active" : ""}`}
          href={`#/Pending`}
          onClick={() => setPanel("pending")}
        >
          <strong className="t-menu__item-title"> Pending Deposits</strong>
        </a>
      </div>

      {paymentSuccess && (
        <p className="code-card" style={{ background: "green" }}>
          {" "}
          Your Deposit Pin is: <strong>{paymentSuccess?.reference_no}</strong>
          <br />
          Take to any shop to complete your deposit.
        </p>
      )}
      {errMsg && (
        <p className="code-card" style={{ background: "red" }}>
          {" "}
          {errMsg}
        </p>
      )}
      <div className="page__body p15">
        <div className="form">
          <div className="clear-both" />
          <div className="">
            <div className="form-row">
              <div className="form-label">
                <strong>
                  {" "}
                  Deposit Amount ({SportsbookGlobalVariable.Currency})
                </strong>
              </div>
              <div className="form-input">
                <input
                  name="amount"
                  className="big"
                  type="number"
                  step="100"
                  maxLength={5}
                  min={SportsbookGlobalVariable.MinDeposit}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="form-input--stake">
                  {" "}
                  Min {SportsbookGlobalVariable.MinDeposit}
                </div>
              </div>
              <div className="quickstake mt10">
                <div
                  className="quickstake__item"
                  onClick={() => updateAmount(0)}
                >
                  {" "}
                  Clear
                </div>
                <div
                  className="quickstake__item"
                  onClick={() => updateAmount(1000)}
                >
                  {" "}
                  +1000
                </div>
                <div
                  className="quickstake__item"
                  onClick={() => updateAmount(2000)}
                >
                  {" "}
                  +2000
                </div>
                <div
                  className="quickstake__item"
                  onClick={() => updateAmount(5000)}
                >
                  {" "}
                  +5000
                </div>
                <div
                  className="quickstake__item"
                  onClick={() => updateAmount(10000)}
                >
                  {" "}
                  +10,000
                </div>
              </div>
            </div>

            <button
              className="btn mt20 mb20 w-full"
              onClick={submit}
              disabled={busy}
            >
              {" "}
              {busy ? "Processing..." : "Make Payment"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Deposit;
