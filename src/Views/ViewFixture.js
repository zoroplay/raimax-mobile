import React, {useCallback, useEffect, useState} from "react";
import Layout from './Layout';
import {getFixture} from "../Services/apis";
import {formatDate, goBack, isSelected, slugify} from "../Utils/helpers";
import * as _ from 'lodash';
import MatchChange from "./Components/MatchChange";
import Loader from "./Components/Loader";
import {addToCoupon} from "../Redux/actions";
import {createID} from "../Utils/couponHelpers";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";

export default function ViewFixture({match, history}) {
    const { eventId } = match.params;
    const [fixture, setFixture] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const coupon = useSelector(({couponData}) => couponData.coupon);

    const fetchFixture = useCallback(() => {
        getFixture(eventId).then(res => {
            if (res.success === false) {
                toast.error(res.message);
                history.push('/')
            }
            setLoading(false)
            setFixture(res);
        }).catch(err => {
            setLoading(false)
            console.log(err);
        })
    }, [eventId]);

    useEffect(() => {
        fetchFixture();

    }, [fetchFixture]);

    const changeFixture = match => {
        setLoading(true);
        setFixture(null);
        history.push(`/eventdetail/${slugify(fixture.sport_name)}/${slugify(fixture.sport_category_name)}/${slugify(fixture.sport_tournament_name)}/${slugify(match.event_name)}/${match.provider_id}`);
    }

    const goTo = () => {
        history.push(`/events/${slugify(fixture.sport_name)}/${slugify(fixture.sport_category_name)}/${fixture.sport_tournament_id}`)
    }

    const getStats = (e) => {
        const statWrapper = document.getElementById(`SingleInsideStats_${fixture.provider_id}`);
        const icon = document.getElementById('stats-icon');

        if(icon.classList.contains('stats')) {
            icon.classList.remove('stats');
            icon.classList.add('close');
        } else {
            icon.classList.remove('close');
            icon.classList.add('stats');
        }
        if(statWrapper.innerHTML === '') {
            statWrapper.innerHTML = 'Loading...';
            statWrapper.style.color = '#000';
            statWrapper.style.backgroundColor = '#fff';
            window.SRLive.addWidget("widgets.matchhead2head", {
                matchId: fixture.provider_id,
                showTitle: !1,
                container: `#SingleInsideStats_${fixture.provider_id}`
            });
        } else {
            statWrapper.innerHTML = '';
        }
    };

    const toggleMarketInfo = (e) => {
        const el = e.currentTarget;
        const description = el.parentElement.nextElementSibling;
        el.classList.toggle('info-close');
        description.classList.toggle('open')
    }

    const toggleOdds = (e) => {
        const el = e.target;
        console.log(el.tagName)
        if (el.tagName === 'DIV') {
            const parent = el.parentElement;
            parent.classList.toggle('open');
            const content = parent.children[2];
            content.classList.toggle('open');
        }
    }

    return (
        <Layout
            headerLeft={
                <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                    <i className="icon-back" />
                    <span className="d-ib ml5">Back</span>
                </div>
            }>
            {fixture &&
                <>
                    <div className="match">
                        <div className="match__container">
                            <div className="match__top">
                                <ul className="breadcrumb" onClick={() => goTo()}>
                                    <li className="breadcrumb-item">...</li>
                                    <li className="breadcrumb-item">{fixture.sport_name}</li>
                                    <li className="breadcrumb-item">{fixture.sport_category_name}</li>
                                    <li className="breadcrumb-item active ellipsis">{fixture.sport_tournament_name}</li>
                                </ul>
                                <div className="match__options">
                                    <div className="match__options-item" onClick={getStats}>
                                        <i id="stats-icon" className="icon stats"/>
                                        <span className="match__options-label">Stats</span>
                                    </div>
                                </div>
                            </div>
                            <div className="match__info">
                                <div className="match__time"><span><span>{ formatDate(fixture.schedule, 'DD MMM, HH:mm') }</span></span></div>
                                <div className="match__details">
                                    <div>
                                        <div>
                                            <div className="match__teams-dd">
                                                <span className="match__teams">{fixture.event_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <MatchChange fixture={fixture} changeFixture={changeFixture} />
                        </div>
                    </div>
                    <div id={`SingleInsideStats_${fixture.provider_id}`} />
                    <div className="match__markets">
                        {fixture.markets.map(market =>
                        <div className="accordion-box open" key={market.id}>
                            <div className="accordion-toggle collapsible" onClick={(e) => toggleOdds(e)}>
                                <i className="icon ml10 info" onClick={(e) => toggleMarketInfo(e)} />
                                <a className="accordion-toggle--item" href="javascript:;"><p>{market.market_name}</p></a>
                            </div>
                            <div className="match__market-info"><span>{market?.market?.description}</span>
                            </div>
                            <div className="accordion-content open">
                                <div className="inner-content">
                                    <div className="match-scores new">
                                        {_.chunk(market.selections, 3).map((row, i) =>
                                        <div className="match-scores__row" key={`row-${i}`}>
                                            {row.map(selection =>
                                            <div className="match-scores__item" key={`odds-${selection.id}`}>
                                                <div className="table-f">
                                                    <div className="elem">{selection.name}</div>
                                                    <div
                                                        onClick={() => dispatch(addToCoupon(fixture, market.market_id, market.market_name, selection.odds, selection.id, selection.name, createID(fixture.provider_id, market.market_id, selection.name, selection.id), fixture.fixture_type))}
                                                        className={`odd 
                                                         ${(selection.odds === '-' || selection.odds == null) ? 'disabled' : ''}
                                                         ${(isSelected(createID(fixture.provider_id, market.market_id, selection.name, selection.id), coupon)) ? 'active' : ''}`}
                                                    >
                                                        {selection.odds}
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
