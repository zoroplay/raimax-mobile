"use client";
import React, { useEffect, useState } from "react";
import "./SportsTab.scss";
import { BiSearch } from "react-icons/bi";
import { NavLink, slugify } from "@/_utils";
import Link from "next/link";
import { useGetSportsQuery } from "@/_services/sport.service";
import { useAppDispatch } from "@/_hooks";
import { updateSports } from "@/_redux/slices/sport.slice";
import { Spring } from "framer-motion";

interface SportsTabProps {
  setSearch?: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SportsTab = ({ setSearch }: SportsTabProps) => {
  const [isSearch, setIsSearch] = useState(false);
  const param = "all";
  const dispatch = useAppDispatch();

  const { data } = useGetSportsQuery(param);

  useEffect(() => {
    if (data) dispatch(updateSports(data.sports));
  }, [data]);

  return (
    <>
      <div className="sport_tab">
        <Link href={"/sports/all"} className="sport_tab_all center col">
          <div className="sport_tab_all_icon">
            <div className="sbe-sb-mb-sports-icon all-sports" />
          </div>
          <div className="sport_tab_all_text">ALL SPORTS</div>
        </Link>
        <div className="sport_tab_scroll between">
          {data?.sports?.map((item: any, idx: number) => (
            <NavLink
              key={idx}
              className="sport_tab_scroll_item center col"
              activeClassName="active"
              href={`/sports/${slugify(item?.sportName)}/${item?.sportID}`}
            >
              <div
                className="sport_tab_scroll_icon"
                // style={{ color: item.color }}
              >
                {/* {item.icon} */}
                <div
                  className={`sbe-sb-sports-icon ${item?.sportName?.toLowerCase()}`}
                />
              </div>
              <div className="sport_tab_scroll_text">{item?.sportName}</div>
            </NavLink>
          ))}
        </div>
        <Link
          href={"/search"}
          className={`sport_tab_srch between ${isSearch && "search_active"}`}
        >
          <input
            placeholder="search"
            className="sport_tab_srch_inp"
            onChange={(e) => {
              setSearch && setSearch(e.target.value);
            }}
          />
          <div className="center">
            <BiSearch />
          </div>
        </Link>
      </div>
    </>
  );
};

export default SportsTab;
