"use client";
import React, { useState } from "react";
import "./SettingsBlock.scss";
import { BreadCrumb, Games, SelectTab } from "@/_components";

const oddFormats = ["DECIMAL", "FRACTIONAL", "AMERICAN"];
const filter = ["TODAY", "2-DAYS", "3-DAYS", "WEEK", "ALL"];

const SettingsBlock = () => {
  const [current, setCurrent] = useState<string>("DECIMAL");
  const [current1, setCurrent1] = useState<string>("TODAY");

  return (
    <>
      {" "}
      <div className="settings">
        <BreadCrumb title="SETTINGS" />
        <div className="settings_wrap">
          <div className="settings_text">Odds fomat</div>
          <SelectTab
            tabs={oddFormats}
            className="settings_odds"
            current={current}
            setCurrent={setCurrent}
          />
        </div>
        <div className="settings_wrap">
          <div className="settings_text">Time Filter</div>
          <SelectTab
            tabs={filter}
            className="settings_filter"
            current={current1}
            setCurrent={setCurrent1}
          />
        </div>
      </div>
      <Games />
    </>
  );
};

export default SettingsBlock;
