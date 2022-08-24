import React, {useEffect, useState} from "react";
import {groupLiveFixtures, slugify} from "../../Utils/helpers";
import {fetchHighlights, getFixtures, getLiveFixtures, upcomingFixtures} from "../../Services/apis";
import LiveFixtures from "./LiveFixtures";
import ZoomLeagueMenu from "./ZoomLeagueMenu";
import Fixtures from "./Fixtures";
import FixturesSkeleton from "./FixturesSkeleton";
import TipstersList from "./TipstersList";
import useSWR from "swr";
import {NavLink} from "react-router-dom";
const tabs = ['Highlights', 'Live', 'Top Leagues', 'Tipsters'];


export default function NavTabMenu({sportsData, dispatch}) {
    const [selected, setSelected] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSports, setShowSports] = useState(true);
    const [sports, setSports] = useState([]);
    const [activeSport, setActiveSport] = useState(null);
    // const [zoomFixtures, setZoomFixtures] = useState([]);
    // const [predictions, setZoomPredictions] = useState([]);

    const {data: topbets, error} = useSWR('sports/top-bets');

    const setActiveTab = (tab) => {
        setActiveSport(null);
        switch (tab) {
            case 0:
                setShowSports(true);
                setLoading(true);
                getHighlightedFixtures()
                // getUpcomingFixtures();
                break;
            case 1:
                setShowSports(true);
                setLoading(true);
                getLiveData();
                break;
            case 2:
                // setShowSports(false);
                // setLoading(true);
                // getUpcomingFixtures();
                break;
            case 3:
                setShowSports(false);
                // getZoomFixtures(852)
                break;
        }
        setSelected(tab);
    }

    const getUpcomingFixtures = () => {
        upcomingFixtures().then(res => {
            setLoading(false);
            setSports(res);
            setActiveSport(res[0]);
        }).catch(err => {
            setLoading(false);
        })
    };

    const getHighlightedFixtures = () => {
        fetchHighlights().then(res => {
            setLoading(false);
            setSports(res);
            setActiveSport(res[0]);
        }).catch(err => {
            setLoading(false);
        })
    };

    // const getZoomFixtures = (league) => {
    //     getFixtures(league, 30).then(res => {
    //         setZoomPredictions(res.predictions);
    //         setZoomFixtures(res.fixtures);
    //     }).catch(err => {
    //         console.log(err);
    //     });
    // }

    const getLiveData = () => {
        getLiveFixtures().then((res) => {
            setLoading(false);
            const data = [];
            if(res.success){
                let tournaments = groupLiveFixtures(res.data.fixtures);
                res.data.sports.forEach((item, key) => {
                    item.Tournaments = []
                    // item.headers = LiveEventsOverview.find(sport => sport.id === item.Id);
                    tournaments.forEach(tournament => {
                        if(tournament.sport_id === item.Id) item.Tournaments.push(tournament);
                    })
                    data.push({
                        sport_id: item.Id,
                        name: item.Name,
                        tournaments: item.Tournaments,
                    });
                });
                
            }
            console.log(data);
            setSports(data);
        }).catch(err => {
            console.log(err)
            setLoading(false);
        });
    }

    useEffect(() => {
        getHighlightedFixtures();
    }, []);

    useEffect(() => {
        if (selected === 1) {
            const interval = setInterval(() => {
                getLiveData();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [selected]);

    useEffect(() => {
        if (selected === 1) {
            if (sports.length > 0) {
                const sport = sports.find(el => el.sport_id === activeSport?.sport_id);
                if (sport) {
                    setActiveSport(activeSport);
                } else {
                    setActiveSport(sports[0]);
                }
            }
        }
    }, [sports]);

    return (
        <>
            <div className="nav__tabs-holder">
                <div className="nav__tab-menu">
                    {tabs.map((tab, i) => <div
                        key={i}
                        className={`nav__tab ${(selected === i) ? 'selected': ''}`}
                        onClick={() => setActiveTab(i)}>{tab}</div>
                    )}
                </div>
                {!loading && showSports &&
                <div className="nav__options">
                    {sports.map((sport, i) => (
                    <div
                        className={`nav__options-item ${(sport.sport_id === activeSport?.sport_id) ? 'selected' : ''}`}
                        key={i}
                        onClick={() => setActiveSport(sport)}
                    >
                        <span className="nav__options-icon mr5">
                            <svg style={{ pointerEvents: 'none' }}>
                                <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`#tabHome-${slugify(sport.name)}`}/>
                            </svg>
                        </span>
                        <span>{sport.name}</span>
                    </div>))}
                </div>}
            </div>
            {
                {
                    1: (!loading && <LiveFixtures activeSport={activeSport} />),
                    2: <div className="accordion-menu">
                        {topbets && topbets.map(row =>
                        <div className="accordion-box" key={row.id}>
                            <div className="accordion-toggle">
                                <NavLink to={`/events/soccer/${slugify(row.tournament.name)}/${row.tournament_id}`} className="accordion-toggle--item">
                                    <p>{row.tournament.name}</p>
                                </NavLink>
                            </div>
                        </div>)}
                    </div>,
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
                    3: (<>
                        <div className="headline__bar">
                            <div>
                                <i className="icon tipster"/>
                                <div className="headline__bar-title d-ib ml5">Tipster Tickets</div>
                            </div>
                            <div>
                                <div className="league-stats tipster false">
                                    <ion-icon name="help-circle-outline" />
                                </div>
                            </div>
                        </div>
                        <div className="sr-livetable__tableBorder">
                            <div className="sr-livetable__forms">
                                <div className="sr-livetable__tableCellForm srt-played"><span>P</span></div>
                                <div className="sr-livetable__formsTitle"><span>Played</span></div>
                                <div className="sr-livetable__tableCellForm srt-win"><span>W</span></div>
                                <div className="sr-livetable__formsTitle"><span>win</span></div>
                                <div className="sr-livetable__tableCellForm srt-lose"><span>L</span></div>
                                <div className="sr-livetable__formsTitle"><span>loss</span></div>
                                <div className="sr-livetable__tableCellForm srt-draw"><span>OT</span></div>
                                <div className="sr-livetable__formsTitle"><span>Open Tickets</span></div>
                            </div>
                        </div>
                        <TipstersList />
                    </>)
                }[selected] || (
                    !loading ? <Fixtures
                        fixtures={activeSport?.fixtures}
                        predictions={activeSport?.predictions}
                        showLeague={true}
                    /> : <FixturesSkeleton />
                )
            }
        </>
    )
}
