import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import moment from "moment";
import { getWithdrawalInfo } from "../../Services/apis";
import { goBack } from "../../Utils/helpers";
import { useSelector } from "react-redux";

const PendingWithdrawal = ({ history }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) history.replace("/");
  }, [isAuthenticated]);

  const fetchTransactions = () => {
    setLoading(true);
    getWithdrawalInfo()
      .then((res) => {
        setTransactions(res?.withdrawals);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Layout
      headerLeft={
        <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
          <i className="icon-back" />
          <span className="d-ib ml5">Back</span>
        </div>
      }
      footer={false}>
      <div className="page-title" style={{ paddingTop: ".6rem" }}>
        Pending Withdrawal Request
      </div>

      {transactions &&
        transactions?.map((item, i) => (
          <div className="pending-cards" key={i}>
            <div className="pending-card">
              <h4>Amount</h4>
              <span>{item?.amount}</span>
            </div>
            <div className="pending-card">
              <h4>Created</h4>
              <span>{moment(item?.created_at).format("DD/MM/YYYY")}</span>
            </div>
            <div className="pending-card">
              <h4>Withdrawal Pin</h4>
              <span>{item?.withdraw_code}</span>
            </div>
          </div>
        ))}

      {loading ? (
        <div className="no-pending">
          <h3 className="loader"></h3>
        </div>
      ) : (
        transactions?.length === 0 && (
          <div className="no-pending">
            <p className="no-request">You do not have a pending request</p>
          </div>
        )
      )}
    </Layout>
  );
};

export default PendingWithdrawal;
