import React, { useEffect, useState} from "react";
import Layout from './Layout';
import {goBack, slugify, sortTeams} from "../Utils/helpers";
import {useSelector} from "react-redux";
import { getLiveFixtures} from "../Services/apis";
import Loader from "./Components/Loader";
import * as _ from 'lodash';
import {NavLink} from "react-router-dom";
import {LiveOdd} from "./Components/LiveOdd";
import {getLiveOdds} from "../Utils/couponHelpers";
import {LiveOddAlt} from "./Components/LiveOddAlt";
import {matchStatus} from "../Utils/constants";

export default function ViewFixtures({match, history}) {
    const [sports, setSports] = useState([]);
    const [activeSport, setActiveSport] = useState(null);
    const [activeMarket, setActiveMarket] = useState(null);
    const coupon = useSelector(({couponData}) => couponData.coupon);
    const {SportsbookGlobalVariable, SportsbookBonusList} = useSelector((state) => state.sportsBook)

    const getData = () => {
        getLiveFixtures().then(response => {
            let sports = response.Sports;
            if(sports.length > 0){
                sports.forEach((item, key) => {
                    item.foundMarkets = response.SportsMarkets[key].Markets;
                });
                setSports(sports);
                // setActiveSport(sports[0]);
                // setActiveMarket(sports[0].foundMarkets[0]);
            }else{
                setSports(response.Sports);
            }
        })
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
            const sport = sports.find(el => el.Id === activeSport?.Id);
            // console.log(activeSport);
            if (sport) {
                // console.log(activeMarket);
                setActiveSport(sport);
                setActiveMarket(activeMarket);
            } else {
                setActiveSport(sports[0]);
                setActiveMarket(sports[0].foundMarkets[0]);
            }
        }
    }, [sports]);

    // const getOdds = (selection, markets, market_id) => {
    //     let odd = 0;
    //     _.each(markets, function(value, key){
    //         if(value.TypeId === market_id){
    //             _.each(value.Selections, function(item, index){
    //                 if(item.Name === selection.Name){
    //                     // if(item.Odds[0].Status !== 0){
    //                         odd = item.Odds[0].Value;
    //                     // }
    //                 }
    //             });
    //         }
    //     })
    //     return odd;
    // }

    // console.log(activeMarket);

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
                        <li key={sport.Id} className={`s-filter__item ${activeSport?.Name === sport.Name ? 'active' : ''}`}>
                            <a className="s-filter__icon" href="javascript:;" onClick={() => {
                                setActiveSport(sport);
                                setActiveMarket(sport.foundMarkets[0]);
                            }}>
                                <i className={`icon ${slugify(sport.Name)}`} />
                                <span className="s-filter__item-label">{sport.Name}</span>
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
            {activeSport && activeSport?.Tournaments?.map(tournament =>
                <div key={slugify(tournament.Name)} className="accordion-item league live-event open">
                    <div className="accordion-toggle live-event table-f">
                        <div className="accordion-toggle__btn">
                            {tournament.Name}
                        </div>
                    </div>
                    <div className="accordion-content">
                        <div className="accordion-inner">
                            <div className="event-tips">
                                <div className="event-tips__holder">
                                    {activeMarket?.Selections?.map(selection => <div className="event-tips__holder-item" key={selection.TypeId}>{selection.Name}</div> )}
                                </div>
                            </div>
                            {tournament.Events.map(match => (
                                <div className={`match-content ${activeMarket?.Selections?.length <= 3 ? 'table-a' : 'match-content-score'}`} key={match.providerId}>
                                    <NavLink
                                        to={`/liveEventDetail/${slugify(activeSport.Name)}/${slugify(tournament.Name)}/${slugify(match.Name)}/${match.Id}`}
                                        className="match-content__info" id={`match_info_${match.providerId}`}>
                                        {sortTeams(match.Teams).map((team, index) =>
                                            <div className="match-content__row table-f" key={team.Id}>
                                                <div className="match-content__row--team">{_.capitalize(team.Name)}</div>
                                                <div className="match-content__row--result txt-secondary">{index === 0 ? match.HomeGameScore : match.AwayGameScore}</div>
                                            </div>)}
                                        <div className="match-content__row table-f">
                                            <div className="match-content__row--info">
                                                <span>
                                                    <span>
                                                        {matchStatus(match.MatchStatus)}
                                                        {match.MatchTime !== 0 ? `, ${match.MatchTime}'` : ''}
                                                    </span>
                                                    &nbsp;● {match.SelectionCount}&nbsp;Markets
                                                </span>
                                            </div>
                                        </div>
                                    </NavLink>
                                    {activeMarket?.Selections?.length <= 3 ? (
                                        <div className="bets">
                                            <div className="bets__row table-f">
                                                {activeMarket?.Selections?.map(selection => (
                                                    <LiveOdd
                                                        newOdds={getLiveOdds(match.Markets, activeMarket, selection)}
                                                        selection={selection}
                                                        market={activeMarket}
                                                        fixture={match}
                                                        tournament={tournament.Name}
                                                        sport={activeSport.Name}
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
