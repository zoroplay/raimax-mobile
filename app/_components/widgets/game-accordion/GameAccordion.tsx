"use client";
import React, { useEffect, useState } from "react";
import "./GameAccordion.scss";
import Link from "next/link";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { AiOutlineStar } from "react-icons/ai";
import {
  useGetSportCategoriesQuery,
  useGetSportTournamentsQuery,
} from "@/_services/sport.service";
import { useParams } from "next/navigation";
import { slugify } from "@/_utils";
import { Oval } from "react-loader-spinner";

const GameAccordion = () => {
  const [isCurrentSub, setIsCurrentSub] = useState<{
    [key in string]: boolean;
  }>({});
  const [tournamentData, setTournamentData] = useState<{
    [key in string]: any;
  }>({});
  const [param, setParam] = useState<string | null>(null);
  const [categoryID, setCategoryID] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState<number | null>(null);
  // const param = "all";

  const router = useParams();
  const { data: sportsData } = useGetSportCategoriesQuery(param, {
    skip: !param,
  });
  const {
    data: tournaments,
    isFetching,
    isSuccess,
  } = useGetSportTournamentsQuery(categoryID, {
    skip: !categoryID,
  });

  useEffect(() => {
    setParam(router.slug[1]);
    const obj: { [key in string]: boolean } = {};
    if (sportsData) {
      sportsData?.sports?.forEach((item: any) => {
        obj[item?.categoryName] = false;
      });
      setIsCurrentSub(obj);
    }
  }, [router.slug[1]]);

  useEffect(() => {
    isSuccess &&
      setTournamentData((prev) => {
        return { ...prev, [categoryName!]: tournaments?.sports };
      });
  }, [tournaments, isSuccess]);

  return (
    <div>
      {sportsData &&
        sportsData?.sports?.map((item: any, idx: number) => (
          <>
            <div
              key={idx}
              className="sport_link between"
              onClick={() => {
                setIsCurrentSub((prev) => {
                  return {
                    ...prev,
                    [item?.categoryName]: !prev[item?.categoryName],
                  };
                });
                setCategoryID(item?.categoryID);
                setCategoryName(item?.categoryName);
              }}
            >
              <div className="sport_link_left center">
                {/* <div className="sport_icon">{item.icon}</div> */}
                <div className="sport_title">{item?.categoryName}</div>
              </div>
              <div className="sport_right center">
                <div className="sport_num">{item?.total}</div>
                <div
                  className={`sport_down ${
                    isCurrentSub[item?.categoryName] && "active"
                  }`}
                >
                  <BiChevronDown />
                </div>
              </div>
            </div>
            {isCurrentSub[item?.categoryName] &&
              tournamentData[item?.categoryName]?.map(
                (tournament: any, idx: number) => (
                  <>
                    {categoryName === item?.categoryName && isFetching ? (
                      idx === 0 && (
                        <div
                          className="p_20 end"
                          style={{
                            width: "100%",
                            borderBottom: "1px solid rgba(0,0,0,0.4)",
                            background: "rgba(0,0,0,0.2",
                          }}
                          key={idx}
                        >
                          <Oval
                            height={15}
                            width={15}
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
                      )
                    ) : (
                      <Link
                        href={`${slugify(
                          tournament?.tournamentName
                        )}/${router.slug[1]}/${tournament?.tournamentID}`}
                        key={`sport_sub_link_${idx}`}
                        className="sport_sub_link between"
                      >
                        <div className="sport_sub_link_left center">
                          {/* <div className="sport_sub_link_icon">{item.icon}</div> */}
                          <div className="sport_sub_link_title">
                            {tournament?.tournamentName}
                          </div>
                        </div>
                        <div className="sport_sub_link_right center">
                          <div className="sport_sub_link_down">
                            <LiaMoneyBillWaveSolid />
                          </div>
                          <div className="sport_sub_link_down">
                            <AiOutlineStar />
                          </div>
                          <div className="sport_sub_link_num">
                            {tournament?.total}
                          </div>
                          <div className="sport_sub_link_down">
                            <BiChevronRight />
                          </div>
                        </div>
                      </Link>
                    )}
                  </>
                )
              )}
          </>
        ))}
    </div>
  );
};

export default GameAccordion;
