import React, {useEffect, useState} from "react";
import Layout from './Layout';
import {goBack} from "../Utils/helpers";
import {useDispatch} from "react-redux";
import Loader from "./Components/Loader";
import ZoomLeagueMenu from "./Components/ZoomLeagueMenu";
import {getFixtures, getMarkets} from "../Services/apis";
import Fixtures from "./Components/Fixtures";
import Markets from "./Components/Markets";

export default function ZoomFixtures({history}) {

    const [fixtures, setFixtures] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [activeMarket, setActiveMarket] = useState({});
    const [predictions, setPredictions] = useState([]);
    const [groups, setGroups] = useState([]);
    const [activeLeague, setActiveLeague] = useState(852);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    const toggleInfo = (e) => {
        const ele = e.target;
        const parent = ele.parentElement.parentElement;
        parent.classList.toggle('open')
    }

    const getZoomFixtures = (league) => {
        setLoading(true);
        setActiveLeague(league);

        getFixtures(league, 30).then(res => {
            setLoading(false);
            setPredictions(res.predictions);
            setMarkets(res.markets);
            setGroups(res.groups);
            setActiveMarket(res.selected_market);
            setFixtures(res.fixtures);
        }).catch(err => {
            setLoading(false);
        })
    }

    useEffect(() => {
        getZoomFixtures(activeLeague)
    }, []);

    const changeMarket = (market) => {
        setLoading(true);
        market.market_group_id = market.group_id;
        setActiveMarket(market);
        getMarkets(activeLeague, 30, market.id).then(res => {
            setPredictions(res.predictions);
            setFixtures(res.fixtures);
        }).catch(err => {

        });
    }

    return (
        <Layout
            headerLeft={
                <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                    <i className="icon-back" />
                    <span className="d-ib ml5">Back</span>
                </div>
            }>
            <div className="callout-sb">
                <div>Zoom Soccer</div>
                <div>
                    <div className="league-stats zoom false"/>
                </div>
            </div>
            <div className="zoom-info p10 open">
                <div className="zoom-info__heading">
                    <div><i className="icon zoom"/></div>
                    <div className="pl10">
                        <div className="txt-primary">Zoom Soccer</div>
                        <div>Virtual soccer leagues</div>
                    </div>
                    <div className="zoom-info__more-holder" onClick={toggleInfo}>
                        <div>More Info</div>
                        <div className="icon arrow ml5"/>
                    </div>
                </div>
                <div className="zoom-info__content pt10 mt10">Our virtual soccer game with real markets, real teams and
                    real leagues but simulated results. For when you want the full betting experience but don’t want to
                    wait.
                </div>
            </div>
            <ZoomLeagueMenu setLeague={getZoomFixtures} />
            <Markets groups={groups} markets={markets} activeMarket={activeMarket} setActiveMarket={changeMarket} />
            {!loading &&<Fixtures
                fixtures={fixtures}
                predictions={predictions}
                dispatch={dispatch}
            />}
            <Loader loading={loading} />
        </Layout>
    );
}
