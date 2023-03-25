import React, { useEffect, useState } from "react";
import { MD5 } from "crypto-js";
// import JackpotLayout from "./layout/JackpotLayout";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function SpinmaticDetailPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mode, setMode] = useState(0);
  const [token, setToken] = useState("111111");
  const [hash, setHash] = useState("");
  const [group, setGroup] = useState(process.env.REACT_APP_SITE_KEY);
  const backurl = process.env.REACT_APP_URL;
  const privateKey = process.env.REACT_APP_XPRESS_PRIVATE_KEY;

  let { id } = useParams();

  useEffect(() => {
    if (isAuthenticated) {
      setToken(user.auth_code);
      setMode(1);
      setGroup(user.group);
    } else {
      setToken("111111");
      setMode(0);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // setHash(MD5(`${token}10100${backurl}${mode}${group}${privateKey}`).toString())
    // setHash(MD5(`${token}12101${backurl}${mode}${group}${privateKey}`).toString())
    setHash(
      MD5(`${token}${id}${backurl}${mode}${group}${privateKey}`).toString()
    );
  }, [token, mode]);

  return (
    <Layout>
      <div id="globalbet" />
      <iframe
        title="casino"
        style={{
          width: "100%",
          border: 0,
          height: "100vh",
          overflow: "scroll",
        }}
        src={`${process.env.REACT_APP_XPRESS_LAUNCH_URL}?token=${token}&game=${id}&backurl=${backurl}&mode=${mode}&group=${group}&h=${hash}`}
      />
    </Layout>
  );
}