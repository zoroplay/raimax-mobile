import React, { useEffect } from "react";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import { goBack } from "../Utils/helpers";
import { useHistory } from "react-router-dom";

export default function Casino({ history }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const goHistory = useHistory();

  const goTo = (path) => {
    goHistory.push(path);
  };

  useEffect(() => {
    if (isAuthenticated) {
    } else {
      goTo("/login");
    }
  }, [isAuthenticated]);

  return (
    <Layout
      footer={false}
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
      <iframe
        title="casino"
        style={{ width: "100%", border: 0, height: "100vh" }}
        src={`https://ui.io.co.ke/?cid=1&token=${user?.auth_code}-${process.env.REACT_APP_SITE_KEY}`}
      />
    </Layout>
  );
}
