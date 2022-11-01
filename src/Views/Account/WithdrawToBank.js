import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../Assets/scss/_deposit.scss";
import { getAllBanks, bankWithdrawal } from "../../Services/apis";
import { ErrorPopUp, SuccessPopUp } from "../../Utils/toastify";
import Layout from "../Layout";
import { goBack } from "../../Utils/helpers";
import { formatNumber } from "../../Utils/helpers";

const BankWithdrawal = ({ history }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState();
  const [data, setData] = useState([]);
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
  }, []);

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
        <div className="deposit-step">
          <div className="left mt-2">
            <h3>
              <strong>KINDLY NOTE</strong>
            </h3>
            <p className="my-1 text-1">
              For easier and faster process verification, please ensure your
              bank account information matches the details in your OurBet
              account.
            </p>
            <p className="my-1 text-1">
              In line with the regulation, winings above{" "}
              <strong>#400,000</strong>
              require a valid means of ID for your withdrawal to be processed
              promptly. Simply email cs@...com with your user ID and a picture
              of your <strong> valid ID card.</strong>
            </p>
            <p className="my-1 text-1">
              <strong>IMPORTANT UPDATE</strong> Payouts to{" "}
              <strong>FIRST BANK </strong> accounts take longer than 48hours due
              to <strong>delays from the bank. </strong>
            </p>
          </div>
          <div className="right">
            <h1 className="pl-1 mt-2 mb-1">Withdrawal</h1>
            <div className="flex by-1 py-1">
              <p>Total Balance: </p>
              <p className="ml-1">{formatNumber(user.balance)}</p>
            </div>
            <div>
              <div className="flex">
                <label className="w-2"></label>
                <ul className="flex-list">
                  <li onClick={() => updateAmount(1000)}>
                    <span>N</span> <br />
                    1,000
                  </li>
                  <li onClick={() => updateAmount(5000)}>
                    <span>N</span> <br />
                    5,000
                  </li>
                  <li onClick={() => updateAmount(10000)}>
                    <span>N</span> <br />
                    10,000
                  </li>{" "}
                  <li onClick={() => updateAmount(25000)}>
                    <span>N</span> <br />
                    25,000
                  </li>{" "}
                  <li onClick={() => updateAmount(50000)}>
                    <span>N</span> <br />
                    50,000
                  </li>
                </ul>
              </div>
              <div className="flex my-1">
                <label className="w-2">Amount:</label>
                <input
                  name="amount"
                  min={500}
                  value={inputObject.amount}
                  onChange={handleChange}
                  type="number"
                  className="deposit-input"
                />
              </div>
              <div className="flex my-1">
                <label className="w-2">Bank:</label>
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
              <div className="flex my-1">
                <label className="w-2">Account Number:</label>
                <input
                  name="account"
                  onChange={(e) => handleChange(e)}
                  type="number"
                  className="deposit-input"
                />
              </div>

              <div className="flex my-1">
                <label className="w-2">Minimum Withdrawal:</label>
                <input
                  name="amount"
                  type="text"
                  className="deposit-input"
                  value="N1,0000"
                />
              </div>
              <div className="flex my-1">
                <label className="w-2">Total Withdrawal:</label>
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
      </div>
    </Layout>
  );
};

export default BankWithdrawal;
