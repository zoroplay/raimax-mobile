"use client";
import React, { useEffect, useState } from "react";
import "./Competition.scss";
import { BreadCrumb, Matches, SelectTab, Outrights } from "@/_components";
import { useParams } from "next/navigation";
import Live from "../../home/live/Live";
import { useSticky } from "@/_hooks";

const tabs = ["MATCHES", "LIVE NOW"];
// "OUTRIGHTS",

const Competition = () => {
  const [current, setCurrent] = useState<string>("MATCHES");
  const route = useParams();

  const name = route.slug[0];
  const sport_id = route.slug[2];
  const competion_id = route.slug[3];

  const Component = {
    MATCHES: <Matches type="prematch" />,
    OUTRIGHTS: <Outrights />,
    "LIVE NOW": <Live tid={competion_id} sid={sport_id} />,
  }[current];

  const isSticky = useSticky(180);

  return (
    <>
      {isSticky && <div style={{ height: "98px" }} />}
      <div className="comp">
        <div className={`${isSticky ? "stick_tournament" : ""}`}>
          <BreadCrumb title={name?.toUpperCase() || "COMPETITION"} />
          <SelectTab
            tabs={tabs}
            className="competition"
            current={current}
            setCurrent={setCurrent}
          />
        </div>
        {Component}
      </div>
    </>
  );
};

export default Competition;
