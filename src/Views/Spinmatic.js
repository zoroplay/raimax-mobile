import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import { getAllGames } from "../Services/apis";
import { useHistory } from "react-router-dom";

export default function Spinmatic() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState([]);
  const history = useHistory();

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
    history.push(`/spinmatic/${id}`);
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