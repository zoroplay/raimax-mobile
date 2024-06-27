"use client";
import React, { useState } from "react";
import "./Sport.scss";
import {
  BreadCrumb,
  Coupons,
  GameAccordion,
  Games,
  Matches,
} from "@/_components";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/_hooks";
import { slugify } from "@/_utils";
import { useGetLiveCountQuery } from "@/_services/sport.service";


const dates = ["Live Now", "Competitions", "Coupons", "Special"];

const Sport = () => {
  const [current, setCurrent] = useState<string>("Competitions");
  const params = useParams();
  const { sports } = useAppSelector((state) => state.sport);

  let activeSport = sports?.find(
    (item: any) => slugify(item?.sportName) === params.slug[0]
  );

  let { data: liveCount, isLoading: loading }= useGetLiveCountQuery({ sid: activeSport?.sportID });


  const Component = {
    "Live Now": <Matches type="live" />,
    Competitions: <GameAccordion />,
    Coupons: <Coupons />,
    Special: <></>,
  }[current];

  return (
    <div className="sport">
      <BreadCrumb title={params.slug[0]} />
      <div className="sport_tab between">
        {dates.map((item, idx) => (
          <div
            className={`sport_tab_item center ${current === item && "active"}`}
            key={idx}
            onClick={() => setCurrent(item)}
          >
            {item}
            {idx === 0 && (
              <div
                className={`live_count center ${current === item && "active"}`}
              >
                {liveCount?.count || 0}
              </div>
            )}
          </div>
        ))}
      </div>
      {Component}
      <Games />
    </div>
  );
};

export default Sport;
