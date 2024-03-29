import React, { useEffect } from "react";
import Layout from "../Layout";
import { NavLink } from "react-router-dom";
import { goBack } from "../../Utils/helpers";
import { useSelector } from "react-redux";

const Cashier = ({ history }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      history.replace("/");
    } else {
      if (user?.emaill === null) {
        history.replace("/account/details");
      }
    }
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
      <div className="page-title">
        <div>Select Withdrawal Method </div>
      </div>
      <div className="access">
        <div className="access__menu" id="main-menu">
          <div className="access__item main-menu-item" id="1000">
            <NavLink to="/account/withdraw?type=online" className="access__item-title">
              Withdraw to Bank/Wallet
            </NavLink>
          </div>

          <div className="access__item main-menu-item" id="1004">
            <NavLink to="/account/withdraw?type=shop" className="access__item-title">
              Withdraw from shop
            </NavLink>
          </div>
          {/* <div className="access__item main-menu-item" id="1004">
            <NavLink
              to="/account/withdraw-to-bank"
              className="access__item-title"
            >
              Withdraw to bank account
            </NavLink>
          </div> */}
          <div className="access__item main-menu-item" id="1004">
            <NavLink to="/account/pending" className="access__item-title">
              Pending Withdrawal
            </NavLink>
          </div>
          {/*<div className="access__item main-menu-item" id="1">
                      <NavLink to={`/account/transfer-funds`} className="access__item-title">
                          Transfer
                      </NavLink>
                  </div>*/}
        </div>
      </div>
    </Layout>
  );
};

export default Cashier;
