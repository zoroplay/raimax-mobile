import React, {useEffect, useState} from 'react';
import * as _ from 'lodash';
import Layout from "./Layout";
import Fixtures from "./Components/Fixtures";
import FixturesSkeleton from "./Components/FixturesSkeleton";
import { searchFixtures } from '../Services/apis';

const SearchFixtures = ({location}) => {
    const urlParam = new URLSearchParams(location.search);
    const searcKey = urlParam.get('q');

    const [loading, setLoading] = useState(true);
    const [fixtures, setFixtures] = useState([]);
    const [predictions, setPredictions] = useState([]);

    useEffect(() => {
        doSearch();
    }, [searcKey]);

    const doSearch = async () => {
        await searchFixtures(searcKey).then(res => {
            setLoading(false);
            setFixtures(res.fixtures);
            setPredictions(res.predictions);
        }).catch(err => {
            setLoading(false);

        });
    }


    return (
        <Layout>
            <div className="callout-sb">
                <div>Search Fixtures</div>
            </div>
            
            {!loading && <Fixtures showLeague={false} fixtures={fixtures} predictions={predictions} />}
            {loading && <FixturesSkeleton />}
        </Layout>
    );
};

export default SearchFixtures;
