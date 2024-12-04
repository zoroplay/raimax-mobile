"use client";
import React, { useState, useEffect } from "react";
import "./FavoritesBlock.scss";
import { BreadCrumb, Empty, Games, Fixtures } from "@/_components";
import { AiFillStar } from "react-icons/ai";
import { useGetFavouriteQuery } from "@/_services/sport.service";
import { useAppSelector } from "@/_hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import { Watch } from "react-loader-spinner";
import { CgSearchLoading } from "react-icons/cg";
import { BiChevronRight } from "react-icons/bi";

const FavoritesBlock = () => {
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [fixtures, setFixtures] = useState<{ [key in string]: string }[]>([]);
  const [activeMarket, setActiveMarket] = useState<any>(null);

  const { user } = useAppSelector((state) => state.user);

  const { data, isLoading, isFetching } = useGetFavouriteQuery(
    {
      favourite: 1,
      userId: user?.id,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

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

  useEffect(() => {
    // set active market
    if (data && data?.markets?.length > 0) setActiveMarket(data.markets[0]);
    setFixtures((prev) => uniqueFixtures(prev, data?.fixtures));
  }, [data]);

  const handleFetchMore = () => {
    if (page < data?.lastPage) setPage((prevPage) => prevPage + 1);
    if (data?.lastPage === page) setHasMore(false);
  };

  return (
    <div className="fav_block">
      <BreadCrumb title="MY FAVORITES" />
      <div className={`odds between`}>
        {data &&
          data?.markets?.map((item: any, idx: number) => (
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
      <>
        {data?.fixtures ? (
          <div className="placebet_infinite">
            <InfiniteScroll
              dataLength={data?.fixtures?.length}
              next={() => handleFetchMore()}
              hasMore={hasMore}
              loader={<></>}
              endMessage={<Empty title="No Data" icon={<CgSearchLoading />} />}
            >
              <Fixtures
                fixtureData={fixtures}
                market={activeMarket}
                type={"prematch"}
              />
            </InfiniteScroll>
            {page < data?.lastPage &&
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
          </div>
        ) : (
          <div className="fav_block_wrap">
            <Empty
              icon={<AiFillStar />}
              title=" You don't have any favorites in your list "
            />
          </div>
        )}
      </>
      <Games />
    </div>
  );
};

export default FavoritesBlock;
