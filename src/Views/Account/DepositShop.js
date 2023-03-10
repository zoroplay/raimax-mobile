import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { shopDeposit } from "../../Services/apis";
import {
  SET_ACTION_PROP,
  SET_LOADING_PROP,
  SET_TOAST_PROPS,
  UPDATE_USER_BALANCE,
} from "../../Redux/types";
import { useDispatch, useSelector } from "react-redux";
import { goBack } from "../../Utils/helpers";
import { toast } from "react-toastify";

const DepositShop = ({ history }) => {
  const [amount, setAmount] = useState(0);
  const { SportsbookGlobalVariable } = useSelector((state) => state.sportsBook);
  const [show, setShow] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [panel, setPanel] = useState('form');
  const [withdrawalData, setData] = useState({});
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) history.replace("/");
  }, [isAuthenticated]);

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
    setLoading(true);
    dispatch({ type: SET_LOADING_PROP, payload: { show: true, message: "" } });
    shopDeposit({ amount: amount })
      .then((res) => {
        dispatch({
          type: SET_LOADING_PROP,
          payload: { show: false, message: "" },
        });

        if (res.success) {
          setAmount("");
          dispatch({
            type: SET_TOAST_PROPS,
            payload: {
              show: true,
              message: "Deposit request has been sent",
              color: "success",
            },
          });
          setShow(true);
          setShowErr(false);

          setData(res?.data);
        } else {
          setShow(false);

          setShowErr(true);
          setErrMsg(res?.message);
          dispatch({
            type: SET_TOAST_PROPS,
            payload: { show: true, message: res.message, color: "danger" },
          });
        }
      })
      .catch((err) => {
        setShowErr(false);
        setShow(false);
        toast.error(err.message);
        setLoading(false);
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
      <div className="page-title"> Deposit Funds</div>
      <div className="t-menu second">
          <a
            className={`t-menu__item ${
              panel === 'form' ? "active" : ""
            }`}
            href={`#/Form`}
            onClick={() => setPanel('form')}
          >
            <strong className="t-menu__item-title"> Deposit Form</strong>
          </a>
          <a
            className={`t-menu__item ${
              panel === 'pending' ? "active" : ""
            }`}
            href={`#/Pending`}
            onClick={() => setPanel('pending')}
          >
            <strong className="t-menu__item-title"> Pending Deposits</strong>
          </a>
      </div>
      {show && (
        <p className="code-card" style={{ background: "green" }}>
          {" "}
          Your Deposit Pin is:{" "}
          <strong>{withdrawalData?.code}</strong>
          <br />
          Take to any shop to complete your deposit.
        </p>
      )}
      {showErr && (
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
                  min="100"
                  max="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="form-input--stake"> Min 100</div>
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
                  onClick={() => updateAmount(100)}
                >
                  {" "}
                  +100
                </div>
                <div
                  className="quickstake__item"
                  onClick={() => updateAmount(200)}
                >
                  {" "}
                  +200
                </div>
                <div
                  className="quickstake__item"
                  onClick={() => updateAmount(500)}
                >
                  {" "}
                  +500
                </div>
                <div
                  className="quickstake__item"
                  onClick={() => updateAmount(1000)}
                >
                  {" "}
                  +1000
                </div>
              </div>
            </div>
            <button onClick={submit} className="btn mt20 mb20 w-full">
              Generate Deposit Code
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DepositShop;
