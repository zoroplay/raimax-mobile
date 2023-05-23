import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { getAllGames } from "../Services/apis";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { MD5 } from "crypto-js";

export default function Virtual() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState([]);
  const history = useHistory();
  const backurl = process.env.REACT_APP_SITE_URL;
  const privateKey = process.env.REACT_APP_XPRESS_PRIVATE_KEY;

  useEffect(() => {
    fetchAllGames();
  }, []);

  const fetchAllGames = () => {
    setLoading(true);
    getAllGames()
      .then((response) => {
        setLoading(false);
        setGames(response?.data?.filter((game) => game.provider === "SPINMATIC"));
      })
      .catch((err) => {
        setGames(err?.response?.data?.message);

        setLoading(false);
      });
  };

  const viewDetails = (id) => {
    let mode = 0, token = Math.floor(Math.random() * 1000000000 + 1), group = process.env.REACT_APP_SITE_KEY;
    if (isAuthenticated) {
      group = user?.group;
      token = user?.auth_code;
      mode = 1;
    } 
    const hash = MD5(`${token}${id}${backurl}${mode}${group}mobile${privateKey}`).toString();

    window.location.href = `${process.env.REACT_APP_XPRESS_LAUNCH_URL}?token=${token}&game=${id}&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`
  };

  return (
    <Layout>
      <div className="spinmatic">
        <h3 style={{ textAlign: "center" }}>Games</h3>
        {loading && <h2>LOADING....</h2>}
        {games && !loading && (
          <div className="spinmatic-games">
            {games?.map((item, i) => (
              <div
                className="spinmatic-game-cards"
                key={i}
                onClick={() => viewDetails(item?.gameId)}
              >
                <img src={item?.thumbnail} alt={item?.gameFriendlyName} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}