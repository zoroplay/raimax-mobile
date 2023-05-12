import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import moment from "moment";
import { getTransactions } from "../../Services/apis";
import { formatDate, formatNumber, goBack } from "../../Utils/helpers";
import DatePicker from "react-datepicker";
import { useSelector } from "react-redux";

const Transactions = ({ history }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    period: 7,
    from: moment().subtract(1, "w").toDate(),
    to: moment().toDate(),
  });

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) history.replace("/");
  }, [isAuthenticated]);

  const toggleDetails = (id) => {
    const ele = document.getElementById(id);
    ele.parentElement.classList.toggle("opened");
  };

  const toggleSettings = (e) => {
    const ele = document.getElementById("filter-settings");
    ele.classList.toggle("opened");
  };

  const fetchTransactions = () => {
    setLoading(true);
    getTransactions({
      from: moment(form.from).format("DD/MM/YYYY"),
      to: moment(form.to).format("DD/MM/YYYY"),
    })
      .then((res) => {
        setTransactions(res.transactions.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handlePeriodChange = (e) => {
    const { value } = e.target;
    switch (value) {
      case "1":
        setForm({
          ...form,
          period: value,
          from: moment().toISOString(),
          to: moment().toISOString(),
        });
        break;
      case "7":
        setForm({
          ...form,
          period: value,
          from: moment().subtract(1, "w").toISOString(),
          to: moment().toISOString(),
        });
        break;
      case "30":
        setForm({
          ...form,
          period: value,
          from: moment().subtract(30, "days").toISOString(),
          to: moment().toISOString(),
        });
        break;
    }
  };

  const getStatusClass = status => {
    switch (status) {
      case 1:
        return 'txt-green';
      case 2:
        return 'txt-red';
      default:
        return 'txt-orange';
        break;
    }
  }

  return (
    <Layout
      headerLeft={
        <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
          <i className="icon-back" />
          <span className="d-ib ml5">Back</span>
        </div>
      }
      footer={false}>
      <div className="page-title">Transactions</div>
      <div className="account filter" id="filter-settings">
        <div className="filter-title">Filter Transactions</div>
        <div className="filter--toggle" onClick={toggleSettings} />
        <div className="filter__settings">
          <div className="form p15">
            <div className="form-row" id="range">
              <div className="form-label">
                <span>Date Range</span>
              </div>
              <div className="form-select">
                <select id="periodSelect" value={form.period} onChange={handlePeriodChange}>
                  <option value="">Custom date</option>
                  <option value={1}>1 Day</option>
                  <option value={7}>7 Days</option>
                  <option value={30}>30 Days</option>
                </select>
                <div className="form-select--hide-arrow" />
              </div>
            </div>
            <div className="form-row">
              <div className="divide-holder">
                <div className="one-half">
                  <div className="form-label">
                    <span>Date From</span>
                  </div>
                  <div className="form-select">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={form.from}
                      className="custom-datepicker hasDatepicker"
                      onChange={(date) => setForm({ ...form, from: date })}
                    />
                    <div className="form-select--hide-arrow" />
                  </div>
                </div>
                <div className="one-half">
                  <div className="form-label">
                    <span>Date To</span>
                  </div>
                  <div className="form-select">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={form.to}
                      className="custom-datepicker hasDatepicker"
                      onChange={(date) => setForm({ ...form, to: date })}
                    />
                    <div className="form-select--hide-arrow" />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="mt15 btn"
              id="btnUpdate"
              onClick={(e) => {
                fetchTransactions();
                toggleSettings(e);
              }}>
              Show Transactions
            </div>
          </div>
        </div>
        <div className="filter--mask" />
      </div>
      <div className="accordion bg-white account">
        <div className="accordion__item heading">
          <div className="accordion__header">
            <div className="accordion__cnt">
              <div className="accordion__cnt-item">
                <strong>Date / Time</strong>
              </div>
              <div className="accordion__cnt-item pl10">
                <strong>Transaction</strong>
              </div>
              <div className="accordion__cnt-item txt-r">
                <strong>Amount</strong>
              </div>
            </div>
          </div>
        </div>
        {!loading &&
          transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="accordion__item item" key={`transaction-${transaction.reference_no}`}>
              <div
                className="accordion__header collapsible"
                id={`transaction-${transaction.reference_no}`}
                onClick={() => toggleDetails(`transaction-${transaction.reference_no}`)}>
                <div className="accordion-toggle" />
                <div className="accordion__cnt">
                  <div className="accordion__cnt-item">{formatDate(transaction.created_at, "DD/MM/YYYY HH:mm:ss")}</div>
                  <div className={`accordion__cnt-item ${getStatusClass(transaction.status)}`}>
                    {transaction.subject}
                  </div>
                  <div className="accordion__cnt-item txt-r">
                    <strong className={`${transaction.tranx_type === "debit" ? 'txt-red' : 'txt-green'}`}>
                      {transaction.tranx_type === "debit" ? '-' : '+'}
                      {formatNumber(transaction.amount)}
                    </strong>
                    <p>
                      {transaction.tranx_type === "debit"
                        ? formatNumber(transaction.from_user_balance)
                        : formatNumber(transaction.to_user_balance)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="accordion__body indent">
                <div className="accordion__content">
                  <div className="steps bg-white">
                    <div className="steps__row">
                      <div className="steps__item">Date / Time</div>
                      <div className="steps__item">{formatDate(transaction.created_at, "DD/MM/YYYY HH:mm:ss")}</div>
                    </div>
                    <div className="steps__row">
                      <div className="steps__item">Transaction Id:</div>
                      <div className="steps__item">{transaction.reference_no}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {!loading && transactions.length === 0 && (
          <div className="callout " id="error-message">
            <strong>No transactions found</strong>
          </div>
        )}
        {loading && (
          <div className="callout " id="error-message">
            <strong>Loading...</strong>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;
