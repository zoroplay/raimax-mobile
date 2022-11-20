import React, { useEffect } from "react";
import Layout from "../Layout";
import { NavLink } from "react-router-dom";
import { goBack } from "../../Utils/helpers";
import { useSelector } from "react-redux";

const DepositType = ({ history }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      history.replace("/");
    }
  }, [isAuthenticated]);

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
        <div>Select Deposit Method </div>
      </div>
      <div className="access">
        <div className="access__menu" id="main-menu">
          {/* <div className="access__item main-menu-item" id="1000">
            <NavLink to="/account/deposit" className="access__item-title">
              Deposit
            </NavLink>
          </div> */}

          <div className="access__item main-menu-item" id="1004">
            <NavLink to="/account/deposit/shop" className="access__item-title">
              Deposit from shop
            </NavLink>
          </div>
          <div className="access__item main-menu-item" id="1004">
            <NavLink
              to="/account/deposit/card"
              className="access__item-title"
            >
              Deposit With Card (online)
            </NavLink>
          </div>
          <div className="access__item main-menu-item" id="1004">
            <NavLink to="/account/deposit/transfer" className="access__item-title">
              Deposit With Bank (Transfer)
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

export default DepositType;
