import React, {useState} from "react";
const leagues = [
    {tid: 852, league: 'en'},
    {tid: 853, league: 'es'},
    {tid: 854, league: 'de'},
    {tid: 855, league: 'it'},
    {tid: 856, league: 'fr'},
    {tid: 857, league: 'pt'},
    {tid: 858, league: 'nl'}
];
export default function ZoomLeagueMenu({ setLeague }) {
    const [activeLeague, setActiveLeague] = useState('en');

    const changeLeague = league => {
        setActiveLeague(league.league);
        setLeague(league.tid);
    }

    return (
        <div className="nav__options-flags">
            {leagues.map(league => <div
                key={league.league}
                onClick={() => changeLeague(league)}
                className={`nav__options-item-flag ${activeLeague === league.league ? 'selected' : '' }`}>
                <i className={`flag mr5 flag-${league.league}`}/>
            </div> )}
        </div>
    )
}
