"use client";
import React, { useState } from "react";
import "./AllSports.scss";
import { BreadCrumb, DateTab, Games, SportsTab } from "@/_components";
import Link from "next/link";
import { BiChevronDown } from "react-icons/bi";
import { useGetSportsQuery } from "@/_services/sport.service";
import { slugify } from "@/_utils";
import { Url } from "next/dist/shared/lib/router/router";
import { Oval } from "react-loader-spinner";

const dates = ["Today", "2-Days", "3-Days", "Week", "All"];

const AllSports = () => {
  const [current, setCurrent] = useState<string>("all");
  const { data, isFetching } = useGetSportsQuery(current);

  const dates = [
    {
      name: "Today",
      value: "today",
    },
    {
      name: "2-Days",
      value: "48hours",
    },
    {
      name: "3-Days",
      value: "72hours",
    },
    {
      name: "Week",
      value: "week",
    },
    {
      name: "All",
      value: "all",
    },
  ];

  return (
    <div className="all_sports">
      <BreadCrumb title="ALL SPORTS" />
      <div className="date_tab between">
        {dates.map((item, idx) => (
          <div
            className={`date_tab_item center ${
              current === item.value && "active"
            }`}
            key={idx}
            onClick={() => setCurrent(item.value)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <SportsTab />
      {isFetching ? (
        <div className="p_20 center">
          <Oval
            height={50}
            width={50}
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        data?.sports?.map((item: any, idx: number) => (
          <Link
            href={(slugify(item?.sportName) + "/" + item?.sportID) as Url}
            key={idx}
            className="all_sports_link between"
          >
            <div className="all_sports_link_left center">
              <div
                className={`sbe-sb-sports-icon all_sports_icon ${item?.sportName?.toLowerCase()}`}
              />
              <div className="all_sports_title">{item?.sportName}</div>
            </div>
            <div className="all_sports_right center">
              <div className="all_sports_num">{item?.total}</div>
              <div className="all_sports_down">
                <BiChevronDown />
              </div>
            </div>
          </Link>
        ))
      )}
      <Games />
    </div>
  );
};

export default AllSports;
