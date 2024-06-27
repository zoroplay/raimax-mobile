"use client";
import React, { useEffect, useRef, useState } from "react";
import "./SearchLive.scss";
import { Empty, Fixtures } from "@/_components";
import { AiOutlineDown } from "react-icons/ai";
import { IoIosFootball } from "react-icons/io";
import { CgSearchLoading } from "react-icons/cg";
import { BiChevronRight } from "react-icons/bi";
import { useGetLiveFixturesQuery } from "@/_services/sport.service";
import InfiniteScroll from "react-infinite-scroll-component";
import { Oval } from "react-loader-spinner";
import { sortArr } from "@/_utils/helpers";
import { useSticky } from "@/_hooks";

interface SearchLiveProps {
  fixturesData: any;
  isLoading: boolean;
}

const SearchLive = ({ fixturesData, isLoading }: SearchLiveProps) => {
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [activeMarket, setActiveMarket] = useState<any>(null);
  const [activeSport, setActiveSport] = useState<any>(null);
  const [fixtures, setFixtures] = useState<{ [key in string]: string }[]>([]);
  const [sports, setSports] = useState<{ [key in string]: string }[]>([]);
  const [sportID, setSportID] = useState<string>("");
  const [markets, setMarkets] = useState<{ [key in string]: string }[]>([]);
  const [clickAgain, setClickAgain] = useState<boolean>(false);

  // const isSticky = useSticky(275);
  const isSticky = false;

  useEffect(() => {
    // set active market
    if (fixturesData && fixturesData?.markets?.length > 0) {
      setActiveMarket(fixturesData?.markets[0]);

      const arr: any = [];

      fixturesData?.fixtures.forEach((fixture: any) => {
        const sport = arr.find(
          (item: any) => item.sportName === fixture.sportName
        );
        if (
          !sport &&
          fixture?.matchStatus !== "Not started" &&
          fixture?.matchStatus !== "Ended"
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
      const filtered = fixturesData?.fixtures.filter(
        (item: any) =>
          item.sportID == activeSport.sportID &&
          item?.matchStatus !== "Not started" &&
          item?.matchStatus !== "Ended"
      );
      // filter markets by sports
      const filteredMarkets = fixturesData?.markets.filter(
        (market: any) => market.sportID == activeSport.sportID
      );

      // set fixtures
      setFixtures(filtered);

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

  const handleFetchMore = () => {
    setPage((prevPage) => prevPage + 1);
    // if (fixturesData?.fixtures?.data?.length === 0) {
    //   setHasMore(false);
    // }
  };
  console.log(fixtures, "fixLive");

  return (
    <>
      {fixtures.length > 0 && (
        <div>
          <div className={`${isSticky ? " sticks" : ""}`}>
            {/* <div className={`select_wrap between `}>
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
              <div className="search_block_live_wrap start">
                <div className="search_block_live_anim" />
                <div className="search_block_live_text">Live</div>
              </div>
              <div className="center sport_item_live_wrap">
                {sports?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className={`sport_item_live ${
                      item?.sportName === activeSport?.sportName && "active"
                    }`}
                    onClick={() => handleChange(item)}
                  >
                    {item?.sportName}
                  </div>
                ))}
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
                  type="live"
                />
              </InfiniteScroll>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchLive;
