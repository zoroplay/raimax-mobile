import React, {useEffect, useState} from 'react';
import Fixtures from "./Components/Fixtures";
import Layout from "./Layout";
import moment from "moment";
import {fetchFixturesByDateSport, getMarkets} from "../Services/apis";
import {useDispatch} from 'react-redux';
import FixturesSkeleton from "./Components/FixturesSkeleton";
import Markets from "./Components/Markets";
import {SET_TOAST_PROPS} from "../Redux/types";


const DailyBundle = () => {
    const [loading, setLoading] = useState(true);
    const [activeDate, setActiveDate] = useState(moment().day());
    const [fixtures, setFixtures] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [activeMarket, setActiveMarket] = useState(null);
    const [groups, setGroups] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [curDate, ] = useState(moment().format('DD MMMM YYYY'));
    const [date, setDate] = useState(moment().format('DD MMMM YYYY'));
    const [endDate, ] = useState(moment().add(6, 'days').format('DD MMMM YYYY'));
    const dispatch = useDispatch();

    const displayWeekDay = (day) => {
        const today = moment();
        const curr = moment().day(day);

        if(today.format('YYYY-MM-DD') === curr.format('YYYY-MM-DD')){
            return 'Today\'s';
        } else if (curr.diff(today, 'days') === 1) {
            return 'Tomorrow\'s';
        }
        return moment().day(day).format('dddd')+'\'s';
    }

    const prevDate = () => {
        if(curDate !== date) {
            let newDay = activeDate - 1;
            setActiveDate(newDay);
            setDate(moment().day(newDay).format('DD MMMM YYYY'));
            // getFixtures(moment().day(newDay).format('YYYY-MM-DD'), activeSport?.sport_id);
        }
    }
    const nextDate = () => {
        if (endDate !== date) {
            let newDay = activeDate + 1;
            setActiveDate(newDay);
            setDate(moment().day(newDay).format('DD MMMM YYYY'));
            // getFixtures(moment().day(newDay).format('YYYY-MM-DD'), activeSport?.sport_id);
        }
    }


    const getFixtures = () => {
        setLoading(true)
        fetchFixturesByDateSport(moment().day(activeDate).format('YYYY-MM-DD'), 1)
            .then((res) => {
            setLoading(false);
            setFixtures(res.fixtures);
            setPredictions(res.predictions);
            setGroups(res.groups);
            setMarkets(res.markets);
            setActiveMarket(res.markets[0]);
        }).catch(err => {
            setLoading(false);
            dispatch({type: SET_TOAST_PROPS, payload: {show: true, message: 'Unable to fetch fixtures'}});
        });
    }

    useEffect(() => {
        if (activeDate) {
            getFixtures();
        }
    }, [activeDate]);


    const changeMarket = (market) => {
        setLoading(true);
        market.market_group_id = market.group_id;
        setActiveMarket(market);
        // @ts-ignore
        getMarkets(0, 1, market.id, moment().day(activeDate).format('YYYY-MM-DD'))
            .then((res) => {
            setLoading(false);
            setPredictions(res.predictions);
            setFixtures(res.fixtures);
        }).catch(err => {
            setLoading(false);
        });
    }

    return (
        <Layout>
            <div className="top-nav">
                <div className="top-nav__date-holder">
                    <div className={`top-nav__left-btn`} onClick={prevDate}>
                        <span className="arrow"/>
                    </div>
                    <div className="top-nav__info txt-c ml20 mr20">
                        <p className="top-nav__day"><strong>{displayWeekDay(activeDate)} matches</strong></p>
                        <p className="top-nav__date">{date}</p></div>
                    <div className={`top-nav__right-btn`} onClick={nextDate}>
                        <span className="arrow"/>
                    </div>
                </div>
            </div>
            <Markets groups={groups} markets={markets} activeMarket={activeMarket} setActiveMarket={changeMarket} />

            {loading ? <FixturesSkeleton /> :
                (fixtures.length ?
                    <Fixtures showLeague={true} fixtures={fixtures} predictions={predictions} />
                    : <h2 className="txt-c p20">No odds found</h2>)
            }
        </Layout>
    );
};

export default DailyBundle;
