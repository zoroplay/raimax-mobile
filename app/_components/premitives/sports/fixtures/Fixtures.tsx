"use client";

import "./Fixtures.scss";
import { Fixture, Prediction } from "@/_components";
import { groupFixturesName, groupFixturesTime } from "@/_utils";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { sortArr } from "@/_utils/helpers";
import type { MqttClient } from "mqtt";
import useMqtt from "@/_hooks/use-mqtt";

interface FixturesProps {
  market: any;
  fixtureData: any;
  type?: string;
}

const Fixtures = ({ market, fixtureData, type }: FixturesProps) => {
  const route = useParams();
  const fixtureGroupMethod =
    route.slug || window.location.pathname === "/search"
      ? groupFixturesTime
      : groupFixturesName;
  const [specifiers, setSpecifiers] = useState([]);
  const [specifier, setSpecifier] = useState("");
  const [marketOutcomes, setMarketOutcomes] = useState([]);
  const [oddsChange, setOddsChange] = useState<any>(null);
  const [fixtures, setFixtures] = useState<{ [key in string]: string }[]>([]);

  const mqttClientRef = useRef<MqttClient | null>(null);

  const setMqttClient = (client: MqttClient) => {
    mqttClientRef.current = client;
  };

  const incommingMessageHandlers = useRef([
    {
      topic: "feeds/live/odds_change/+",
      handler: (msg: any) => {
        setOddsChange(msg.payload);
      },
    },
    {
      topic: "feeds/live/bet_stop/+",
      handler: (msg: any) => {
        // console.log('bet stop', msg);
        handleBetstop(msg.payload);
      },
    },
    {
      topic: "feeds/live/fixture_status/+",
      handler: (msg: any) => {
        console.log("fixture change", msg);
      },
    },
  ]);

  type === "live" &&
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMqtt({
      uri: process.env.NEXT_PUBLIC_MQTT_URI || "",
      options: {
        username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
        password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
        keepalive: 3000,
        connectTimeout: 4000,
        clientId: process.env.NEXT_PUBLIC_MQTT_CLIENTID,
      },
      topicHandlers: incommingMessageHandlers.current,
      onConnectedHandler: (client) => setMqttClient(client),
      type,
    });

  useEffect(() => {
    if (market && market.specifier && market.specifier !== "") {
      const result: any = [];

      fixtureData.forEach((fixture: any) => {
        const outcomes = fixture.outcomes;
        if (outcomes?.length > 0) {
          const filtered = outcomes.filter(
            (item: any) => item.marketID === parseInt(market.marketID)
          );

          filtered.forEach((outcome: any) => {
            let specifier = outcome.specifier;
            let found = result.find(
              (item: any) => item.specifier === specifier
            );
            if (!found)
              // check if specifier has been listed
              result.push({ specifier, value: specifier.split("=")[1] }); //push value to array
          });
        }
      });
      // update specifiers state
      setSpecifiers(result.sort((a: any, b: any) => a.value - b.value));
    }
    setFixtures(fixtureData);
    setMarketOutcomes(sortArr(market?.outcomes, "outcomeID"));
  }, [market, fixtureData]);

  useEffect(() => {
    if (fixtureData?.length) updateMarkets(oddsChange);
  }, [oddsChange]);

  const updateMarkets = (data: any) => {
    // console.log('odds change', data);
    // find fixture
    const fixtureIndex = fixtures.findIndex(
      (item: any) => item.matchID == data.match_id
    );
    if (fixtureIndex !== -1) {
      const markets = data.markets;

      const fixture: any = { ...fixtures[fixtureIndex] };
      // console.log('updating fixture ', fixture.name);
      fixture.homeScore = data.sport_event_status.home_score;
      fixture.awayScore = data.sport_event_status.away_score;
      const outcomes: any = [...fixture.outcomes];

      if (markets) {
        // if odds change is available
        for (const market of markets) {
          if (market.outcomes) {
            for (const outcome of market.outcomes) {
              let oIndex = outcomes.findIndex(
                (item: any) =>
                  item.outcomeID === outcome.id &&
                  item.marketID == market.id &&
                  item.specifier === market.specifiers
              );

              if (oIndex !== -1) {
                const dupOutcome = { ...outcomes[oIndex] };
                if (outcome.odds > dupOutcome.odds) {
                  dupOutcome.oddsChangeUp = true;
                  dupOutcome.oddsChangeDown = false;
                } else if (outcome.odds < dupOutcome.odds) {
                  dupOutcome.oddsChangeUp = false;
                  dupOutcome.oddsChangeDown = true;
                } else {
                  dupOutcome.oddsChangeUp = false;
                  dupOutcome.oddsChangeDown = false;
                }
                dupOutcome.oldOdds = dupOutcome.odds;
                dupOutcome.odds = outcome.odds;
                dupOutcome.active = outcome.active ? 1 : 0;
                dupOutcome.status = market.status;
                outcomes[oIndex] = dupOutcome;
              }
            }
          }
        }
        let activeMarkets = markets.filter(
          (market: any) => market.status === 0
        );
        fixture.activeMarkets = activeMarkets.length;
      } else {
        // lock all current markets
        handleBetstop(data);
      }
      fixture.outcomes = outcomes;
      const copFixtures = [...fixtures];
      copFixtures[fixtureIndex] = fixture;
      setFixtures(copFixtures);
    }
  };

  const handleBetstop = (data: any) => {
    const fixtureIndex = fixtures.findIndex(
      (item: any) => item.matchID == data.match_id
    );
    if (fixtureIndex !== -1) {
      const fixture: any = { ...fixtures[fixtureIndex] };
      const outcomes: any = [...fixture.outcomes];
      outcomes.forEach((item: any) => {
        const outcome = { ...item };
        outcome.active = 0;
      });

      fixture.outcomes = outcomes;
      const copFixtures = [...fixtures];
      copFixtures[fixtureIndex] = fixture;
      setFixtures(copFixtures);
    }
  };
  // console.log(fixtureData, "ckeLive");
  return (
    <div className="fixtures">
      {fixtureGroupMethod(fixtures)?.map((item: any, idx: number) => (
        <div key={idx}>
          <Prediction
            outcomes={marketOutcomes}
            marketSpecifier={market?.specifier}
            activeSpecifier={specifier}
            specifiers={specifiers}
            changeSpecifier={(speci: any) => setSpecifier(speci)}
            tournamentName={item?.tournament || item?.event_date}
          />
          {item?.events?.map((item: any, idx: number) => (
            <div key={idx}>
              <Fixture
                data={item}
                market={market}
                specifiers={specifiers}
                specifier={specifier}
                type={type}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Fixtures;
