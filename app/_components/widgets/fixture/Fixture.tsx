"use client";
import {} from "@/_assets";
import "./Fixture.scss";
import "../../../iconstwo.css";
import { AiOutlineStar, AiOutlineRight } from "react-icons/ai";
import { MdOutlineStar } from "react-icons/md";
import Link from "next/link";
import Container from "@/_components/premitives/container/Container";
import { dayMonth, rtkMutation, slugify } from "@/_utils";
import { useAppDispatch, useAppSelector, useTimer } from "@/_hooks";
import { addToCoupon, removeFromCoupon } from "@/_redux/slices/betslip.slice";
import { createID, isSelected, sortArr } from "@/_utils/helpers";
import { useEffect, useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import {
  useFavouriteMutation,
  useGetFavouriteQuery,
} from "@/_services/sport.service";
import { Star } from "@/_components";

interface TableItemProps {}

const Fixture = ({ data, market, specifiers, specifier, type }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFav, setIsFav] = useState<boolean>(false);

  const number = data?.outcomes?.length;
  const itemList = Array.from({ length: number }, (_, index) => index + 1);
  const [outcomes, setOutcomes] = useState<any>([]);
  const [activeSpecifier, setActiveSpecifier] = useState<any>(1.5);
  const dispatch = useAppDispatch();
  const slips = useAppSelector((state) => state.betslip);
  const { user, token } = useAppSelector((state) => state.user);
  const variables = useAppSelector((state) => state.sport);

  const dropRef = useRef<HTMLDivElement>(null);

  const [favourite, { isLoading, isSuccess, isError }] = useFavouriteMutation();

  const { data: favouriteData } = useGetFavouriteQuery({
    favourite: 1,
    userId: user?.id,
  });

  useEffect(() => {
    favouriteData?.fixtures?.forEach((fixture: any) => {
      if (fixture?.homeTeam === data?.homeTeam) {
        setIsFav(true);
      } else if (fixture?.awayTeam === data?.awayTeam) {
        setIsFav(true);
      }
    });
  }, [favouriteData]);

  useEffect(() => {
    // find outcomes for selected market
    if (market && data?.activeMarkets > 0) {
      setOutcomes([]);
      if (data?.outcomes) {
        const odds = data?.outcomes;
        let filtered = odds.filter(
          (item: any) => item.marketID === parseInt(market.marketID)
        );
        if (market?.specifier && market?.specifier !== "") {
          let defaultSpecifier = filtered[0]?.specifier;
          if (defaultSpecifier) {
            filtered = filtered.filter(
              (item: any) => item.specifier === defaultSpecifier
            );
            setActiveSpecifier(defaultSpecifier.split("=")[1]);
          }
        }
        if (filtered.length) {
          setOutcomes(sortArr(filtered, "outcomeID"));
        }
      }
    }
  }, [data, market]);

  useEffect(() => {
    if (specifier !== "") changeSpecifier(specifier);
  }, [specifier]);

  const changeSpecifier = (spec: any) => {
    setIsOpen(false);
    setActiveSpecifier(spec.value);

    if (data?.outcomes) {
      const odds = data.outcomes;
      let filtered = odds.filter(
        (item: any) => item.marketID === parseInt(market.marketID)
      );
      filtered = filtered.filter(
        (item: any) => item.specifier === spec.specifier
      );
      setOutcomes(filtered);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const formattedTime = useTimer(
  //   type === "live" ? data?.eventTime : "--:--",
  //   data?.matchStatus
  // );

  // console.log(data?.eventTime, "fixture");
  // console.log(formattedTime, "daformatedta");

  return (
    <div className={`table_item`}>
      <Container>
        <div className="table_odd_wrap between">
          <div className="table_liveteam_wrap between">
            <Link
              href={`/fixture/${slugify(data?.sportName)}/${slugify(
                data?.tournament
              )}/${slugify(data?.name)}/${data?.matchID}`}
              className="teams"
            >
              <div
                className="team"
                style={{
                  marginBottom: "4px",
                  width: type === "live" ? "145px" : "",
                }}
              >
                {data?.homeTeam?.toUpperCase()}
              </div>
              <div
                className="team"
                style={{ width: type === "live" ? "145px" : "" }}
              >
                {data?.awayTeam?.toUpperCase()}
              </div>
            </Link>
            {type && type === "live" && (
              <div className="table_score">
                <div
                  className="table_score_text"
                  style={{ marginBottom: "4px" }}
                >
                  {data?.homeScore}
                </div>
                <div className="table_score_text">{data?.awayScore}</div>
              </div>
            )}
          </div>
          <div className="odds_wrap">
            <div className="start odds_con_itm">
              {market?.specifier && market?.specifier !== "" && (
                <div
                  className="center selector_wrap"
                  style={{
                    width: `${
                      outcomes?.length < 1
                        ? 100 / market?.outcomes?.length
                        : 100 / (market?.outcomes?.length + 1)
                    }%`,

                    fontSize: market?.specifier !== "" ? "12px" : "",
                  }}
                >
                  <div
                    className="center selected"
                    onClick={() => setIsOpen(true)}
                  >
                    <span>{activeSpecifier}</span>
                    <span>
                      <BiChevronDown />
                    </span>
                  </div>
                  {isOpen && (
                    <div className="selector_items" ref={dropRef}>
                      {specifiers.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className={`selector_item center ${
                            activeSpecifier === item.value && "activ"
                          }`}
                          onClick={() => changeSpecifier(item)}
                        >
                          {item.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {outcomes?.length > 1 ? (
                outcomes?.map((odd: any, idx: number) => {
                  const id = createID(
                    data?.gameID,
                    data?.matchID,
                    odd?.outcomeName,
                    odd?.oddID,
                    odd?.marketID
                  );
                  return (
                    <div
                      key={idx}
                      className={`odds_item center ${
                        isSelected(slips, id) && outcomes?.length - 1 === idx
                          ? "acive_odd_item2"
                          : isSelected(slips, id) &&
                            0 === idx &&
                            market?.specifier !== ""
                          ? "acive_odd_item"
                          : isSelected(slips, id) && 0 === idx
                          ? "acive_odd_item1"
                          : isSelected(slips, id)
                          ? "acive_odd_item"
                          : ""
                      }
                      ${odd.oddsChangeUp ? "oddsIncrease" : ""} ${
                        odd.oddsChangeDown ? "oddsDecrease" : ""
                      }
                      `}
                      style={{
                        border: idx === outcomes?.length - 1 ? "none" : "",
                        width: `${
                          100 /
                          (market?.outcomes?.length +
                            parseInt(market?.specifier !== "" ? "1" : "0"))
                        }%`,
                        fontSize:
                          market?.specifier !== "" || data?.odds?.length > 3
                            ? "12px"
                            : "",
                      }}
                      onClick={() => {
                        isSelected(slips, id)
                          ? dispatch(
                              removeFromCoupon({
                                id,
                                globalVars: variables.SportsbookGlobalVariable,
                              })
                            )
                          : odd?.odds > 1 &&
                            dispatch(
                              addToCoupon({
                                fixture: data,
                                market_name: market.marketName,
                                market_id: market.marketID,
                                id,
                                outcome: odd,
                                type,
                                specifier: odd.specifier,
                                sport: variables.SportsbookGlobalVariable,
                              })
                            );
                      }}
                    >
                      {odd?.odds > 0 && odd?.odds !== 1 && odd?.active === 1 ? (
                        odd?.odds.toFixed(2)
                      ) : (
                        <div className="odds_item_lock">
                          <FaLock />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="start odds_con_itm">
                  {market?.outcomes?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="odds_item center"
                      style={{
                        width: `${100 / market?.outcomes?.length}%`,
                        border:
                          idx === market?.outcomes?.length - 1 ? "none" : "",
                      }}
                    >
                      <div className="odds_item_lock">
                        <FaLock />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="table_item_btm between">
          <div className="table_item_btm_lft center">
            <Star data={data} />

            <div className="table_item_btm_txt_wrap center">
              <div
                className={` ${
                  type === "live" ? "table_item_btm_live" : "table_item_btm_txt"
                }`}
              >
                {type === "live"
                  ? data?.eventTime === "--:--"
                    ? ""
                    : data?.eventTime
                  : dayMonth(data?.eventDate)}
              </div>
              <div
                className={`
                  ${
                    type === "live"
                      ? "table_item_btm_live_status"
                      : "table_item_btm_txt"
                  }
              `}
              >
                {type === "live" ? data?.matchStatus : data?.eventTime}
              </div>
            </div>

            <div className="table_item_btm_icon center">
              <span className="sbe-sb-mb-event-cashout">
                <i className="sbe-app-cash"></i>
              </span>
            </div>
            <div
              className="table_item_btm_icon center"
              onClick={() =>
                window.open(
                  `https://s5.sir.sportradar.com/betradar/en/match/${data?.matchID}`,
                  "stats",
                  "width=1078,height=768"
                )
              }
              style={{ zIndex: 2 }}
            >
              <span className="sbe-sb-mb-event-statistics">
                <a className="sbe-app-statistics" style={{ zIndex: 2 }}></a>
              </span>
            </div>
          </div>
          <Link
            href={`/fixture/${slugify(data?.sportName)}/${slugify(
              data?.tournament
            )}/${slugify(data?.name)}/${data?.matchID}`}
            className="table_item_btm_rgt center"
          >
            <div className="table_item_btm_txt">+</div>
            <div className="table_item_btm_txt">{data?.activeMarkets}</div>
            <div className="table_item_btm_icon center">
              <AiOutlineRight />
            </div>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Fixture;
