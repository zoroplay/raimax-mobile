import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { MD5 } from "crypto-js";

export default function QuickLinks() {
  const { virtualURL, user, isAuthenticated } = useSelector((state) => state.auth);
  const backurl = process.env.REACT_APP_SITE_URL;
  const privateKey = process.env.REACT_APP_XPRESS_PRIVATE_KEY;

  const toggle = () => {
    const quicklinks = document.getElementById("quicklinks");
    quicklinks.classList.toggle("open");
  };

  const viewDetails = () => {
    let mode = 0, id = 1700, token = Math.floor(Math.random() * 1000000000 + 1), group = process.env.REACT_APP_SITE_KEY;
    if (isAuthenticated) {
      console.log(user)
      group = user?.group;
      token = user?.auth_code;
      mode = 1;
    } 
    const hash = MD5(`${token}${id}${backurl}${mode}${group}mobile${privateKey}`).toString();

    window.location.href = `${process.env.REACT_APP_XPRESS_LAUNCH_URL}?token=${token}&game=${id}&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`
  };

  const virtual = () => {
    let mode = 0, id = 10100, token = Math.floor(Math.random() * 1000000000 + 1), group = process.env.REACT_APP_SITE_KEY;
    if (isAuthenticated) {
      console.log(user)
      group = user?.group;
      token = user?.auth_code;
      mode = 1;
    } 
    const hash = MD5(`${token}${id}${backurl}${mode}${group}mobile${privateKey}`).toString();

    window.location.href = `${process.env.REACT_APP_XPRESS_LAUNCH_URL}?token=${token}&game=${id}&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`
  };

  const tvbet = () => {
    let mode = 0, id = 12101, token = Math.floor(Math.random() * 1000000000 + 1), group = process.env.REACT_APP_SITE_KEY;
    if (isAuthenticated) {
      console.log(user)
      group = user?.group;
      token = user?.auth_code;
      mode = 1;
    } 
    const hash = MD5(`${token}${id}${backurl}${mode}${group}mobile${privateKey}`).toString();

    window.location.href = `${process.env.REACT_APP_XPRESS_LAUNCH_URL}?token=${token}&game=${id}&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`
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
            <span className="quicklinks__new">New</span>
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
              to={"/spinmatic"}
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
            <span className="quicklinks__item-label">Spinmatics</span>
          </div>

          <div className="quicklinks__item" id="iconslider_321892_zoom_element">
            <NavLink
              // to={"/tvbet"}
              to = "/" onClick = {tvbet}

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
            <span className="quicklinks__item-label">Tvbet</span>
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
