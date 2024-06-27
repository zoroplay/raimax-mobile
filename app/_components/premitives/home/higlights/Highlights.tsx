"use client";
import React, { useEffect, useState, useRef } from "react";
import "./Highlights.scss";
import { Empty, Fixtures } from "@/_components";
import { AiOutlineDown } from "react-icons/ai";
import { IoIosFootball } from "react-icons/io";
import { CgSearchLoading } from "react-icons/cg";
import { BiChevronRight } from "react-icons/bi";
import {
  useGroupBySportsQuery,
  useGetUpcomingQuery,
  useGetSportsQuery,
} from "@/_services/sport.service";
import { getDaysBeforeAndAhead } from "@/_utils";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInView } from "react-intersection-observer";
import { Watch, Oval } from "react-loader-spinner";
import { motion } from "framer-motion";
import { useAppDispatch, useSticky, useAppSelector } from "@/_hooks";
import { setSidIndex } from "@/_redux/slices/modal.slice";

interface HighlightsProp {
  start: string;
  end: string;
  type: string;
}

const Highlights = ({ start, end, type }: HighlightsProp) => {
  const [currentOdd, setCurrentOdd] = useState<string | null>(null);
  const [marketIndex, setMarketIndex] = useState<number>(1);
  const [animKey, setAnimKey] = useState<number | string>();
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [fixtures, setFixtures] = useState<{ [key in string]: string }[]>([]);

  const sidIndex = useAppSelector((state) => state.modal.sidIndex);

  const oddsRef = useRef<HTMLDivElement>(null);
  const prevSidIndex = useRef(sidIndex);

  const isSticky = useSticky(309);
  const dispatch = useAppDispatch();

  const { ref, inView } = useInView({
    threshold: 1,
    rootMargin: "-20px 0px",
  });

  const { todaysDate, threeWeeksLaterDate } = getDaysBeforeAndAhead();
  const [activeMarket, setActiveMarket] = useState<any>(null);

  console.log(todaysDate, threeWeeksLaterDate, "date");

  const { data: groupedData } = useGroupBySportsQuery({
    start: todaysDate,
    end: threeWeeksLaterDate,
  });

  const { data } = useGetSportsQuery("all");

  const {
    data: fixturesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetUpcomingQuery({
    start,
    end,
    type,
    sid: sidIndex,
    market: marketIndex,
    page,
  });

  // console.log(groupFixturesTime(fixturesData?.fixtures?.data), "grouped");
  // console.log(fixtures, "grouped");
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
      return [...prev, ...filteredFixturesData];
    } else {
      return prev;
    }
  };

  // useEffect(() => {
  //   setFixtures([]);
  //   setPage(1);
  // }, [marketIndex, sidIndex, end]);

  useEffect(() => {
    // set active market
    if (fixturesData && fixturesData?.markets?.length > 0)
      setActiveMarket(fixturesData.markets[0]);

    setTimeout(() => {
      setFixtures((prev) => uniqueFixtures(prev, fixturesData?.fixtures));
    }, 1);
  }, [fixturesData]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSidIndex(parseInt(e.target.value)));
  };

  useEffect(() => {
    setFixtures([]);
    setPage(1);
    setHasMore(true);
    if (prevSidIndex.current === sidIndex) {
      setAnimKey(end);
    } else {
      setAnimKey(sidIndex);
    }
    prevSidIndex.current = sidIndex;
  }, [sidIndex, end]);

  // console.log(isLoading, "sticky");

  const handleFetchMore = () => {
    if (page < fixturesData?.lastPage) setPage((prevPage) => prevPage + 1);
    if (fixturesData?.lastPage === page) setHasMore(false);
  };

  useEffect(() => {
    handleFetchMore();
  }, [inView]);

  return (
    <>
      <div className={`${isSticky ? " stick" : ""}`}>
        <div className="select_wrap between">
          <div className="select_wrap_iconr center">
            <IoIosFootball />
          </div>
          <select
            className="select_item"
            onChange={handleChange}
            value={sidIndex}
          >
            <option disabled className="select_option">
              PLEASE SELECT{" "}
            </option>
            {data?.sports?.map((item: any, idx: number) => (
              <option key={idx} className="select_option" value={item?.sportID}>
                {item?.sportName}
              </option>
            ))}
          </select>
          <div className="select_wrap_icon center">
            <AiOutlineDown />
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
            {/* <InfiniteScroll
              dataLength={fixtures?.length}
              next={() => handleFetchMore()}
              hasMore={hasMore}
              loader={<></>}
              endMessage={<Empty title="No Data" icon={<CgSearchLoading />} />}
              // style={{
              //   height: "auto",
              // }}
              // height={700}
            > */}
            <Fixtures
              fixtureData={fixtures}
              market={activeMarket}
              type={"prematch"}
            />
            <div ref={ref} />
            {/* </InfiniteScroll> */}
          </div>
        )}
        {page <= fixturesData?.lastPage &&
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
                // onClick={() => handleFetchMore()}
              >
                {!hasMore && (
                  <div className="view_more_text">All fixtures Loaded</div>
                )}
                {/* <BiChevronRight /> */}
              </div>
            </div>
          ))}
      </motion.div>
      {/* {isLoading && <div className="loading center">Loading new data...</div>} */}
    </>
  );
};

export default Highlights;
