import React, {useCallback, useEffect, useState} from "react";
import Layout from './Layout';
import {getFixture, getLiveFixtureData} from "../Services/apis";
import {formatDate, goBack, isSelected, slugify, sortTeams} from "../Utils/helpers";
import * as _ from 'lodash';
import Loader from "./Components/Loader";
import {addToCoupon} from "../Redux/actions";
import {createID} from "../Utils/couponHelpers";
import {useDispatch, useSelector} from "react-redux";

export default function ViewFixture({match, history}) {
    const { eventId } = match.params;
    const [fixtureData, setFixtureData] = useState(null);
    const [fixture, setFixture] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const coupon = useSelector(({couponData}) => couponData.coupon);

    const fetchFixture = () => {
        getLiveFixtureData(eventId).then(res => {
            setLoading(false);
            if (res.Id === 0)
                history.push('/Live/LiveDefault');

            setFixtureData(res);
            setFixture(res.Tournaments[0].Events[0]);
        }).catch(err => {
            setLoading(false)
            // console.log(err);
        })
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchFixture();
    }, []);

    useEffect(() => {

        const interval = setInterval(() => {
            fetchFixture();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const selectOdds = (market, selection) => {
        fixture.TournamentName = fixtureData.Tournaments[0]?.Name;
        fixture.SportName = fixtureData.Name;
        dispatch(addToCoupon(fixture, market.TypeId, market.Name, selection.Odds[0].Value, selection.Id, selection.Name,
            createID(fixture.ProviderId, market.TypeId, selection.Name, selection.Id),'live'))

    }

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
            {fixture &&
                <>
                    <div className="match">
                        <div className="match__container">
                            <div className="match__top">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">...</li>
                                    <li className="breadcrumb-item">{fixtureData.Name}</li>
                                    <li className="breadcrumb-item active ellipsis">{fixtureData.Tournaments[0].Name}</li>
                                </ul>
                            </div>
                            <div className="match__live">
                                <div className="match__live-time">{fixture?.MatchTime}'</div>
                                <div className="match__live-teams">
                                    {sortTeams(fixture?.Teams).map(team =>
                                    <div className="ellipsis" key={team.Id}>{team.Name}</div>
                                    )}
                                </div>
                                <div className="match__live-score">
                                    <div className="match__live-box score">
                                        <div className="">{fixture?.HomeGameScore}</div>
                                        <div className="mt5">{fixture?.AwayGameScore}</div>
                                    </div>
                                </div>
                            </div>
                            {/*<MatchChange fixture={fixture} changeFixture={changeFixture} />*/}
                        </div>
                    </div>
                    <div className="match__markets">
                        {fixture?.Markets.map(market =>
                        <div className="accordion-box open" key={market.Id}>
                            <div className="accordion-toggle collapsible">
                                <i className="icon ml10 info" />
                                <a className="accordion-toggle--item" href="javascript:;"><p>{market.Name}</p></a>
                            </div>
                            <div className="match__market-info"><span>{market?.market?.info}</span>
                            </div>
                            <div className="accordion-content open">
                                <div className="inner-content">
                                    <div className="match-scores new">
                                        {_.chunk(market.Selections, 3).map((row, i) =>
                                        <div className="match-scores__row" key={`row-${i}`}>
                                            {row.map(selection =>
                                            <div className="match-scores__item" key={`odds-${selection.Id}`}>
                                                <div className="table-f">
                                                    <div className="elem">{selection.Name}</div>
                                                    <div
                                                        onClick={() => selectOdds(market, selection)}
                                                        className={`odd ${(isSelected(createID(fixture.ProviderId, market.TypeId, selection.Name, selection.Id), coupon)) ? 'active' : ''}
                                                        ${selection.Odds[0].Status === 0 ? 'locked' : ''}
                                                        `}
                                                    >
                                                        {selection.Odds[0].Value}
                                                    </div>
                                                </div>
                                            </div>)}
                                        </div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </>
            }
            <Loader loading={loading} />
        </Layout>
    )
}
