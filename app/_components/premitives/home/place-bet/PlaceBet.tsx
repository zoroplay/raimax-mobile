"use client";
import React, { useEffect, useState } from "react";
import "./PlaceBet.scss";
import { Highlights } from "@/_components";
import { getDaysBeforeAndAhead } from "@/_utils";
import { useAppDispatch, useAppSelector, useSticky } from "@/_hooks";
import { setFixtureTab } from "@/_redux/slices/modal.slice";
import Live from "../live/Live";

const PlaceBet = () => {
  // const [currentTab, setCurrentTab] = useState("HIGHLIGHTS");
  const dispatch = useAppDispatch();
  const currentTab = useAppSelector((state) => state.modal.fixtureTab);

  const { todaysDate, threeWeeksLaterDate } = getDaysBeforeAndAhead();

  const Component = {
    HIGHLIGHTS: (
      <Highlights
        type="upcoming"
        start={todaysDate}
        end={threeWeeksLaterDate}
      />
    ),
    "LIVE NOW": <Live tid={0} sid={0} />,
    TODAY: (
      <Highlights type="today" start={`${todaysDate}`} end={`${todaysDate}`} />
    ),
  }[currentTab as string];

  useEffect(() => {
    console.log(null);
  }, [currentTab]);

  const isSticky = useSticky(275);

  // console.log(fixtures?.length, "Odss");

  return (
    <>
      <div className={`live_tab between ${isSticky && "stick_place"}`}>
        {["HIGHLIGHTS", "LIVE NOW", "TODAY"].map((item) => (
          <div
            key={item}
            className={`live_tab_item center ${
              currentTab === item && "active"
            }`}
            onClick={() => dispatch(setFixtureTab(item))}
          >
            {item}
          </div>
        ))}
      </div>
      {isSticky && <div style={{ height: "34px" }} />}

      {Component}
    </>
  );
};

export default PlaceBet;
