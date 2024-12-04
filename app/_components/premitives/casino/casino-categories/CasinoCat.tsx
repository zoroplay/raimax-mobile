"use client";
import React, { useState, SetStateAction } from "react";
import "./CasinoCat.scss";
import { BiSearch } from "react-icons/bi";
import { NavLink, slugify } from "@/_utils";
import Link from "next/link";
import {
  useGetAllTopCategoriesQuery,
  useGetGamesByTopCategoryQuery,
} from "@/_services/casino.service";

interface CasinoCatProps {
  setGameId: React.Dispatch<SetStateAction<number>>;
  setTopCategory: React.Dispatch<SetStateAction<string>>;
  setInput: React.Dispatch<SetStateAction<string>>;
  setGamesData: React.Dispatch<SetStateAction<any>>;
  gameId: number;
  topCategory: string;
}

const CasinoCat = ({
  setGameId,
  gameId,
  setTopCategory,
  setGamesData,
  setInput,
  topCategory,
}: CasinoCatProps) => {
  const { data: topCategories } = useGetAllTopCategoriesQuery("");

  const [isSearch, setIsSearch] = useState(false);

  const { data: games } = useGetGamesByTopCategoryQuery(gameId);

  // console.log(data, "data");
  return (
    <>
      <div className="cas_tab">
        <Link
          onClick={() => {
            setTopCategory("All");
            setGamesData([]);
          }}
          className="cas_tab_all center col"
          href={`/casino/all-games`}
        >
          <div className="cas_tab_all_icon">
            <div className="sbe-sb-mb-sports-icon all-sports" />
          </div>
          <div className="cas_tab_all_text">ALL GAMES</div>
        </Link>
        <div className="cas_tab_scroll between">
          {topCategories?.data?.map((item: any) => (
            <NavLink
              key={item?.name}
              className={`cas_tab_scroll_item center col ${
                topCategory === item?.name && "active"
              }`}
              onClick={() => {
                setGameId(item?.id);
                setTopCategory(item?.name);
                setGamesData([]);
              }}
              activeClassName="active"
              href={`/casino/${slugify(item?.name)}`}
            >
              <div
                className="cas_tab_scroll_icon"
                // style={{ color: item.color }}
              >
                {/* {item.icon} */}
                <div
                  className={`sbe-sb-sports-icon ${item?.name?.toLowerCase()}`}
                />
              </div>
              <div className="cas_tab_scroll_text">{item?.name}</div>
            </NavLink>
          ))}
        </div>
        <div className={`cas_tab_srch between ${isSearch && "search_active"}`}>
          <input
            placeholder="search"
            className="cas_tab_srch_inp"
            onChange={(e) => setInput(e.target.value)}
          />
          <div
            onClick={() => setIsSearch(!isSearch)}
            className="center cas_tab_srch_icon"
          >
            <BiSearch />
          </div>
        </div>
      </div>
    </>
  );
};

export default CasinoCat;
