"use client";
import React from "react";
import "./LeaguesTab.scss";
import { NavLink, slugify } from "@/_utils";
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
      {data?.data?.map((item: any, idx: number) => (
        <NavLink
          href={`/sports/${slugify(item?.tournamentName)}/fixtures/${item?.sportID
            }/${item?.tournamentID}`}
          key={`${item?.name}-${idx}`}
          className="leagues_tab_item center"
          activeClassName="active"
        >
          <img
            className="leagues_tabimg"
            src={getImageURL(item?.tournamentName)}
            alt="icon"
          />
          <div className="leagues_tab_text">{item?.tournamentName}</div>
        </NavLink>
      ))}
    </div>
  );
};

export default LeaguesTab;
