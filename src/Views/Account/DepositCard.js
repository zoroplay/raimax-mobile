import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { getGatewayKeys, saveTransaction } from "../../Services/apis";
import { SET_LOADING_PROP, UPDATE_USER_BALANCE } from "../../Redux/types";
import { useDispatch, useSelector } from "react-redux";
import { formatNumber, goBack } from "../../Utils/helpers";
import { PaystackButton } from "react-paystack";

const gateways = [
  { slug: "paystack", name: "Paystack" },
  { slug: "monnify", name: "Monnify" },
];

const DepositCard = ({ history }) => {
  const [amount, setAmount] = useState("");
  const { SportsbookGlobalVariable } = useSelector((state) => state.sportsBook);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) history.replace("/");
  }, [isAuthenticated]);

  useEffect(() => {
    if (user?.email === null) {
      history.replace("/account/details");
    }
  }, [user]);

  const [activeTab, setActiveTab] = useState({
    slug: "paystack",
    name: "Paystack",
  });
  const [config, setConfig] = useState({
    txref: new Date().getTime(),
    customer_email: user.email,
    customer_phone: "",
    amount: "",
    PBFPubKey: "",
    contractCode: "",
    production: process.env.NODE_ENV === "production",
  });
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const dispatch = useDispatch();

  const updateAmount = (value) => {
    if (value === 0) {
      setConfig({ ...config, amount: 0 });
      return;
    }
    let currentAmount = config.amount;
    if (currentAmount === "") {
      currentAmount = 0;
    }
    const newAmount = currentAmount + value;
    setConfig({ ...config, amount: newAmount });
  };

  const verifyPayment = (response) => {
    if (config.amount > 0) {
      if (response.message === "Approved") {
        setPaymentSuccess(
          `Success!! Your account has been credited with ${formatNumber(
            config.amount
          )}`
        );
        // update user balance
        dispatch({
          type: UPDATE_USER_BALANCE,
          payload: user.balance + config.amount,
        });

        response.paymentMethod = "paystack";
        response.channel = "mobile";
        response.amount = config.amount;
        setConfig({ ...config, amount: "" });
        saveTransaction(response);
        // dispatch({type: SHOW_MODAL, payload: {show: true, type: 'error', message: 'Your'}})
      } else {
        // dispatch({type: SHOW_MODAL, payload: {show: true, type: 'error', message: 'We were unable to process your request'}})
      }
    }
  };

  const getGateway = (gateway) => {
    setActiveTab(gateway);
    getGatewayKeys(gateway.slug)
      .then((res) => {
        if (res.success) {
          setConfig({
            ...config,
            PBFPubKey: res.pub_key,
            contractCode:
              gateway.slug === "monnify" ? res.monnify_contract_code : "",
          });
        } else {
          dispatch({
            type: SET_LOADING_PROP,
            payload: { show: false, message: res.message },
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: SET_LOADING_PROP,
          payload: { show: false, message: err.message },
        });
      });
  };

  const onSuccess = (response) => {
    response.paymentMethod = activeTab.slug;
    response.channel = "website";
    response.amount = config.amount;

    switch (activeTab.slug) {
      case "rave":
        // console.log(response);
        if (response.respcode === "00") {
          response.reference = response.tx.txRef;
          setPaymentSuccess(
            `Success!! Your account has been credited with ${formatNumber(
              config.amount
            )}`
          );
          // update user balance
          dispatch({
            type: UPDATE_USER_BALANCE,
            payload: user.balance + config.amount,
          });

          saveTransaction(response);
        }
        break;
      case "paystack":
        if (response.message === "Approved") {
          setPaymentSuccess(
            `Success!! Your account has been credited with ${formatNumber(
              config.amount
            )}`
          );
          // update user balance
          dispatch({
            type: UPDATE_USER_BALANCE,
            payload: user.balance + config.amount,
          });

          saveTransaction(response);
        } else {
        }
        break;
      case "monnify":
        if (response.status === "SUCCESS") {
          setPaymentSuccess(
            `Success!! Your account has been credited with ${formatNumber(
              config.amount
            )}`
          );
          // update user balance
          dispatch({
            type: UPDATE_USER_BALANCE,
            payload: user.balance + config.amount,
          });
          response.reference = response.transactionReference;

          saveTransaction(response);
        }
        break;
    }
    setConfig({ ...config, amount: "" });
  };

  useEffect(() => {
    getGateway(activeTab);
  }, []);

  function payWithMonnify() {
    window.MonnifySDK.initialize({
      amount: config.amount,
      currency: "NGN",
      reference: "" + Math.floor(Math.random() * 1000000000 + 1),
      customerEmail: user.email,
      apiKey: config.PBFPubKey,
      contractCode: config.contractCode,
      paymentDescription: "Gaming Account funding",
      isTestMode: config.production,
      paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
      onComplete: function (response) {
        //Implement what happens when transaction is completed.
        onSuccess(response);
      },
      onClose: function (data) {
        //Implement what should happen when the modal is closed here
        console.log(data);
      },
    });
  }

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
      <div className="page-title"> Instant Deposit Cards</div>
      <div className="t-menu second">
        {gateways.map((gateway) => (
          <a
            key={gateway.slug}
            className={`t-menu__item ${
              gateway.slug === activeTab.slug ? "active" : ""
            }`}
            href={`#/Deposit/InstantCardDeposit/${gateway.name}`}
            onClick={() => getGateway(gateway)}
          >
            <strong className="t-menu__item-title"> {gateway.name}</strong>
          </a>
        ))}
      </div>
      {paymentSuccess !== "" && (
        <div className="info-box green">{paymentSuccess}</div>
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
                  max="10000"
                  value={config.amount}
                  onChange={(e) =>
                    setConfig({ ...config, amount: e.target.value })
                  }
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
            {
              {
                monnify: (
                  <button
                    className="btn mt20 mb20 w-full"
                    onClick={payWithMonnify}
                  >
                    {" "}
                    Make Payment
                  </button>
                ),
                paystack: (
                  <PaystackButton
                    amount={config.amount * 100}
                    email={user?.email}
                    publicKey={config.PBFPubKey}
                    onSuccess={verifyPayment}
                    text="Make Payment"
                    disabled={parseInt(config.amount) === 0}
                    className="btn mt20 mb20 w-full"
                  />
                ),
              }[activeTab.slug]
            }
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DepositCard;
