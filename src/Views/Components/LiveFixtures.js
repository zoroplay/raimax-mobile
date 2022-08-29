import React, {Fragment, useEffect, useState} from "react";
import {liveScore, slugify} from "../../Utils/helpers";
import {NavLink} from "react-router-dom";
import {getLiveOdds} from "../../Utils/couponHelpers";
import {useSelector} from "react-redux";
import * as _ from "lodash";
import {LiveOdd} from "./LiveOdd";
import {LiveOddAlt} from "./LiveOddAlt";
import {LiveEventsOverview, matchStatus} from "../../Utils/constants";

export default function LiveFixtures({activeSport}) {
    const coupon = useSelector(({couponData}) => couponData.coupon);
    const {SportsbookGlobalVariable, SportsbookBonusList} = useSelector((state) => state.sportsBook);
    const [activeMarket, setActiveMarket] = useState(null);

    useEffect(() => {
        if(activeSport) {
            const sportMarket = LiveEventsOverview.find(sport => sport.id === activeSport.sport_id);
            if(sportMarket) setActiveMarket(sportMarket.markets);
        }
    }, [activeSport]); 

    return (
        <Fragment>
            {activeSport && activeSport?.tournaments?.map(tournament =>
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
                                    {activeMarket?.outcomes?.map(selection => <div className="event-tips__holder-item" key={selection.id}>{selection.name}</div> )}
                                </div>
                            </div>
                            {tournament.Events.map(match => (
                                <div className={`match-content ${activeMarket?.outcomes?.length <= 3 ? 'table-a' : 'match-content-score'}`} key={match.provider_id}>
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
                                                    &nbsp;● {match.live_data?.markets.length}&nbsp;Markets
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
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
}
