import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { getGamesByCategory, getMoreCasino } from "../Services/apis";
import Casino from "../Assets/casino.jpg";
// import Casino from "../Assets/img/cas.jpeg";
import { useHistory, useParams } from "react-router-dom";
import Loader from "./Components/Loader";

export default function ViewMoreGames() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mode, setMode] = useState(0);
  const [token, setToken] = useState("111111");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState([]);
  const [group, setGroup] = useState(process.env.REACT_APP_SITE_KEY);
  const history = useHistory();
  let { category } = useParams();

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

  useEffect(() => {}, [token, mode]);

  const fetchGames = () => {
    setLoading(true);
    // getGamesByCategory(category)
    getMoreCasino()
      .then((response) => {
        console.log(response);
        setLoading(false);
        setGames(response);
      })
      .catch((err) => {
        setGames(err?.response?.data?.message);

        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const viewDetails = (id) => {
    if (isAuthenticated) {
      window.open(`/play/live-casino/${id}`);
    } else {
      history.push("/register");
    }
  };
  return (
    <div>
      <div className="box-header" style={{ padding: "1.2rem" }}>
        <h2>Live Casino</h2>
        <NavLink to="/">Back</NavLink>
      </div>
      <div className="box-holder">
        {loading ? (
          <Loader loading={true} />
        ) : (
          games &&
          games?.games?.map((item, i) => (
            <>
              <div
                className="box"
                key={i}
                onClick={() => viewDetails(item?.game_id)}
              >
                <img
                  src={item?.image_path === null ? Casino : item?.image_path}
                  alt="view"
                />
                <div class="middle">
                  <h4>{item?.title}</h4>
                  <button class="textt">Play</button>
                </div>
              </div>
            </>
          ))
        )}
      </div>
    </div>
  );
}
