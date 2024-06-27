"use client";
import React, { useState } from "react";
import "./HomeBlock.scss";
import { Banner, Games, PlaceBet, SportsTab, LeaguesTab } from "@/_components";
import {
  useGroupBySportsQuery,
  useSearchEventQuery,
} from "@/_services/sport.service";
import { Grid, TailSpin } from "react-loader-spinner";

const HomeBlock = () => {
  const { isLoading } = useGroupBySportsQuery("");

  return (
    <div className="home_block">
      <LeaguesTab />
      <Banner />
      {isLoading ? (
        <div className="home_block_load center" style={{ width: "100%" }}>
          <TailSpin
            height="80"
            width="80"
            color="#5bbf5a"
            ariaLabel="tail-spin-loading"
            radius="0.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          {/* <Empty title="Loading data" icon={<CgSearchLoading />} /> */}
        </div>
      ) : (
        <div className="sport_bet_wrap">
          {" "}
          <SportsTab />
          <PlaceBet />
        </div>
      )}

      <Games />
    </div>
  );
};

export default HomeBlock;
