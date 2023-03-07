// import React, {useEffect} from "react";
// import {goBack} from "../Utils/helpers";
// import Layout from "./Layout";
// import {useSelector} from "react-redux";

// export default function Virtual({history}) {
//     const {virtualURL} = useSelector((state) => state.auth);

//     useEffect(() => {
//         window.location.href = virtualURL;
//     }, []);

//     return (
//         <Layout
//             footer={false}
//             headerLeft={
//                 <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
//                     <i className="icon-back" />
//                     <span className="d-ib ml5">Back</span>
//                 </div>
//             }>

//         </Layout>
//     )
// }

import React, { useCallback, useEffect, useState } from "react";
import { goBack } from "../Utils/helpers";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import { MD5 } from "crypto-js";
import { useHistory } from "react-router-dom";

// export default function Virtual({history}) {
//     const {virtualURL} = useSelector((state) => state.auth);

//     useEffect(() => {
//         window.location.href = virtualURL;
//     }, []);

//     return (
//         <Layout
//             footer={false}
//             headerLeft={
//                 <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
//                     <i className="icon-back" />
//                     <span className="d-ib ml5">Back</span>
//                 </div>
//             }>

//         </Layout>
//     )
// }

export default function Virtual() {
  const history = useHistory();

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [virtualUrl, setVirtuaUrl] = useState(null);
  const [mode, setMode] = useState(0);
  const [token, setToken] = useState("111111");
  const [hash, setHash] = useState("");
  const [group, setGroup] = useState(process.env.REACT_APP_SITE_KEY);
  const backurl = process.env.REACT_APP_SITE_URL;
  const privateKey = process.env.REACT_APP_XPRESS_PRIVATE_KEY;

  const goTo = (path) => {
    history.push(path);
  };

  useEffect(() => {
    if (isAuthenticated) {
      setToken(user.auth_code);
      setMode(1);
      setGroup(user.group);
    } else {
      goTo("/login");
      setToken("111111");
      setMode(0);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    setHash(
      MD5(
        `${token}10100${backurl}${mode}${group}mobile${privateKey}`
      ).toString()
    );
  }, [token, mode]);

  return (
    <Layout>
      {/* <div id="globalbet" /> */}
      <iframe
        title="virtual"
        style={{
          width: "100%",
          border: 0,
          height: "100vh",
          overflow: "scroll",
        }}
        // style={{ width: '100%', border: 0, height: '100vh', overflow: scroll !important}}
        src={`${process.env.REACT_APP_XPRESS_LAUNCH_URL}?token=${token}&game=10100&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`}
      />
    </Layout>
  );
}
