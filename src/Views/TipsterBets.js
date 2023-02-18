import React, {useCallback, useEffect, useState} from 'react';
import Layout from "./Layout";
import { getTipsterBetslips} from "../Services/apis";
import {SingleSlip} from "./Components/SingleSlip";
import {formatTipsterName} from "../Utils/helpers";
import {SingleSlipSkeleton} from "./Components/SingleSlipSkeleton";

const TipsterBets = ({history, match}) => {
    // @ts-ignore
    const {id: user_id} = match.params;
    const n = 5;

    const [loading, setLoading] = useState(false);
    const [tipster, setTipster] = useState(null);

    const getBets = useCallback(() => {
        setLoading(true);
        getTipsterBetslips(user_id).then((res) => {
            setLoading(false);
            setTipster(res);
        });
    }, []);

    useEffect(() => {
        getBets();
    }, []);


    return (
        <Layout>
            <div className="callout-sb">
                <div>Open tickets for {formatTipsterName(tipster?.username)}</div>
            </div>
            {!loading && tipster?.betslips.length > 0 && tipster?.betslips.map(betslip => <SingleSlip betslip={betslip} tipster={tipster} key={betslip.id} history={history} type={'tipster'} /> )}
            {!loading && tipster?.betslips.length === 0 && <div className="p10 txt-c">
                <div className="m20">No bets found.</div>
            </div>}
            {loading && [...Array(n)].map((ele, index) => <SingleSlipSkeleton key={index} /> )}
        </Layout>
    );
}

export default TipsterBets;
