import React, { Fragment, useState } from "react";

import Header from "./Header";
import Footer from "./Footer";
import BottomMenu from "../Components/BottomMenu";
import Menu from "../Components/Menu";
import AccountMenu from "../Components/AccountMenu";
import Modal from "../Components/Modal";
import { useSelector } from "react-redux";

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
