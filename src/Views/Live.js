import React, { useEffect, useState} from "react";
import Layout from './Layout';
import {goBack, groupLiveFixtures, liveScore, slugify, sortTeams} from "../Utils/helpers";
import {useSelector} from "react-redux";
import { getLiveFixtures} from "../Services/apis";
import Loader from "./Components/Loader";
import * as _ from 'lodash';
import {NavLink} from "react-router-dom";
import {LiveOdd} from "./Components/LiveOdd";
import {getLiveOdds} from "../Utils/couponHelpers";
import {LiveOddAlt} from "./Components/LiveOddAlt";
import {LiveEventsOverview, matchStatus} from "../Utils/constants";

export default function ViewFixtures({match, history}) {
    const [sports, setSports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSport, setActiveSport] = useState(null);
    const [activeMarket, setActiveMarket] = useState(null);
    const coupon = useSelector(({couponData}) => couponData.coupon);
    const {SportsbookGlobalVariable, SportsbookBonusList} = useSelector((state) => state.sportsBook)

    const getData = () => {
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
            setSports(data);
        }).catch(err => {
            // console.log(err)
            setLoading(false);
        });
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            getData();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (sports.length > 0) {
            const sport = sports.find(el => el.sport_id === activeSport?.sport_id);
            // console.log(activeSport);
            if (sport) {
                // console.log(activeMarket);
                setActiveSport(sport);
                const sportMarket = LiveEventsOverview.find(item => item.id === sport.sport_id);
                if(sportMarket) setActiveMarket(sportMarket.markets);
            } else {
                setActiveSport(sports[0]);
                const sportMarket = LiveEventsOverview.find(item => item.id === sports[0].sport_id);
                if(sportMarket) setActiveMarket(sportMarket.markets);
            }
        }
    }, [sports]);

    return (
        <Layout
            headerLeft={
                <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                    <i className="icon-back" />
                    <span className="d-ib ml5">Back</span>
                </div>
            }
            headerCenter={<div className="txt-c">LIVE</div>}
        >
            <div className="s-filter">
                <ul className="s-filter__holder">
                    {sports && sports.map(sport =>
                        <li key={sport.sport_id} className={`s-filter__item ${activeSport?.name === sport.name ? 'active' : ''}`}>
                            <a className="s-filter__icon" href="javascript:;" onClick={() => {
                                setActiveSport(sport);
                                setActiveMarket(sport.foundMarkets[0]);
                            }}>
                                <i className={`icon ${slugify(sport.name)}`} />
                                <span className="s-filter__item-label">{sport.name}</span>
                            </a>
                        </li>)}
                </ul>
            </div>
            <div className="filter">
                {activeSport && activeSport?.foundMarkets?.map(market =>
                    <div
                        key={slugify(market.Name)}
                        className={`filter--btn ${activeMarket?.Name === market.Name ? 'active' : ''}`}
                        onClick={() => setActiveMarket(market)}
                    >
                        <p>{market.Name}</p>
                    </div>
                )}
            </div>
            {activeSport && activeSport?.tournaments?.map((tournament, t) =>
                <div key={`tourn-${t}-${slugify(tournament.Name)}`} className="accordion-item league live-event open">
                    <div className="accordion-toggle live-event table-f">
                        <div className="accordion-toggle__btn">
                            {tournament.Name}
                        </div>
                    </div>
                    <div className="accordion-content">
                        <div className="accordion-inner">
                            <div className="event-tips">
                                <div className="event-tips__holder">
                                    {activeMarket?.outcomes?.map(selection => <div className="event-tips__holder-item" key={selection.id}>{selection.name}</div> )}
                                </div>
                            </div>
                            {tournament.Events.map((match, i) => (
                                <div className={`match-content ${activeMarket?.outcomes?.length <= 3 ? 'table-a' : 'match-content-score'}`} key={`fixture-${i}-${match.provider_id}`}>
                                    <NavLink
                                        to={`/liveEventDetail/${slugify(activeSport.name)}/${slugify(tournament.Name)}/${slugify(match.event_name)}/${match.provider_id}`}
                                        className="match-content__info" id={`match_info_${match.provider_id}`}>
                                        <div className="match-content__row table-f">
                                            <div className="match-content__row--team">{match.team_a}</div>
                                            <div className="match-content__row--result txt-secondary">
                                                {liveScore(match.score, 'home')}
                                            </div>
                                        </div>
                                        <div className="match-content__row table-f">
                                            <div className="match-content__row--team">{match.team_b}</div>
                                            <div className="match-content__row--result txt-secondary">
                                                {liveScore(match.score, 'away')}
                                            </div>
                                        </div>
                                        <div className="match-content__row table-f">
                                            <div className="match-content__row--info">
                                                <span>
                                                    <span>
                                                        {matchStatus(match.match_status)}
                                                        {match.live_data?.match_time ? `, ${match.live_data?.match_time}'` : ''}
                                                    </span>
                                                    &nbsp;● {match.live_data?.markets?.length}&nbsp;Markets
                                                </span>
                                            </div>
                                        </div>
                                    </NavLink>
                                    {activeMarket?.outcomes?.length <= 3 ? (
                                        <div className="bets">
                                            <div className="bets__row table-f">
                                                {activeMarket?.outcomes?.map(selection => (
                                                    <LiveOdd
                                                        key={`${slugify(selection.name)}-odd`}
                                                        newOdds={getLiveOdds(match.live_data?.markets, activeMarket, selection)}
                                                        selection={selection}
                                                        market={activeMarket}
                                                        fixture={match}
                                                        tournament={tournament.Name}
                                                        sport={activeSport.name}
                                                        coupon={coupon}
                                                        globalVars={SportsbookGlobalVariable}
                                                        bonusList={SportsbookBonusList}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ):(
                                        <div className="match-scores new">
                                            {_.chunk(activeMarket?.Selections, 3)?.map((row, i) =>
                                                <div className="match-scores__row" key={`row-${i}`}>
                                                    {row.map(selection => <LiveOddAlt
                                                        newOdds={getLiveOdds(match.Markets, activeMarket, selection)}
                                                        selection={selection}
                                                        market={activeMarket}
                                                        fixture={match}
                                                        tournament={tournament.Name}
                                                        sport={activeSport.Name}
                                                        coupon={coupon}
                                                        globalVars={SportsbookGlobalVariable}
                                                        bonusList={SportsbookBonusList}
                                                    />)}
                                                </div>)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/*<Loader loading={loading} />*/}
        </Layout>
    );
}
