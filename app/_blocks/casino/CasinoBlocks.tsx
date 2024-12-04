"use client";
import React, { useEffect, useState } from "react";
import "./CasinoBlocks.scss";
import InfiniteScroll from "react-infinite-scroll-component";
import MD5 from "crypto-js/md5";
import {
  useGetAllGamesByCategoryQuery,
  useGetAllCategoriesQuery,
  useGetGameUrlMutation,
} from "@/_services/casino.service";
import { useRouter, useParams } from "next/navigation";
import { Banner, Empty } from "@/_components";
import { BiSearch } from "react-icons/bi";
import { useAppDispatch, useAppSelector, useDebounce } from "@/_hooks";

import { casino } from "@/_assets";
import { BiChevronRight } from "react-icons/bi";
import { openModal } from "@/_redux/slices/modal.slice";

const CasinoBlocks = () => {
  const [mode, setMode] = useState(0);
  const [vtoken, setVtoken] = useState("111111");
  const [hash, setHash] = useState("");
  const [group, setGroup] = useState(process.env.NEXT_PUBLIC_SITE_KEY);
  const backurl = process.env.NEXT_PUBLIC_SITE_URL;
  const privateKey = process.env.NEXT_PUBLIC_XPRESS_PRIVATE_KEY;
  //   const [games, setGames] = useState([]);
  const [count, setCount] = useState(1);
  const [gameId, setGameId] = useState<number>(1);
  const [input, setInput] = useState("");
  const [gamesData, setGamesData] = useState([]);
  const [showCat, setShowCat] = useState(false);
  const [topCategory, setTopCategory] = useState<any>({
    id: 1,
    slug: "all",
    name: "All",
  });

  const [isSearch, setIsSearch] = useState(false);

  const debouncedIput = useDebounce(input, 1000);
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.user);

  const { data: categories } = useGetAllCategoriesQuery({});
  // const { data: searchGames } = useGetGamesBySearchQuery(input);
  const { data: games, refetch: refetchGames } = useGetAllGamesByCategoryQuery({
    catId: topCategory?.id,
    input,
  });
  const [getGameUrl, { isLoading, isSuccess, isError, data, error }] =
    useGetGameUrlMutation();

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (user) {
      setMode(1);
      setGroup(user.group);
      setVtoken(user.auth_code);
    }
  }, [user]);

  useEffect(() => {
    const hashStr = MD5(
      `${token}10100${backurl}${mode}${group}mobile${privateKey}`
    ).toString();

    setHash(hashStr);
  }, []);

  const uniqueGames = (
    prev: { [key in string]: string }[],
    data: { [key in string]: string }[]
  ) => {
    if (data) {
      const filteredGamesData = data.filter(
        (dataItem: { [key in string]: string }) => {
          return !prev.some(
            (prevItem: { [key in string]: string }) =>
              prevItem.gameId === dataItem.gameId
          );
        }
      );
      return [...prev, ...filteredGamesData];
    } else {
      return prev;
    }
  };

  useEffect(() => {
    setGamesData((prev: any) => {
      if (games) {
        return uniqueGames(prev, games.games);
      } else {
        return prev;
      }
    });
  }, [games]);

  // useEffect(() => {
  //   if (isSuccess && data) {
  //     window.open(data?.url);
  //   }

  //   if (isError) {
  //   }
  // }, [isSuccess, isError, data, error]);

  console.log("game url data", data);

  useEffect(() => {
    refetchGames();
    // refetchAllGames();
  }, [gameId]);

  const handleMore = () => {
    setCount((prev) => prev + 1);
  };

  const viewDetails = (id: number) => {
    // getGameUrl({
    //   gameId: id,
    //   username: user?.username || 'guest',
    //   userId: user?.id || 0,
    //   demo: user ? false : true,
    //   isMobile: true,
    //   homeUrl: process.env.NEXT_PUBLIC_SITE_URL,
    //   authCode: user?.authCode || 'demo',
    // });

    dispatch(
      openModal({
        component: "SelectBalance",
        data: id,
      })
    );
  };

  return (
    <>
      <div className="cas_tab">
        <div
          onClick={() => {
            setShowCat(!showCat);
            // setGamesData(games?.data);
          }}
          className="cas_tab_all center col"
          // href={`/casino/all-games`}
        >
          <div className="cas_tab_all_icon">
            <div className="sbe-sb-mb-sports-icon all-sports" />
          </div>
          <div className="cas_tab_all_text">ALL GAMES</div>
        </div>
        <div className="cas_tab_scroll between">
          {categories?.data?.map((item: any, idx: number) => (
            <div
              key={idx}
              className={`cas_tab_scroll_item center col ${
                topCategory?.name === item?.name && "active"
              }`}
              onClick={() => {
                if (item.name !== "Virtuals") {
                  setTopCategory(item);
                  setGamesData([]);
                  router.replace(`/casino/${item?.slug}`);
                }

                if (item.name === "Virtuals") {
                  window.open(
                    `${process.env.NEXT_PUBLIC_XPRESS_LAUNCH_URL}?token=${vtoken}&game=10100&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`
                  );
                }
              }}
              // activeClassName="active"
              // href={`/casino/${slugify(item?.name)}`}
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
            </div>
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
      <Banner />
      {!showCat || input.length > 1 ? (
        <div className={`cas_block ${input && "search_bg"}`} id="scrollableDiv">
          <div className="cas_block_sort">
            {!input && (
              <div className="cas_block_sort_text">
                {topCategory?.name.toUpperCase()}
              </div>
            )}
            {/* <div>
                <div></div>
            </div> */}
          </div>
          {/* <div className="cas_block" id="scrollableDiv"> */}
          {gamesData?.length === 0 ? (
            <Empty title="NO GAMES FOUND" icon={<BiSearch />} />
          ) : (
            // <InfiniteScroll
            //   className={`card_wrap ${input && "search"}`}
            //   dataLength={gamesData?.length || 10}
            //   next={() => handleMore()}
            //   hasMore={true} // Replace with a condition based on your data source
            //   loader={<div>Laoding...</div>}
            //   endMessage={<p>No more data to load.</p>}
            // >
            <div className={`card_wrap ${input && "search"}`}>
              {gamesData
                ?.filter((item: any) => item?.status !== 0)
                ?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="cas_block_game_card"
                    onClick={() => viewDetails(item.id)}
                  >
                    <img
                      src={item?.image_path ? item?.image_path : casino}
                      onError={(e: React.ChangeEvent<HTMLImageElement>) => {
                        e.target.onerror = null;
                        e.target.src = casino;
                      }}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                      className="cas_block_game_img"
                      alt="Game view"
                    />
                    <div className="casino_block_gameitem_text">
                      {item?.title}
                    </div>
                    {/* <div className="cas_block_game_text">
                      <p>{item?.title?.slice(0, 9)}</p>
                    </div> */}
                  </div>
                ))}
            </div>
            // </InfiniteScroll>
          )}
          {/* </div> */}
          <div className="end" style={{ width: "100%" }}>
            <div
              className="view_more_text_wrap center"
              onClick={() => handleMore()}
            >
              <div className="view_more_text">View More</div>
              <BiChevronRight />
            </div>
          </div>
        </div>
      ) : (
        <div className="all_cat_wrap start col">
          {categories?.data?.map((item: any, idx: number) => (
            <div
              key={idx}
              className={`all_cat_item start ${
                topCategory?.name === item?.name && "active"
              }`}
              onClick={() => {
                setGameId(item?.id);
                setTopCategory(item);
                setGamesData([]);
                setShowCat(false);
              }}
              // activeClassName="active"
              // href={`/casino/${slugify(item?.name)}`}
            >
              <div
                className="all_cat_icon"
                // style={{ color: item.color }}
              >
                {/* {item.icon} */}
                <div
                  className={`sbe-sb-sports-icon ${item?.name?.toLowerCase()}`}
                />
              </div>
              {<div className="all_cat_text">{item?.name}</div>}
            </div>
          ))}
        </div>
      )}
      {/* <div className="footer">
          <div className="middle-view">
            <div className="tabs">
              <div className=" tab-flex">
                <div className="fixed-card ">
                  <p>
                    Provider
                    <i className="icon right" />
                  </p>
                </div>
                <div className=" " style={{ marginRight: "12.4rem" }}></div>
                {categories &&
                  categories?.categories?.map((item: any, i: number) => (
                    <div
                      key={i}
                      className={
                        item?.slug === active ? `active-card` : `game-card`
                      }
                      onClick={() => getActive(item?.id, item?.slug)}
                    >
                      <p>{item?.slug}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div> */}
    </>
  );
};

export default CasinoBlocks;
