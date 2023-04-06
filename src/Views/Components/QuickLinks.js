import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

export default function QuickLinks() {
  const { virtualURL, user } = useSelector((state) => state.auth);

  const toggle = () => {
    const quicklinks = document.getElementById("quicklinks");
    quicklinks.classList.toggle("open");
  };
  return (
    <div className="quicklinks" id="quicklinks">
      <div className="quicklinks__holder">
        <div className="quicklinks__list">
          <div className="quicklinks__item" id="iconslider_1539_soccer_element">
            <NavLink
              to={"/sport/soccer/1"}
              className="quicklinks__icon"
              id="iconslider_1539_soccer_link"
            >
              <i
                className="icon"
                style={{
                  backgroundImage: "url(/img/soccer.svg)",
                  width: "24px",
                  height: "24px",
                }}
              />
            </NavLink>
            <span className="quicklinks__item-label">Soccer</span>
          </div>
          {/*<div className="quicklinks__item" id="iconslider_321892_zoom_element">
                        <NavLink to={'/sports/sport/zoomsoccer'} className="quicklinks__icon" id="iconslider_321892_zoom_link">
                            <i className="icon" style={{backgroundImage: 'url(/img/zoom.svg)', width: '24px', height: '24px'}}/>
                        </NavLink>
                        <span className="quicklinks__item-label">Zoom</span>
                    </div>*/}
          <div className="quicklinks__item" id="iconslider_321892_zoom_element">
            <NavLink
              to={"/sport/livebetting"}
              className="quicklinks__icon"
              id="iconslider_321892_zoom_link"
            >
              <i
                className="icon"
                style={{
                  backgroundImage: "url(/img/livebetting.svg)",
                  width: "24px",
                  height: "24px",
                }}
              />
            </NavLink>
            <span className="quicklinks__item-label">Live</span>
          </div>
          <div className="quicklinks__item" id="iconslider_321892_zoom_element">
            {/* <a className="quicklinks__icon"  href={virtualURL} id="iconslider_321892_zoom_link"> */}
            <a
              className="quicklinks__icon"
              href={"/virtual"}
              id="iconslider_321892_zoom_link"
            >
              <i
                className="icon"
                style={{
                  backgroundImage: "url(/img/virtual.svg)",
                  width: "24px",
                  height: "24px",
                }}
              />
            </a>
            <span className="quicklinks__item-label">Virtual</span>
          </div>
          <div className="quicklinks__item" id="iconslider_321892_zoom_element">
          <NavLink
              to={"/casino"}
              className="quicklinks__icon"
              id="iconslider_321892_zoom_link"
            >
              <i
                className="icon"
                style={{
                  backgroundImage: "url(/img/casino.svg)",
                  width: "24px",
                  height: "24px",
                }}
              />
            </NavLink>
            <span className="quicklinks__item-label">Casino</span>
          </div>
          <div className="quicklinks__item" id="iconslider_321892_zoom_element">
            {/* <a className="quicklinks__icon"  href={virtualURL} id="iconslider_321892_zoom_link"> */}
            <NavLink
              className="quicklinks__icon"
              to={"/space-man"}
              id="iconslider_321892_zoom_link"
            >
              <i
                className="icon"
                style={{
                  backgroundImage: "url(/img/spaceship.png)",
                  width: "24px",
                  height: "24px",
                }}
              />
            </NavLink>
            <span className="quicklinks__item-label">Space Man</span>
          </div>

          <div className="quicklinks__item" id="iconslider_321892_zoom_element">
            <NavLink
              to={"/dailybundle/soccer"}
              className="quicklinks__icon"
              id="iconslider_321892_zoom_link"
            >
              <i
                className="icon"
                style={{
                  backgroundImage: "url(/img/todays_matches.svg)",
                  width: "24px",
                  height: "24px",
                }}
              />
            </NavLink>
            <span className="quicklinks__item-label">Today</span>
          </div>
          <div className="quicklinks__item" id="iconslider_321892_zoom_element">
            <NavLink
              to={"/coupon-check"}
              className="quicklinks__icon"
              id="iconslider_321892_zoom_link"
            >
              <i
                className="icon"
                style={{
                  backgroundImage: "url(/img/checkcoupon.svg)",
                  width: "24px",
                  height: "24px",
                }}
              />
            </NavLink>
            <span className="quicklinks__item-label">Check a Bet</span>
          </div>
          <div
            className="quicklinks__item"
            id="iconslider_1544_book_a_bet_element"
          >
            <NavLink
              to={"/book-a-bet"}
              className="quicklinks__icon"
              id="iconslider_1544_book_a_bet_link"
            >
              <i
                className="icon"
                style={{
                  backgroundImage: "url(/img/bookabet.svg)",
                  width: "24px",
                  height: "24px",
                }}
              />
            </NavLink>
            <span className="quicklinks__item-label">Book a Bet</span>
          </div>
          <div className="quicklinks__item" id="iconslider_321892_zoom_element">
            <NavLink
              to={"/BecomeAnAgent/Register"}
              className="quicklinks__icon"
              id="iconslider_321892_zoom_link"
            >
              <i
                className="icon"
                style={{
                  backgroundImage: "url(/img/become-an-agent.png)",
                  width: "24px",
                  height: "24px",
                }}
              />
            </NavLink>
            <span className="quicklinks__item-label">Become an Agent</span>
          </div>
          <div className="quicklinks__item" id="iconslider_1548_help_element">
            <NavLink
              to={"/pages/how-to-play"}
              className="quicklinks__icon"
              id="iconslider_1548_help_link"
            >
              <i
                className="icon"
                style={{
                  backgroundImage: "url(/img/help.svg)",
                  width: "24px",
                  height: "24px",
                }}
              />
            </NavLink>
            <span className="quicklinks__item-label">Help</span>
          </div>
          <div className="quicklinks__item" id="iconslider_1548_help_element">
            <NavLink
              to={"/pages/contact-us"}
              className="quicklinks__icon"
              id="iconslider_1548_help_link"
            >
              <i
                className="icon"
                style={{
                  backgroundImage: "url(/img/contactus.svg)",
                  width: "24px",
                  height: "24px",
                }}
              />
            </NavLink>
            <span className="quicklinks__item-label">Contact Us</span>
          </div>
        </div>
        <div className="quicklinks__toggle" onClick={toggle}>
          <i className="icon back" />
          <span className="quicklinks__toggle-label">All</span>
        </div>
      </div>
      <div className="quicklinks__mask" />
    </div>
  );
}
