import React, {useCallback, useLayoutEffect, useState} from "react";
import {getMatches} from "../../Services/apis";
import Loader from "./Loader";

export default function MatchChange({fixture, changeFixture}) {
    const [loading, setLoading] = useState(true);
    const [matches, setMatches] = useState([]);

    const fetchMatches = useCallback(async () =>  {
        setLoading(true);
        await getMatches(fixture.sport_tournament_id).then(res => {
            setLoading(false)
            setMatches(res);
        }).catch(err => {
            setLoading(false)
        });
    }, [fixture.sport_tournament_id])

    useLayoutEffect(() => {

        const matchChange = document.getElementsByClassName("dropdown__toggle")[0];

        matchChange.addEventListener("click", function () {
            /* Toggle between hiding and showing the active panel */
            const parent = this.parentElement;
            parent.classList.toggle("open");
            if (parent.classList.contains('open')) {
                parent.classList.remove('open')
            } else {
                parent.classList.add('open')
            }
            if (parent.classList.contains('open') && !matches.length) {
                fetchMatches();
            }
        });

        return () => {}

    }, [fetchMatches, matches.length]);


    return (
        <div className="match__change">
            <div className="dropdown">
                <div className="dropdown__toggle">
                    <div className="match__change-h">Change Match</div>
                    <div className="dropdown-caret"/>
                </div>
                <div className="dropdown__menu">
                    <div className="dropdown__item-breadcrumb">
                        <span className="mr5"><i className="icon prev"/></span>
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item">{fixture.sport_name}</li>
                            <li className="breadcrumb-item">{fixture.sport_category_name}</li>
                            <li className="breadcrumb-item active ellipsis">{fixture.sport_tournament_name}</li>
                        </ul>
                    </div>
                    {!loading && matches && matches.map(match =>
                        <div
                            onClick={() => changeFixture(match)}
                            className={`dropdown__item ${match.provider_id === fixture.provider_id ? 'selected' : ''}`}
                            key={match.provider_id}>
                            <div className="dropdown__link">{match.event_name}</div>
                        </div>
                    )}
                    <Loader loading={loading} />
                </div>
                <div className="dropdown__mask"></div>
            </div>
        </div>
    )
}
