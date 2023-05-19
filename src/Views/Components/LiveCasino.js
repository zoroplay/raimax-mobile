import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTopCasinoGame } from "../../Services/apis";
import Casino from "../../Assets/casino.jpg";
import { NavLink, useHistory } from "react-router-dom";
import Loader from "../Components/Loader";

function LiveCasino() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const history = useHistory();

  const fetchTopGames = () => {
    setLoading(true);
    getTopCasinoGame()
      .then((response) => {
        setLoading(false);
        setGames(response?.data);
      })
      .catch((err) => {
        setGames(err?.response?.data?.message);

        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTopGames();
  }, []);

  const viewDetails = (id) => {
    if (isAuthenticated) {
      window.open(`/play/live-casino/${id}`);
    } else {
      history.replace("/register");
    }
  };

  return (
    <>
      {games &&
        games?.map((item) => (
          <div className="live-casino">
            <div className="box-header topbets-top">
              <h4>{item?.name}</h4>
              <NavLink to={`/live-casino/${item?.slug}`}>View More</NavLink>
            </div>
            {loading ? (
              <Loader loading={loading} style={{ textAlign: "center" }} />
            ) : (
              <div className="box-carous">
                {item?.games &&
                  item?.games?.map((game, i) => (
                    <div
                      className="box-caro"
                      key={i}
                      onClick={() => viewDetails(game?.casino?.game_id)}
                    >
                      <img
                        src={
                          item?.image_path === null
                            ? Casino
                            : game?.casino?.image_path
                        }
                        alt="view"
                      />
                      <div class="middle">
                        <h4>{game?.casino?.title}</h4>
                        <button class="textt">Play</button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
    </>
  );
}

export default LiveCasino;
