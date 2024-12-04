"use client";
import React, { useEffect, useState } from "react";
import "./Today.scss";
import { Fixture, Fixtures, Prediction } from "@/_components";
import { AiOutlineDown } from "react-icons/ai";
import { IoIosFootball } from "react-icons/io";
import {
  // useGetUpcomingQuery,
  useGroupBySportsQuery,
  useGetBySportsDateQuery,
} from "@/_services/sport.service";
import { getDaysBeforeAndAhead } from "@/_utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInView } from "react-intersection-observer";

interface HighlightsProp {
  start: string;
  end: string;
}

const Today = ({ start, end }: HighlightsProp) => {
  const [currentOdd, setCurrentOdd] = useState<string | null>(null);
  const [marketIndex, setMarketIndex] = useState<number>(1);
  const [sidIndex, setSidIndex] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const { todaysDate, threeWeeksLaterDate } = getDaysBeforeAndAhead();

  const { data: groupedData } = useGroupBySportsQuery({
    start: todaysDate,
    end: threeWeeksLaterDate,
  });
  const { data: fixturesData, isLoading } = useGetBySportsDateQuery({
    start,
    end,
    sid: sidIndex,
    market: marketIndex,
    page,
  });

  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    setFixtures((prev: any) => {
      if (fixturesData?.fixtures?.data) {
        return [...prev, ...fixturesData.fixtures.data];
      } else {
        return prev;
      }
    });
  }, [fixturesData, page]);

  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSidIndex(parseInt(e.target.value));
  };

  const handleFetchMore = () => {
    if (page < fixturesData?.lastPage) setPage((prevPage) => prevPage + 1);
  };
  return (
    <div>
      <div className="select_wrap between">
        <div className="select_wrap_iconr center">
          <IoIosFootball />
        </div>
        <select className="select_item" onChange={handleChange}>
          <option disabled className="select_option">
            PLEASE SELECT{" "}
          </option>
          {groupedData?.map((item: any, idx: number) => (
            <option key={idx} className="select_option" value={item?.sport_id}>
              {item?.name}
            </option>
          ))}
        </select>
        <div className="select_wrap_icon center">
          <AiOutlineDown />
        </div>
      </div>
      <div className="odds between">
        {groupedData &&
          groupedData
            ?.filter((item: any, idx: number) => item?.sport_id === sidIndex)[0]
            ?.markets?.map((item: any, idx: number) => (
              <div
                key={idx}
                className={`odds_item ${currentOdd === item?.name && "active"}`}
                onClick={() => {
                  setCurrentOdd(item?.name);
                  setMarketIndex(item?.id);
                }}
              >
                {item?.name}
              </div>
            ))}
      </div>
      <div className="placebet_infinite" ref={ref}>
        <InfiniteScroll
          dataLength={fixtures.length}
          next={handleFetchMore}
          hasMore={hasMore}
          loader={<div className="loading center">loading...</div>}
          endMessage={<p>No more data to load. </p>}
          // height={700}
        >
          {/* <Prediction data={fixturesData} tournamentName="Tournament" /> */}
          {fixtures?.map((item: any, idx: number) => (
            <div key={idx}>
              <Fixture data={item} />
            </div>
          ))}
          {/* <Fixtures fixtureData={fixtures} predictionData={fixturesData}/> */}
        </InfiniteScroll>
      </div>
      {isLoading && <div className="loading center">Loading new data...</div>}
    </div>
  );
};

export default Today;
