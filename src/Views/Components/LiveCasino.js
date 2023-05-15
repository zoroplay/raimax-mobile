import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTopCasinoGame } from "../../Services/apis";
import Casino from "../../Assets/casino.jpg";
import { NavLink, useHistory } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.css";
import Loader from "../Components/Loader";

function LiveCasino({ title }) {
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
    <div className="live-casino">
      <div className="box-header topbets-top">
        <h4>{title}</h4>
        <NavLink to="/live-casino">View More</NavLink>
      </div>
      {loading ? (
        <Loader loading={loading} style={{ textAlign: "center" }} />
      ) : (
        <Carousel
          className="banner-container"
          style={{ background: "black" }}
          autoPlay={true}
          infiniteLoop={true}
          showStatus={false}
          showThumbs={false}
          centerMode={true}
          centerSlidePercentage={33.3}
          showArrows={true}
          interval={3000}
        >
          {/* <div className="box-holder"> */}
          {games &&
            games?.map((item, i) => (
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
                  <div class="textt">Play</div>
                </div>
              </div>
            ))}
          {/* </div> */}
        </Carousel>
      )}
    </div>
  );
}

export default LiveCasino;
