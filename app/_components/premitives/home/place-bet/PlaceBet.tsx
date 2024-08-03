"use client";
import React, { useEffect, useState } from "react";
import "./PlaceBet.scss";
import { Highlights } from "@/_components";
import { getDaysBeforeAndAhead } from "@/_utils";
import { useAppDispatch, useAppSelector, useSticky } from "@/_hooks";
import { setActivePeriod, setFixtureTab } from "@/_redux/slices/modal.slice";
import Live from "../live/Live";
import { periods } from "@/_utils/helpers";

const PlaceBet = () => {
  const dispatch = useAppDispatch();
  const {fixtureTab: currentTab, activePeriod} = useAppSelector((state) => state.modal);
  const [changePeriod, setChangePeriod] = useState(false);
  const { todaysDate, threeWeeksLaterDate } = getDaysBeforeAndAhead();

  const Component = {
    TODAY: (
      <Highlights type="today" period={`${activePeriod?.value}`} end={`${todaysDate}`} />
    ),
    "LIVE NOW": <Live tid={0} sid={0} />,
    HIGHLIGHTS: (
      <Highlights
        type="upcoming"
        period={activePeriod?.value}
        end={threeWeeksLaterDate}
      />
    ),
  }[currentTab as string];

  const isSticky = useSticky(275);

  console.log(activePeriod, currentTab);

  return (
    <>
      <div className={`live_tab between ${isSticky && "stick_place"}`}>
        <div
          className={`live_tab_item center ${
            currentTab === 'TODAY' && "active"
          }`}
          onClick={() => {
            if (currentTab !== 'TODAY') {
              dispatch(setFixtureTab("TODAY"))
            } else {
              setChangePeriod(!changePeriod)
            }
          }}
          style={{flexDirection: 'row', justifyContent: 'space-between',position: 'relative'}}
        >
          <span>
            {activePeriod?.label || 'TODAY'}
          </span>
          <span>
            {changePeriod ? <img src="./images/arrow-up.svg" /> : <img src="./images/arrow-down.svg" />}
          </span>
          
        </div>
        {["LIVE NOW", "HIGHLIGHTS"].map((item) => (
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
      {changePeriod && 
      <div style={{position: 'relative'}}>
        <div className="periods">
          <ul>
            {periods.map(period => 
            <li key={`${period.value}`} onClick={() => { 
              dispatch(setActivePeriod(period));
              setChangePeriod(!changePeriod);
            }}>{period.label}</li> )}
          </ul>
        </div>
      </div>}
      {isSticky && <div style={{ height: "34px" }} />}
      
      {Component}
    </>
  );
};

export default PlaceBet;
