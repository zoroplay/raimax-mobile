"use client";
import React, { useState, Dispatch, SetStateAction } from "react";
import "./SelectTab.scss";

interface SelectTabProps {
  tabs: string[];
  className?: string;
  current: string | null;
  setCurrent: Dispatch<SetStateAction<string>>;
}

const SelectTab = ({
  tabs,
  className,
  current,
  setCurrent,
}: SelectTabProps) => {
  return (
    <div className={`select_tab between ${className}`}>
      {tabs.map((item, idx) => (
        <div
          className={`select_tab_item center  ${current === item && "active"}`}
          key={idx}
          onClick={() => setCurrent(item)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default SelectTab;
