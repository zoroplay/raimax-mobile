import React, {useEffect, useState, useCallback} from 'react';
import {setSport} from "../Redux/actions";
import {useDispatch, useSelector} from "react-redux";
import * as _ from 'lodash';
import {slugify, unSlugify} from "../Utils/helpers";
import Layout from "./Layout";
import {getFixtures, getMarkets} from "../Services/apis";
import Markets from "./Components/Markets";
import Fixtures from "./Components/Fixtures";
import LeagueChange from "./Components/LeagueChange";
import FixturesSkeleton from "./Components/FixturesSkeleton";

const ViewFixtures = ({history, match}) => {
    const {tid, sport: sportname} = match.params;
    const {sport, sports} = useSelector((state) => state.sportsData);
    const [tournament, setTournament] = useState(null);
    const [fixtures, setFixtures] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [activeMarket, setActiveMarket] = useState({});
    const [predictions, setPredictions] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStat, setShowStat] = useState(null);

    const dispatch = useDispatch();

    const fetchFixtures = useCallback((sport) => {
        getFixtures(tid, sport.sport_id).then((res) => {
            setLoading(false);
            setTournament(res);
            setPredictions(res.predictions);
            setMarkets(res.markets);
            setGroups(res.groups);
            setActiveMarket(res.selected_market);
            setFixtures(res.fixtures);
        }).catch(err => {
            setLoading(false);
        });
    }, [tid]);

    useEffect(() => {
        if(showStat) {
            const statWrapper = document.getElementById(`sr-widget-1`);

            if(statWrapper.innerHTML === '') {
                statWrapper.innerHTML = '';
                statWrapper.style.color = '#000';
                statWrapper.style.backgroundColor = '#fff';

                window.SIR("addWidget", `#sr-widget-1`, "season.liveTable", {matchId:fixtures[0].provider_id});

            } else {
                statWrapper.innerHTML = '';
            }
        }
    }, [showStat]);

    useEffect(() => {
        setLoading(true);
        if(!sport?.sport_id) {
            const selected = _.find(sports, {'name': unSlugify(sportname)});
            if (selected) {
                dispatch(setSport(selected));
                // fetch fixtures
                fetchFixtures(selected);
            }
        } else {
            // fetch fixtures
            fetchFixtures(sport);
        }
        return () => {
            setLoading(false);
            setTournament(null);
            setPredictions([]);
            setMarkets([]);
            setGroups([]);
            setActiveMarket([]);
            setFixtures([]);
        }
    }, [sport, tid, sports]);

    const changeTournament = (sport, category, tournament) => {
        console.log(tournament);
        setLoading(true);
        setTournament(null);
        history.replace(`/events/${slugify(sport)}/${slugify(tournament.name)}/${slugify(tournament.sport_tournament_id)}`);
    }

    const changeMarket = (market) => {
        setLoading(true);
        market.market_group_id = market.group_id;
        setActiveMarket(market);
        getMarkets(tournament.sport_tournament_id, tournament.sport_id, market.id).then((res) => {
            setLoading(false);
            setPredictions(res.predictions);
            setFixtures(res.fixtures);
        }).catch(err => {
            setLoading(false);
        });
    }

    return (
        <Layout>
            <div className="competition-info__container">
                <div className="competition-info">
                    <div className="competition-breadcrumbs">
                        <div>
                            <div>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">...</li>
                                    <li className="breadcrumb-item">{tournament?.sport_name}</li>
                                    <li className="breadcrumb-item">{tournament?.sport_category_name}</li>
                                    <li className="breadcrumb-item active ellipsis">{tournament?.sport_tournament_name}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="competition-options">
                        <div className="competition-item" onClick={() => setShowStat(!showStat)}>
                            <i className={`icon ${showStat ? 'close' : 'stats'}`} />
                            <div className="competition-options__title mt5" >Stats</div>
                        </div>
                    </div>
                </div>
                <LeagueChange tournament={tournament} sports={sports} sport={sport} setLeague={changeTournament} />
            </div>
            {showStat &&
            <>
                <div className="event-stats open">
                    <div className="event-stats__selector table-f p10">
                        <div className={`event-stats__selector-item txt-c selected`}>
                            League Table
                        </div>
                    </div>
                    <div className="widgets">
                        <div>
                            <div id={`sr-widget-1`}/>
                        </div>
                    </div>
                </div>
                <div className="stats-toggle" onClick={() => setShowStat(false)}><i className="icon arrow"/></div>
            </>
            }
            <Markets groups={groups} markets={markets} activeMarket={activeMarket} setActiveMarket={changeMarket} />
            {!loading && <Fixtures showLeague={false} fixtures={fixtures} predictions={predictions} />}
            {loading && <FixturesSkeleton />}
        </Layout>
    );
};

export default ViewFixtures;
