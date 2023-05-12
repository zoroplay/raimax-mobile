import React, { useEffect } from "react";
import Layout from "../Layout";
import { NavLink } from "react-router-dom";
import { goBack } from "../../Utils/helpers";
import { useSelector } from "react-redux";
import useSWR from "swr";

const DepositType = ({ history }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const { data, error } = useSWR("utilities/payment-methods");
  const paymentMethods = data?.data || null;

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
          {paymentMethods &&
            paymentMethods.map((paymentMethod) => (
              <div className="access__item main-menu-item" id="1000">
                <NavLink
                  to={`/account/deposit/${paymentMethod.provider}`}
                  className="access__item-title"
                >
                  {paymentMethod.title}
                </NavLink>
              </div>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default DepositType;
