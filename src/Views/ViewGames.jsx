import React, { useCallback, useEffect, useState } from "react";
import { MD5 } from "crypto-js";
import { useSelector } from "react-redux";
import axios from "axios";
import { useParams } from "react-router-dom";
import { playGame } from "../Services/apis";

export default function ViewGames() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [virtualUrl, setVirtuaUrl] = useState(null);
  const [mode, setMode] = useState(0);
  const [token, setToken] = useState("111111");
  const [hash, setHash] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState([]);
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
    setHash(
      MD5(`${token}10100${backurl}${mode}${group}${privateKey}`).toString()
    );
  }, [token, mode]);

  const fetchGame = () => {
    setLoading(true);
    const payload = {
      game_id: id,
      demo: 0,
    };
    playGame(payload)
      .then((response) => {
        setLoading(false);
        setGames(response?.result);
        // setGames(
        //   response?.data?.filter((game) => game.provider === "SPINMATIC")
        // );
      })
      .catch((err) => {
        setGames(err?.response?.data?.message);

        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGame();
  }, []);

  return (
    <div>
      {/* <div id="globalbet" /> */}
      <iframe
        title="casino"
        style={{
          width: "100%",
          border: 0,
          height: "100vh",
          overflow: "scroll",
        }}
        // style={{ width: '100%', border: 0, height: '100vh', overflow: scroll !important}}
        src={games && games?.SessionUrl}
      />
    </div>
  );
}
