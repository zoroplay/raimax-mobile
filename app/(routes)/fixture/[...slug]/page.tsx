"use client";
import React, { useEffect, useState } from "react";
import "../../../iconstwo.css";
import "./fixture.scss";
import { AiOutlineStar } from "react-icons/ai";
import { BiStopwatch, BiSolidChevronDown } from "react-icons/bi";
import { VscJersey } from "react-icons/vsc";
import {
  Banner,
  BreadCrumb,
  LeaguesTab,
  GroupedMarket,
  Star,
} from "@/_components";
import { useGetSingleFixtureQuery } from "@/_services/sport.service";
import { useParams } from "next/navigation";
import { createID, isSelected, sortArr } from "@/_utils/helpers";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { addToCoupon, removeFromCoupon } from "@/_redux/slices/betslip.slice";
import { openModal } from "@/_redux/slices/modal.slice";

const Page = () => {
  const router = useParams();
  const [groupedMarketData, setGroupedMarketData] = useState<
    { [key in string]: unknown }[]
  >([]);
  const [pollingInterval, setPollingInterval] = useState(10000);
  // const [active, setActive] = useState<string>("ALL MARKET");
  const [param, setParam] = useState<string>(
    router.slug[router.slug.length - 1]
  );

  const dispatch = useAppDispatch();
  const slips = useAppSelector((state) => state.betslip);

  // const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setIndex(parseInt(e.target.value));
  //   setActive(e.target.value);
  // };

  const title = router.slug[0];
  const titletwo = router.slug[1];
  const { data, refetch } = useGetSingleFixtureQuery(param, {
    pollingInterval,
  });

  useEffect(() => {
    data?.statusCode && setPollingInterval(15000);
    if (data?.statusCode === 3) {
      dispatch(openModal({ message: "Event is no longer active" }));
    }
    if (data?.statusCode === 0) {
      const currentDate = Date.now();
      const eventDate = new Date(data?.date).getTime();
      currentDate > eventDate &&
        dispatch(openModal({ message: "Event is no longer active" }));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (data?.markets) {
      const uniqueMarketId = new Set();
      data?.markets?.forEach((market: { [key in string]: unknown }) => {
        uniqueMarketId.add(market?.marketID);
      });
      const groupedMarket: { [key in string]: unknown }[] = [];
      uniqueMarketId.forEach((id) => {
        const grouped = data?.markets?.filter(
          (market: { [key in string]: unknown }) => {
            return id === market?.marketID;
          }
        );
        groupedMarket.push(grouped);
      });
      setGroupedMarketData(groupedMarket);
    }
  }, [data]);
  // console.log(data?.data?.markets[0].length, "single");

  // const number = 2;
  // const itemList = Array.from({ length: number }, (_, index) => index + 1);

  const variables = useAppSelector((state) => state.sport);

  useEffect(() => {
    setParam(router.slug[router.slug.length - 1]);
  }, [router.slug]);

  return (
    <div className="fixture">
      <LeaguesTab />
      <Banner />
      <BreadCrumb
        title={
          title?.toUpperCase() +
            "--" +
            " " +
            titletwo?.toUpperCase()?.replaceAll("-", " ") || "Fixture"
        }
      />
      <div className="fixture_time between">
        {data?.statusCode ? (
          <div className="fixture_live_time">{data?.eventTime}</div>
        ) : (
          <div className="fixture_icon">
            <BiStopwatch />
          </div>
        )}
        {data?.statusCode ? (
          <div className="center">
            <div className="live_text">Live</div>
            <div className="live_icon" />
          </div>
        ) : (
          <div className="fixture_time_text">{data?.date}</div>
        )}
        <div className="fixture_icon_star">
          <Star data={data} />
        </div>
      </div>
      <div className="fixture_teams between">
        <div className="fixture_team center">
          <div className="fixture_team_name">{data?.competitor1}</div>
          {data?.statusCode ? (
            <div className="fixture_score_home">{data?.homeScore}</div>
          ) : (
            <div className="fixture_icon_team">
              <VscJersey />
            </div>
          )}
        </div>
        <div className="team_vs center">VS</div>
        <div className="fixture_team center">
          {data?.statusCode ? (
            <div className="fixture_score_away">{data?.awayScore}</div>
          ) : (
            <div className="fixture_icon_team_two">
              <VscJersey />
            </div>
          )}
          <div className="fixture_team_name">{data?.competitor2}</div>
        </div>
      </div>
      {/* <div className="fixture_market between">
        <div
          className={`fixture_market_btn center ${
            active === "ALL MARKET" && "active"
          }`}
          onClick={() => {
            setActive("ALL MARKET");
            setIndex(0);
          }}
        >
          ALL MARKETS
        </div>
        <div
          className={`fixture_select_wrap center ${
            active !== "ALL MARKET" && "active"
          }`}
        >
          <select className="select_item" value={index} onChange={handleChange}>
            <option disabled value={0} className="select_option">
              SELECT MARKET{" "}
            </option>
            {data?.data?.markets?.map((item: any, idx: number) => (
              <option key={idx} className="select_option" value={idx}>
                {item?.market_name?.toUpperCase()}
              </option>
            ))}
          </select>
          <div className="select_wrap_icon center">
            <BiSolidChevronDown />
          </div>
        </div>
      </div> */}
      {groupedMarketData?.map((item: any, idx: number) => (
        <div key={idx}>
          <GroupedMarket data={item} type={data?.statusCode} allData={data} />
        </div>
      ))}
    </div>
  );
};

export default Page;
