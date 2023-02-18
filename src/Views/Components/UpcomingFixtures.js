import React, {useEffect} from "react";
import Fixtures from "./Fixtures";
import useSWR from "swr/esm/use-swr";
import {useSelector} from "react-redux";

export default function UpcomingFixtures() {
  const sportsData = useSelector((state) => state.sportsData);

  const {data: res} = useSWR(`/sports/mobile/upcoming`);

  useEffect(() => {

  }, [res])

  return (
      <Fixtures
        fixtures={sportsData?.sport?.fixtures}
        predictions={sportsData?.sport?.predictions}
      />
    );
}
