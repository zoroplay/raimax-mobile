"use client";
import React, { Fragment, useEffect, useState } from "react";
import "./Matches.scss";
import { Fixtures, Empty } from "@/_components";
import { useParams } from "next/navigation";
import {
  useGetFixturesByTournamentQuery,
  useGetLiveFixturesQuery,
} from "@/_services/sport.service";
import { Oval } from "react-loader-spinner";
import { CgSearchLoading } from "react-icons/cg";
import { useAppSelector, useSticky } from "@/_hooks";
import { slugify } from "@/_utils";

interface MatchesProps {
  type: string;
}
const Matches = ({ type }: MatchesProps) => {
  const route = useParams();

  const sid = route.slug[2];
  const tid = route.slug[3];

  const { data: res, isLoading: loading } = useGetFixturesByTournamentQuery(
    {
      tid,
      sid,
    },
    {
      skip: type === "live",
    }
  );

  const { sports } = useAppSelector((state) => state.sport);

  let activeSport = sports?.find(
    (item: any) => slugify(item?.sportName) === route.slug[0]
  );

  const { data: resLive, isLoading: loadingLive } = useGetLiveFixturesQuery(
    {
      sid: activeSport?.sportID,
    },
    {
      skip: type === "prematch",
    }
  );

  const data = res || resLive;
  const isLoading = loading || loadingLive;
  const [activeMarket, setActiveMarket] = useState<any>(null);

  const isSticky = useSticky(190);

  useEffect(() => {
    if (data && data?.markets?.length) setActiveMarket(data.markets[0]);
  }, [data]);

  return (
    <div className="live">
      {isLoading ? (
        <div className="p_20 center">
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
      ) : data?.fixtures?.length < 1 ? (
        <div className="p_20">
          <Empty title="No Fixtures" icon={<CgSearchLoading />} />
        </div>
      ) : (
        <Fragment>
          {activeMarket && (
            <div
              className={`odds between ${
                isSticky && type !== "live" && "stick_match"
              }`}
            >
              {data.markets?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={`odds_item ${
                    activeMarket.marketID === item?.marketID && "active"
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
          )}
          <Fixtures
            fixtureData={data?.fixtures}
            market={activeMarket}
            type={type}
          />
        </Fragment>
      )}
    </div>
  );
};

export default Matches;
