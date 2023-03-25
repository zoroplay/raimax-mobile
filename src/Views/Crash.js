import React, { useCallback, useEffect, useState } from "react";

// import React, { useEffect } from "react";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import { goBack } from "../Utils/helpers";

export default function CrashGame({ history }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [token, setToken] = useState('demo');

  useEffect(() => {
    if (isAuthenticated) {
      setToken(`${user?.code}-${user?.auth_code}-${process.env.REACT_APP_SITE_KEY}`)
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
        src={`https://xgame.sportsbookengine.com?token=${token}&cid=1`}

      />
    </Layout>
  );
}

