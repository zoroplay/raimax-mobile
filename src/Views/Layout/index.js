import React, { Fragment, useState } from "react";

import Header from "./Header";
import Footer from "./Footer";
import BottomMenu from "../Components/BottomMenu";
import Menu from "../Components/Menu";
import AccountMenu from "../Components/AccountMenu";
import Modal from "../Components/Modal";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function Index({
  contained = true,
  footer = true,
  nav = true,
  bottom = true,
  children,
  page,
  headerLeft,
  headerRight,
  headerCenter,
  ...props
}) {
  const { showDownload } = useSelector((state) => state.sportsData);
  const auth = useSelector((state) => state.auth);
  const [searchKey, setSearchKey] = useState('');
  const history = useHistory();

  const searchFixtures = (e) => {
    e.preventDefault();
    history.push(`/soccer/search?q=${searchKey}`);
  }
  return (
    <div>
      <Menu />
      <div
        id="wrapper"
        className={`wrapper ${showDownload ? "top-padding" : ""}`}
      >
        {nav && (
          <Header
            left={headerLeft}
            right={headerRight}
            center={headerCenter}
            showDownload={showDownload}
            auth={auth}
          />
        )}
        <main>
          <form onSubmit={searchFixtures} className="cnt">
            <div class="heading__search">
              <div class="heading__search-left">
              <input 
                value={searchKey}
                onChange={(e) =>  setSearchKey(e.target.value)}
                // onKeyUp={(e) => e.key === 'enter'}
                // style={{width: '100%', height: '30px', backgroundColor: 'white', color: 'black'}}
                placeholder="Search for event" 
              />
              </div>
              <div class="heading__search-right">
                <span class="icon search" id="pushmenu_search_icon"></span>
              </div>
            </div>
          </form>

          {children}
          <Modal />
        </main>
        {footer && <Footer bottom={bottom} />}
      </div>
      {auth.isAuthenticated && <AccountMenu showDownload={showDownload} />}
      {bottom && <BottomMenu />}
      <div className="myacc-s-mask" />
    </div>
  );
}
