import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../Assets/scss/_deposit.scss";
import {
  getAllBanks,
  bankWithdrawal,
  getBankDetails,
} from "../../Services/apis";
import { ErrorPopUp, SuccessPopUp } from "../../Utils/toastify";
import Layout from "../Layout";
import { goBack } from "../../Utils/helpers";
import { formatNumber } from "../../Utils/helpers";

const BankWithdrawal = ({ history }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState();
  const [data, setData] = useState([]);
  const [bankData, setBankData] = useState({});
  const [amount, setAmount] = useState(0);
  const [inputObject, setObject] = useState({
    amount: 0,
    bank_id: "",
    bankCode: "",
    account: 0,
  });

  const handleChange = (e) => {
    e.preventDefault();
    setObject({
      ...inputObject,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchBanks();
    fetchBankData();
  }, [bankData]);

  const fetchBanks = (page) => {
    setLoading(true);

    getAllBanks()
      .then((res) => {
        setLoading(false);
        setData(res);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const fetchBankData = () => {
    getBankDetails()
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setBankData(res.data);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const updateAmount = (value) => {
    if (value === 0) {
      setObject({ ...inputObject, amount: 0 });
      return;
    }
    let currentAmount = amount;
    if (currentAmount === "") {
      currentAmount = 0;
    }
    const newAmount = currentAmount + value;
    setObject({ ...inputObject, amount: newAmount });
  };

  const withdraw = () => {
    const bankItem = data.find((u) => u.code == inputObject?.bankCode);
    const payload = {
      amount: parseInt(inputObject.amount, 10),
      bank_id: bankItem?.id,
      bank_code: inputObject?.bankCode,
      account_number: inputObject?.account,
      account_type: "nuban",
    };
    bankWithdrawal(payload)
      .then((r) => {
        if (r.success) {
          SuccessPopUp(r.message);
          setLoading(false);
          goBack(history);
        } else {
          ErrorPopUp(r.message);
          setLoading(false);
        }
        setLoading(false);
        // SuccessPopUp("Successfully sent request");
      })
      .catch((err) => {
        ErrorPopUp("Error occured");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isAuthenticated) history.replace("/");
  }, [isAuthenticated]);

  useEffect(() => {
    if (user?.email === null) {
      history.replace("/account/details");
    }
  }, [user]);

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
      <div className="deposit">
        <div className="page__body p15">
          <div className="form">
            <div className="clear-both" />
            <div className="">
              <div className="form-row">
                <div className="form-label">
                  <strong>
                    {" "}
                    Withdrawal Amount
                    {/* ({SportsbookGlobalVariable.Currency}) */}
                  </strong>
                </div>
                <div className="form-input">
                  <input
                    name="amount"
                    min={500}
                    value={inputObject.amount}
                    onChange={handleChange}
                    type="number"
                    className="deposit-input"
                    step="100"
                    maxLength={5}
                    max="10000"
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
            </div>
          </div>
        </div>
        <div className="deposit-step">
          {bankData && (
            <div className="bank">
              <div className="bank-details">
                <p className="ml-4">Account Name:</p>
                <p className="">
                  <strong>{bankData?.account_name}</strong>
                </p>
              </div>
              <div className="bank-details">
                <p className="ml-4">Account Number:</p>
                <p className="">
                  <strong>{bankData?.account_number}</strong>
                </p>
              </div>
              <div className="bank-details">
                <p className="ml-4">Bank Name:</p>
                <p className="">
                  <strong>{bankData?.bank_name}</strong>
                </p>
              </div>
            </div>
          )}
          <div>
            <div className="form-box my-1">
              <label className="w-2">Bank</label>
              <select
                name="bankCode"
                type="text"
                onChange={(e) => handleChange(e)}
              >
                <option value="Card">Select a bank..</option>
                {data &&
                  data?.map((item, i) => (
                    <option value={item.code} key={i}>
                      {item?.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-box my-1">
              <label className="w-2">Account Number</label>
              <input
                name="account"
                onChange={(e) => handleChange(e)}
                type="number"
                className="deposit-input"
              />
            </div>
            <div className="form-box my-1">
              <label className="w-2">Total Withdrawal</label>
              <input
                name="amount"
                type="text"
                className="deposit-input"
                value={inputObject.amount}
                disabled={true}
              />
            </div>
          </div>

          <div className="btn-bank">
            <button onClick={withdraw}>PROCEED</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BankWithdrawal;
