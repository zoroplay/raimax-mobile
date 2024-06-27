"use client";
import React from "react";
import "./LeaguesTab.scss";
import Image from "next/image";
import { NavLink, slugify } from "@/_utils";
import {
  port,
  nba,
  seriea,
  laliga,
  ligue1,
  epl,
  bun,
  champions,
} from "@/_assets";
import { useGetTopTournamentQuery } from "@/_services/sport.service";

const LeaguesTab = () => {

  const getImageURL = (name: string) => {
    if (name.includes('Qualification CAF')) {
      return '/images/qualification.JPG'
    } else {
      return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Top%20Leagues%2F${name}.png?alt=media`
    }
  }

  const { data } = useGetTopTournamentQuery("");

  return (
    <div className="leagues_tab between">
      {data?.map((item: any, idx: number) => (
        <NavLink
          href={`/sports/${slugify(item?.tournament?.name)}/fixtures/${item?.tournament?.category?.sport_id
            }/${item?.tournament?.provider_id}`}
          key={`${item?.name}-${idx}`}
          className="leagues_tab_item center"
          activeClassName="active"
        >
          <img
            className="leagues_tabimg"
            src={getImageURL(item?.tournament?.name)}
            alt="icon"
          />
          <div className="leagues_tab_text">{item?.tournament?.name}</div>
        </NavLink>
      ))}
    </div>
  );
};

export default LeaguesTab;
