import React, { useEffect, useState } from "react";
import { groupLiveFixtures, slugify } from "../../Utils/helpers";
import {
  getLiveFixtures,
  upcomingFixtures,
  fetchFixturesByDateRangeSport,
} from "../../Services/apis";
import LiveFixtures from "./LiveFixtures";
import Fixtures from "./Fixtures";
import FixturesSkeleton from "./FixturesSkeleton";
import TipstersList from "./TipstersList";
import useSWR from "swr";
import { NavLink } from "react-router-dom";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { updateLiveData } from "../../Utils/couponHelpers";
import socket from '../../Utils/socket';
import { periods } from "../../Utils/constants";

export default function NavTabMenu({ sportsData, dispatch }) {
  const [selected, setSelected] = useState(0);
  const [changePeriod, setChangePeriod] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSports, setShowSports] = useState(false);
  const [sports, setSports] = useState([]);
  const [activeSport, setActiveSport] = useState(null);
  const [activePeriod, setActivePeriod] = useState({value: 'all', label: 'All'});
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(
    moment().add(14, "days").format("YYYY-MM-DD")
  );
  const [fixtures, setFixtures] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: topbets, error } = useSWR("sports/top-bets");

  useEffect(() => {
    if (selected === 1 && fixtures.length) {
      socket.on("change", (data) => {
        const updateFixtures = updateLiveData(data, fixtures);
        if (updateFixtures) {
          const oldSports = [...sports];
          const data = [];
          let tournaments = groupLiveFixtures(updateFixtures);
          oldSports.forEach((item, key) => {
            item.Tournaments = [];
            tournaments.forEach((tournament) => {
              if (tournament.sport_id === item.sport_id)
                item.tournaments = tournament;
            });
            
          });
          // // console.log(data);
          setSports(data);
        }
      });
      return () => {
        socket.close();
        setFixtures([]);
      };
    }
  }, [socket, selected, fixtures]);

  const setActiveTab = (tab) => {
    setActiveSport(null);
    switch (tab) {
      case 0:
        setShowSports(false);
        setLoading(true);
        getHighlightedFixtures();
        // getUpcomingFixtures();
        break;
      case 1:
        setFixtures([]);
        setShowSports(true);
        setLoading(true);
        getLiveData();
        break;
      case 2:
        setFixtures([]);
        setShowSports(false);
        setLoading(true);
        getUpcomingFixtures();
        break;
      case 3:
        setShowSports(false);
        // getZoomFixtures(852);
        break;
    }
    setSelected(tab);
  };

  const getUpcomingFixtures = () => {
    upcomingFixtures()
      .then((res) => {
        setLoading(false);
        setSports(res);
        setActiveSport(res[0]);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getHighlightedFixtures = (page) => {
    fetchFixturesByDateRangeSport(startDate, endDate, 1, page)
      .then((res) => {
        setLoading(false);
        setSports(res);
        setActiveSport(res[0]);
        setFixtures((fixtures) => [...fixtures, ...res.fixtures.data]);
        setPredictions(res.predictions);
        setCurrentPage(res.fixtures.current_page);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getLiveData = () => {
    getLiveFixtures()
      .then((res) => {
        const data = [];
        if (res.success) {
          let tournaments = groupLiveFixtures(res.data.fixtures);
          res.data.sports.forEach((item, key) => {
            item.Tournaments = [];
            // item.headers = LiveEventsOverview.find(sport => sport.id === item.Id);
            tournaments.forEach((tournament) => {
              if (tournament.sport_id === item.Id)
                item.Tournaments.push(tournament);
            });
            data.push({
              sport_id: item.Id,
              name: item.Name,
              tournaments: item.Tournaments,
            });
          });
          setSports(data);
          setFixtures(res.data.fixtures);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    switch (activePeriod.value) {
      case 'today':
        setStartDate(moment().startOf('day').format('YYYY-MM-DD HH:mm'));
        setEndDate(moment().endOf('day').format('YYYY-MM-DD HH:mm'));
        break;
      case '3hour': 
        setStartDate(moment().format('YYYY-MM-DD HH:mm'));
        setEndDate(moment().add(3, "hours").format("YYYY-MM-DD HH:mm"));
        break;
      case '48hour': 
        setStartDate(moment().format('YYYY-MM-DD HH:mm'));
        setEndDate(moment().add(48, "hours").format("YYYY-MM-DD HH:mm"));
        break;
      case '72hour': 
        setStartDate(moment().format('YYYY-MM-DD HH:mm'));
        setEndDate(moment().add(72, "hours").format("YYYY-MM-DD HH:mm"));
        break;
      default:
        setStartDate(moment().format('YYYY-MM-DD'));
        setEndDate(moment().add(14, "days").format("YYYY-MM-DD"));
        break;
    }
    setFixtures([]);
    setLoading(true);
  }, [activePeriod]);

  useEffect(() => {
    getHighlightedFixtures(1);
  }, [endDate]);

  useEffect(() => {
    if (selected === 1) {
      if (sports.length > 0) {
        const sport = sports.find(
          (el) => el.sport_id === activeSport?.sport_id
        );
        if (sport) {
          setActiveSport(activeSport);
        } else {
          setActiveSport(sports[0]);
        }
      }
    }
  }, [sports]);

  // console.log(sports);

  return (
    <>
      <div className="nav__tabs-holder">
        <div className="nav__tab-menu">
            <div
              className={`nav__tab ${selected === 0 ? "selected" : ""}`}
              onClick={() => {if (selected !== 0) setActiveTab(0)}}
              style={{flexDirection: 'row', justifyContent: 'space-between',position: 'relative'}}
            >
              <span>
                Upcoming ({activePeriod.label})
              </span>
              <span onClick={() => setChangePeriod(!changePeriod)}>
                {changePeriod ? <img src="./img/arrow-up.svg" /> : <img src="./img/arrow-down.svg" />}
              </span>
              {changePeriod && <div className="periods">
                <ul>
                  {periods.map(period => <li onClick={() => { 
                    setActivePeriod(period);
                    setChangePeriod(!changePeriod);
                  }}>{period.label}</li> )}
                </ul>
              </div>}
            </div>
            <div
              className={`nav__tab ${selected === 1 ? "selected" : ""}`}
              onClick={() => setActiveTab(1)}
            >
              Live
            </div>
            <div
              className={`nav__tab ${selected === 2 ? "selected" : ""}`}
              onClick={() => setActiveTab(2)}
            >
              Top League
            </div>
        </div>
        {!loading && showSports && (
          <div className="nav__options">
            {sports?.map((sport, i) => (
              <div
                className={`nav__options-item ${
                  sport?.sport_id === activeSport?.sport_id ? "selected" : ""
                }`}
                key={i}
                onClick={() => setActiveSport(sport)}
              >
                <span className="nav__options-icon mr5">
                  <svg style={{ pointerEvents: "none" }}>
                    <use
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      xlinkHref={`#tabHome-${slugify(sport.name)}`}
                    />
                  </svg>
                </span>
                <span>{sport.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {{
        0: !loading && fixtures.length === 0 ?
        <div style={{padding: '30px'}}>
          <h2
              style={{
                color: "white",
                textAlign: "center",
                fontSize: "2rem",
                paddingBottom: "2rem",
              }}
            >
              No Game found{" "}
            </h2>
          </div> : (
          <InfiniteScroll
            dataLength={fixtures.length} //This is important field to render the next data
            next={() => getHighlightedFixtures(currentPage + 1)}
            hasMore={true}
            loader={<FixturesSkeleton />}
          >
            <Fixtures
              showLeague={true}
              fixtures={fixtures}
              predictions={predictions}
            />
          </InfiniteScroll>
        ),
        1:
          !loading && activeSport?.length === 0 ? (
            <h2
              style={{
                color: "white",
                textAlign: "center",
                background: "#373a45",
                fontSize: "2rem",
                paddingBottom: "2rem",
              }}
            >
              No Game found{" "}
            </h2>
          ) : (
            <LiveFixtures activeSport={activeSport} />
          ),
        2: (
          <div className="accordion-menu">
            {topbets &&
              topbets.map((row) => (
                <div className="accordion-box" key={row.id}>
                  <div className="accordion-toggle">
                    <NavLink
                      to={`/events/soccer/${slugify(row.tournament.name)}/${
                        row.tournament_id
                      }`}
                      className="accordion-toggle--item"
                    >
                      <p>{row.tournament.name}</p>
                    </NavLink>
                  </div>
                </div>
              ))}
          </div>
        ),
        /*3: (<>
                        <div className="headline__bar">
                            <div>
                                <i className="icon zoom"/>
                                <div className="headline__bar-title d-ib ml5">ZOOM SOCCER</div>
                            </div>
                            <div>
                                <div className="league-stats zoom false"/>
                            </div>
                        </div>
                        <ZoomLeagueMenu setLeague={getZoomFixtures} />
                        <Fixtures
                            fixtures={zoomFixtures}
                            predictions={predictions}
                            showLeague={false}
                        />
                    </>)*/
        3: (
          <>
            <div className="headline__bar">
              <div>
                <i className="icon tipster" />
                <div className="headline__bar-title d-ib ml5">
                  Tipster Tickets
                </div>
              </div>
              <div>
                <div className="league-stats tipster false">
                  <ion-icon name="help-circle-outline" />
                </div>
              </div>
            </div>
            <div className="sr-livetable__tableBorder">
              <div className="sr-livetable__forms">
                <div className="sr-livetable__tableCellForm srt-played">
                  <span>P</span>
                </div>
                <div className="sr-livetable__formsTitle">
                  <span>Played</span>
                </div>
                <div className="sr-livetable__tableCellForm srt-win">
                  <span>W</span>
                </div>
                <div className="sr-livetable__formsTitle">
                  <span>win</span>
                </div>
                <div className="sr-livetable__tableCellForm srt-lose">
                  <span>L</span>
                </div>
                <div className="sr-livetable__formsTitle">
                  <span>loss</span>
                </div>
                <div className="sr-livetable__tableCellForm srt-draw">
                  <span>OT</span>
                </div>
                <div className="sr-livetable__formsTitle">
                  <span>Open Tickets</span>
                </div>
              </div>
            </div>
            <TipstersList />
          </>
        ),
      }[selected] ||
        (!loading ? (
          <Fixtures
            fixtures={activeSport?.fixtures}
            predictions={activeSport?.predictions}
            showLeague={true}
          />
        ) : (
          <FixturesSkeleton />
        ))}
    </>
  );
}
