import React, {useEffect, useLayoutEffect, useState} from "react";
import * as _ from 'lodash';
import {useDispatch} from "react-redux";
import {setSport} from "../../Redux/actions";

export default function LeagueChange({tournament, sports, sport, setLeague}) {
    const [tournaments, setTournaments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [selectedSport, setSelectedSport] = useState('');
    const [activeView, setActiveView] = useState('tournaments');
    const dispatch  = useDispatch();

    useLayoutEffect(() => {

        const matchChange = document.getElementsByClassName("dropdown__toggle")[0];

        matchChange.addEventListener("click", function () {
            /* Toggle between hiding and showing the active panel */
            const parent = this.parentElement;
            parent.classList.toggle("open");

        });

        return () => {}

    }, []);

    useEffect(() => {
        // find tournaments
        const category = _.find(sport.categories, {'name': tournament?.sport_category_name});
        setSelectedSport(sport);
        setCategory(category);
        setTournaments(category?.tournaments || []);
    }, [sport, sport.categories, tournament])

    const changeActiveView = () => {
        if (activeView === 'tournaments') {
            setActiveView('categories');
            setCategories(sport.categories);
            setCategory(null);
        } else if (activeView === 'categories') {
            setActiveView('sports');
            setCategory(null);
            setSelectedSport(null);
        }
    }

    const changeTournaments = category => {
        setTournaments(category.tournaments);
        setActiveView('tournaments');
        setCategory(category);
    }

    const changeSport = (sport) => {
        dispatch(setSport(sport));
        setCategories(sport.categories);
        setActiveView('categories');
    }

    const changeLeague = (sport, category, tournament) => {
        const matchChange = document.getElementsByClassName("dropdown__toggle")[0];

        matchChange.click();

        setLeague(sport, category, tournament);
    }

    return (
        <div className="competition-info__change">
            <div className="dropdown">
                <div className="dropdown__toggle">
                    <div className="competition-info__change-h">Change League</div>
                    <div className="dropdown-caret"/>
                </div>
                <div className="dropdown__menu">
                    <div className="dropdown__item-breadcrumb">
                        {activeView !== 'sports' && <span className="mr5"><i className="icon prev"/></span> }
                        <ul className="breadcrumb" onClick={() => changeActiveView()}>
                            <li className="breadcrumb-item">{selectedSport?.name || "Sports"}</li>
                            {category && <li className="breadcrumb-item">{category?.name}</li>}
                        </ul>
                    </div>

                    {activeView === 'tournaments' && tournaments?.map(match =>
                        <div
                            onClick={() => changeLeague(sport.name, category.name, match)}
                            className={`dropdown__item ${match.sport_tournament_id === tournament?.sport_tournament_id ? 'selected' : ''}`}
                            key={match?.sport_tournament_id}>
                            <div className="dropdown__link">
                                {match.name}
                                <span className="notification">{match.total}</span>
                             </div>
                        </div>
                    )}
                    {activeView === 'categories' && categories.map(match =>
                        <div
                            onClick={() => changeTournaments(match)}
                            className={`dropdown__item ${match.sport_category_id === category?.sport_category_id ? 'selected' : ''}`}
                            key={match.sport_category_id}>
                            <div className="dropdown__link">
                                {match.name}
                                <span className="notification">{match.total}</span>
                            </div>
                        </div>
                    )}
                    {activeView === 'sports' && sports.map(item =>
                        <div
                            onClick={() => changeSport(item)}
                            className={`dropdown__item ${item.sport_id === sport?.sport_id ? 'selected' : ''}`}
                            key={item.sport_id}>
                            <div className="dropdown__link">
                                {item.name}
                                <span className="notification">{item.total}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="dropdown__mask"></div>
            </div>
        </div>
    )
}
