import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import QuickLinks from "./Components/QuickLinks";
import CarouselComponent from "./Components/Carousel";
import NavTabMenu from "./Components/NavTabMenu";
import { useDispatch, useSelector } from "react-redux";
import LiveCasino from "./Components/LiveCasino";

export default function Home({ history }) {
  const sportsData = useSelector((state) => state.sportsData);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // if (user?.verified === 0) {
    //   history.replace("/Verify");
    // }
  }, [user]);

  return (
    <Layout isHome={true}>
      <QuickLinks />
      <CarouselComponent />
      <LiveCasino />

      <NavTabMenu sportsData={sportsData} dispatch={dispatch} />
    </Layout>
  );
}
