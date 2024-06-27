"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Live.scss";
import { Empty, Fixtures } from "@/_components";
import { AiOutlineDown } from "react-icons/ai";
import { IoIosFootball } from "react-icons/io";
import { CgSearchLoading } from "react-icons/cg";
import { BiChevronRight } from "react-icons/bi";
import { useGetLiveFixturesQuery } from "@/_services/sport.service";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import { compareLists, sortArr } from "@/_utils/helpers";
import { useSticky } from "@/_hooks";

const Live = ({ tid, sid }: any) => {
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [activeMarket, setActiveMarket] = useState<any>(null);
  const [activeSport, setActiveSport] = useState<any>(null);
  const [fixtures, setFixtures] = useState<{ [key in string]: string }[]>([]);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [sports, setSports] = useState<{ [key in string]: string }[]>([]);
  const [markets, setMarkets] = useState<{ [key in string]: string }[]>([]);

  // const trackStatus = useRef<string[]>([]);
  const isFirstMount = useRef<boolean>(true);
  const trackSports = useRef<{ [key in string]: string }[]>([]);

  const { data: fixturesData, isLoading } = useGetLiveFixturesQuery(
    {
      sid,
      market: 1,
      tid,
      page,
    },
    {
      pollingInterval: 10000,
      refetchOnMountOrArgChange: true,
    }
  );

  const isSticky = useSticky(309);

  useEffect(() => {
    // set active market
    if (fixturesData && fixturesData?.markets?.length > 0) {
      const arr: any = [];

      fixturesData?.fixtures.forEach((fixture: any) => {
        const sport = arr.find(
          (item: any) => item.sportName === fixture.sportName
        );
        if (!sport)
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
      isFirstMount.current && setActiveSport(sports[0]);
      isFirstMount.current = false;

      if (compareLists(sports, trackSports.current)) {
        if (activeSport) {
          const isFound = sports.find(
            (item) => item.sportID === activeSport.sportID
          );
          isFound === undefined ? setActiveSport(sports[0]) : null;
        }
      }
      trackSports.current = sports;
    }
    if (activeSport) {
      setFixtures(
        fixturesData?.fixtures?.filter(
          (item: any) => item.sportID == activeSport.sportID
        )
      );
    }
  }, [sports]);

  useEffect(() => {
    if (activeSport) {
      // filter fixtures
      const filtered = fixturesData?.fixtures?.filter(
        (item: any) => item.sportID == activeSport.sportID
      );
      // filter markets by sports
      const filteredMarkets = fixturesData?.markets?.filter(
        (market: any) => market.sportID == activeSport.sportID
      );

      // set fixtures
      setFixtures(filtered);

      setMarkets(filteredMarkets); //set markets

      setActiveMarket(filteredMarkets[0]); //set default market
    }
  }, [activeSport]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const sport = sports.find((item: any) => item.sportID == val);
    // setFixtures([]);
    setActiveSport(sport);
  };

  const handleFetchMore = () => {
    setPage((prevPage) => prevPage + 1);
    // if (fixturesData?.fixtures?.data?.length === 0) {
    //   setHasMore(false);
    // }
  };

  return (
    <>
      <div className={`${isSticky ? " stick_live" : ""}`}>
        <div className={`select_wrap between `}>
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
        </div>
        <div className="odds between">
          {markets?.map((item: any, idx: number) => (
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
      ) : fixtures?.length < 1 ? (
        <div className="p_20">
          <Empty title="No Fixtures" icon={<CgSearchLoading />} />
        </div>
      ) : (
        <div className="live_infinite">
          <InfiniteScroll
            dataLength={fixtures?.length}
            next={() => handleFetchMore()}
            hasMore={hasMore}
            loader={<></>}
            endMessage={<Empty title="No Data" icon={<CgSearchLoading />} />}
            // style={{
            //   height: "auto",
            // }}
            // height={700}
          >
            <Fixtures
              fixtureData={fixtures}
              market={activeMarket}
              type="live"
            />
          </InfiniteScroll>
        </div>
      )}
      {/* <div className="end" style={{ width: "100%" }}>
        <div
          className="view_more_text_wrap center"
          onClick={() => handleFetchMore()}
        >
          <div className="view_more_text">View More</div>
          <BiChevronRight />
        </div>
      </div> */}
      {/* {isLoading && <div className="loading center">Loading new data...</div>} */}
    </>
  );
};

export default Live;
