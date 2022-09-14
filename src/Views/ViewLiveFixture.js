import React, {useCallback, useEffect, useState} from "react";
import Layout from './Layout';
import {getFixture, getLiveFixtureData} from "../Services/apis";
import {formatDate, formatOdd, goBack, isSelected, liveScore, slugify, sortTeams} from "../Utils/helpers";
import * as _ from 'lodash';
import Loader from "./Components/Loader";
import {addToCoupon} from "../Redux/actions";
import {createID} from "../Utils/couponHelpers";
import {useDispatch, useSelector} from "react-redux";

export default function ViewFixture({match, history}) {
    const { eventId } = match.params;
    const [liveData, setLiveData] = useState(null);
    const [fixture, setFixture] = useState(null);
    const [markets, setMarkets] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const coupon = useSelector(({couponData}) => couponData.coupon);

    const fetchFixture = () => {
        getLiveFixtureData(eventId).then(res => {
            setLoading(false);
            if (res.success && (res.data.match_status === 'ended' || res.data.match_status === 'interrupted'))
                history.push('/Live/LiveDefault');

                setFixture(res.data);
                setLiveData(JSON.parse(res.data.live_data));
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

    useEffect(() => {
        if(markets){
            let newMarkets = liveData.markets;

            newMarkets.forEach((item, key) => {
                // if(item.Status !== 0){
                    item.odds.forEach((selection, s) => {
                        if (markets[key]) {
                            let oldOdd = (markets[key].odds[s]) ? parseFloat(markets[key].odds[s].odds) : 0;
                            let oldOddChange = (markets[key].odds[s]) ? markets[key].odds[s].OddChanged : '';
                            let newOdd = parseFloat(selection.odds);

                            if (newOdd > oldOdd) {
                                selection.OddChanged = 'Increased';
                                selection.Animate = true;
                            } else if (newOdd < oldOdd) {
                                selection.OddChanged = 'Decreased'
                                selection.Animate = true;
                            } else if (newOdd === 0) {
                                selection.OddChanged = '';
                            } else {
                                selection.OddChanged = oldOddChange;
                            }
                        }
                    });
                // }
                // console.log(item);
            });

            setMarkets(newMarkets.sort((market1, market2) => market1.id - market2.id));
        } else {
            setMarkets(liveData?.markets);
        }
    }, [fixture]);


    const selectOdds = (market, selection) => {
        dispatch(addToCoupon(fixture, market.id, market.name, selection.odds, selection.id, selection.name,
                createID(fixture.provider_id, market.id, selection.name, selection.id),'live'))
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
                                    <li className="breadcrumb-item">{fixture?.sport_category_name}</li>
                                    <li className="breadcrumb-item active ellipsis">{fixture?.sport_tournament_name}</li>
                                </ul>
                            </div>
                            <div className="match__live">
                                <div className="match__live-time">{liveData?.match_time}'</div>
                                <div className="match__live-teams">
                                    
                                    <div className="ellipsis">{fixture?.team_a}</div>
                                    <div className="ellipsis">{fixture?.team_b}</div>
                                    
                                </div>
                                <div className="match__live-score">
                                    <div className="match__live-box score">
                                        <div className="">{ liveScore(fixture?.score, 'home')}</div>
                                        <div className="mt5">{ liveScore(fixture?.score, 'away')}</div>
                                    </div>
                                </div>
                            </div>
                            {/*<MatchChange fixture={fixture} changeFixture={changeFixture} />*/}
                        </div>
                    </div>
                    <div className="match__markets">
                        {markets?.map(market =>
                        market.active === '1' &&
                        <div className="accordion-box open" key={market.market_id}>
                            <div className="accordion-toggle collapsible">
                                <i className="icon ml10 info" />
                                <a className="accordion-toggle--item" href="javascript:;"><p>{market.name} {market.specialOddsValue && market.specialOddsValue !== '-1' ? market.specialOddsValue : ''}</p></a>
                            </div>
                            <div className="match__market-info"><span>{market?.market?.info}</span>
                            </div>
                            <div className="accordion-content open">
                                <div className="inner-content">
                                    <div className="match-scores new">
                                        {_.chunk(market.odds, 3).map((row, i) =>
                                        <div className="match-scores__row" key={`row-${i}`}>
                                            {row.map(selection =>
                                            <div className="match-scores__item" key={`odds-${selection.id}`}>
                                                <div className="table-f">
                                                    <div className="elem">{selection.type}</div>
                                                    <div
                                                        onClick={() => selectOdds(market, selection)}
                                                        className={`odd ${(isSelected(createID(fixture.provider_id, market.id, selection.name, selection.id), coupon)) ? 'active' : ''}
                                                        ${selection.odds.active === '0' ? 'locked' : ''}
                                                        `}
                                                    >
                                                        {formatOdd(parseFloat(selection.odds))}
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
