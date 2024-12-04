"use client";
import React, { useEffect, useState, useRef } from "react";
import "./SearchEvent.scss";
import { Empty, Fixtures } from "@/_components";
import { AiOutlineDown } from "react-icons/ai";
import { IoIosFootball } from "react-icons/io";
import { CgSearchLoading } from "react-icons/cg";
import { BiChevronRight } from "react-icons/bi";
import {
  useGroupBySportsQuery,
  useGetUpcomingQuery,
} from "@/_services/sport.service";
import { getDaysBeforeAndAhead } from "@/_utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInView } from "react-intersection-observer";
import { Oval, Watch } from "react-loader-spinner";
import { AnimatePresence, motion } from "framer-motion";
import { useSticky } from "@/_hooks";
import { sortArr } from "@/_utils/helpers";

interface SearchEventProp {
  fixturesData: any;
  isLoading: boolean;
  isFetching: boolean;
}

const SearchEvent = ({
  fixturesData,
  isLoading,
  isFetching,
}: SearchEventProp) => {
  const [animKey, setAnimKey] = useState<number | string>();
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sports, setSports] = useState<{ [key in string]: string }[]>([]);
  const [fixtures, setFixtures] = useState<{ [key in string]: string }[]>([]);
  const [activeSport, setActiveSport] = useState<any>(null);
  const [clickAgain, setClickAgain] = useState<boolean>(false);
  const [markets, setMarkets] = useState<{ [key in string]: string }[]>([]);

  const oddsRef = useRef<HTMLDivElement>(null);

  const { todaysDate, threeWeeksLaterDate } = getDaysBeforeAndAhead();
  const [activeMarket, setActiveMarket] = useState<any>(null);

  const { data: groupedData } = useGroupBySportsQuery({
    start: todaysDate,
    end: threeWeeksLaterDate,
  });

  const uniqueFixtures = (
    prev: { [key in string]: string }[],
    data: { [key in string]: string }[]
  ) => {
    if (data) {
      const filteredFixturesData = data.filter(
        (dataItem: { [key in string]: string }) => {
          return !prev.some(
            (prevItem: { [key in string]: string }) =>
              prevItem.name === dataItem.name
          );
        }
      );
      const filterData = filteredFixturesData.filter(
        (item: any) =>
          item?.matchStatus === "Not started" &&
          item.sportID == activeSport.sportID
      );
      return [...prev, ...filterData];
    } else {
      return prev;
    }
  };

  useEffect(() => {
    // set active market and sport
    if (fixturesData && fixturesData?.markets?.length > 0) {
      setActiveMarket(fixturesData?.markets[0]);

      const arr: any = [];

      fixturesData?.fixtures.forEach((fixture: any) => {
        const sport = arr.find(
          (item: any) => item.sportName === fixture.sportName
        );
        if (
          !sport &&
          (fixture?.matchStatus === "Not started" ||
            fixture?.matchStatus === "Ended")
        )
          arr.push({
            sportID: fixture.sportID,
            sportName: fixture.sportName,
          });
      });

      setSports(sortArr(arr, "sportID"));
    }
  }, [fixturesData]);

  useEffect(() => {
    // set active sport
    if (sports.length > 0) {
      setActiveSport(sports[0]);
    }
  }, [sports]);

  useEffect(() => {
    if (activeSport) {
      // filter fixtures
      // const filtered = fixturesData?.fixtures.filter(
      //   (item: any) =>
      //     item.sportID == activeSport.sportID &&
      //     item?.matchStatus !== "Not started"
      // );
      setFixtures((prev) => uniqueFixtures(prev, fixturesData?.fixtures));
      // filter markets by sports
      const filteredMarkets = fixturesData?.markets.filter(
        (market: any) => market.sportID == activeSport.sportID
      );

      setMarkets(filteredMarkets); //set markets

      setActiveMarket(filteredMarkets[0]); //set default market
    }
  }, [activeSport, clickAgain]);

  const handleChange = (item: any) => {
    const val = item?.sportID;
    const sport = sports.find((item: any) => item.sportID == val);
    setFixtures([]);
    setActiveSport(sport);
    setClickAgain(!clickAgain);
  };

  // const isSticky = useSticky(275);
  const isSticky = false;

  const handleFetchMore = () => {
    setPage((prevPage) => prevPage + 1);
    // if (fixturesData?.fixtures?.data?.length === 0) {
    //   setHasMore(false);
    // }
  };

  console.log(fixtures, "fixEvent");

  return (
    <>
      {fixtures.length > 0 && (
        <div>
          {" "}
          <div className={`${isSticky ? " stick" : ""}`}>
            {/* <div className="select_wrap between">
          <div className="select_wrap_iconr center">
            <IoIosFootball />
          </div>
          <select className="select_item" onChange={handleChange}>
            <option disabled className="select_option">
              PLEASE SELECT{" "}
            </option>
            {sports?.map((item: any, idx: number) => (
              <option key={idx} className="select_option" value={item?.sportID}>
                {item?.sportName}
              </option>
            ))}
          </select>
          <div className="select_wrap_icon center">
            <AiOutlineDown />
          </div>
        </div> */}
            <div className="search_block_upcm start">
              <div className="search_block_upcm_wrap start">
                <div className="search_block_upcm_anim" />
                <div className="search_block_upcm_text">Upcoming</div>
              </div>
              <div className="center sport_item_upcm_wrap">
                {sports?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className={`sport_item_upcm ${
                      item?.sportName === activeSport?.sportName && "active"
                    }`}
                    onClick={() => handleChange(item)}
                  >
                    {item?.sportName}
                  </div>
                ))}
              </div>
            </div>
            <div className={`odds between`}>
              {fixturesData &&
                fixturesData?.markets?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className={`odds_item ${
                      activeMarket?.marketID === item?.marketID && "active"
                    }`}
                    onClick={() => {
                      // setCurrentOdd(item?.name);
                      setActiveMarket(item);
                    }}
                  >
                    {item?.marketName}
                  </div>
                ))}
            </div>
          </div>
          <motion.div
            key={animKey}
            initial={{ x: -80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.6,
              ease: "easeInOut",
            }}
          >
            {isSticky && <div style={{ height: "77px" }} />}
            {isLoading ? (
              <div className="p_20 center" style={{ width: "100%" }}>
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
            ) : fixturesData?.fixtures?.data?.length < 1 ||
              !fixturesData?.fixtures ? (
              <div className="p_20">
                <Empty title="No Fixtures" icon={<CgSearchLoading />} />
              </div>
            ) : (
              <div className="placebet_infinite">
                <InfiniteScroll
                  dataLength={fixtures?.length}
                  next={() => handleFetchMore()}
                  hasMore={hasMore}
                  loader={<></>}
                  endMessage={
                    <Empty title="No Data" icon={<CgSearchLoading />} />
                  }
                  // style={{
                  //   height: "auto",
                  // }}
                  // height={700}
                >
                  <Fixtures
                    fixtureData={fixtures}
                    market={activeMarket}
                    type={"prematch"}
                  />
                </InfiniteScroll>
              </div>
            )}
            {page < fixturesData?.lastPage &&
              (isFetching ? (
                <div
                  className="end"
                  style={{
                    width: "100%",
                  }}
                >
                  <div className="view_more_text_wrap">
                    <Watch
                      height="20"
                      width="20"
                      radius="48"
                      color="#e78b3d"
                      ariaLabel="watch-loading"
                      wrapperStyle={{}}
                      visible={true}
                    />
                  </div>
                </div>
              ) : (
                <div className="end" style={{ width: "100%" }}>
                  <div
                    className="view_more_text_wrap center"
                    onClick={() => handleFetchMore()}
                  >
                    <div className="view_more_text">View More</div>
                    <BiChevronRight />
                  </div>
                </div>
              ))}
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SearchEvent;
