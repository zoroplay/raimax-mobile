"use client";
import React, { useState } from "react";
import "./DateTab.scss";

const dates = ["Today", "2-Days", "3-Days", "Week", "All"];


const DateTab = () => {
  const [current, setCurrent] = useState<string>("All");
  return (
    <div className="date_tab between">
      {dates.map((item, idx) => (
        <div
          className={`date_tab_item center ${current === item && "active"}`}
          key={idx}
          onClick={() => setCurrent(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default DateTab;
