import React, {Fragment, useEffect} from "react";
import Layout from "./Layout";
import {periods} from "../Utils/constants";
import {useDispatch, useSelector} from "react-redux";
import {NavLink} from "react-router-dom";
import * as _ from 'lodash';
import {goBack, slugify, toggleAccordion} from "../Utils/helpers";
import {setActivePeriod, setSport} from "../Redux/actions";
import FlagIcon from "../Utils/flag-icon";

export default function Sport({match, history}) {
    const sport_id = match.params.sid;
    const dispatch = useDispatch();
    const {activePeriod, sports, sport} = useSelector((state) => state.sportsData);

    useEffect(() => {
        const selected = _.find(sports, {'sport_id': parseInt(sport_id)});
        dispatch(setSport(selected));

    }, [sports, sport_id, dispatch]);

    return (
    <Layout
        headerLeft={
            <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                <i className="icon-back" />
                <span className="d-ib ml5">Back</span>
            </div>
        }>
        {sport &&
            <Fragment>
                <div className="callout-sb">
                    <div>{sport.name}</div>
                </div>
                <div className="time-filter">
                    <div className="time-filter__holder">
                    {periods.map(period => <div
                        onClick={() => dispatch(setActivePeriod(period.value))}
                        key={period.value}
                        className={`time-filter__item ${activePeriod === period.value ? 'selected' : ''}`}>
                        {period.label}
                        </div> )}
                    </div>
                </div>
                <div className="accordion-menu">
                    <div className="accordion-box open">
                        <div className="accordion-toggle collapsible"
                             onClick={(e) => toggleAccordion(e, `${slugify(sport.name)}_resourcetranslatepal_s${sport.sport_id}_accordiontoggle`)}
                             id={`${slugify(sport.name)}_resourcetranslatepal_s${sport.sport_id}_accordiontoggle`}>
                            <a className="accordion-toggle--item"
                            id={`${sport.name}_resourcetranslatepal_s#${sport.sport_id}_accordiontoggle_link`}>
                                <p>All {sport.name}</p>
                            </a>
                        </div>
                        <div className="accordion-content open" >
                            <div className="inner-content">
                                {sport?.categories?.map((category, i) =>
                                <div className="accordion-box sub-accordion" key={i}>
                                    <div className="accordion-toggle collapsible"
                                         onClick={(e) => toggleAccordion(e, `${sport.name}_resourcetranslatepal_s${i}_accordiontoggle`)}
                                         id={`${sport.name}_resourcetranslatepal_s${i}_accordiontoggle`}>
                                        <a className="accordion-toggle--item"
                                           id={`${sport.name}_resourcetranslatepal_s#${category.sport_category_id}_accordiontoggle_link`}>
                                            <FlagIcon code={category.code} className="mr5" />
                                            <p>{category.name}</p>
                                        </a>
                                    </div>
                                    <div className="accordion-content" >
                                        <div className="inner-content">
                                            <ul className="access-links">
                                                {category.tournaments.map(tournament =>
                                                <li className="access-links__element" key={`${sport.name}_resourcetranslatepal_s#${sport.sport_id}_${slugify(category.name)}_link_${tournament.sport_tournament_id}_${slugify(tournament.name)}`}>
                                                    <NavLink className="access-links--item" to={`/events/${slugify(sport.name)}/${slugify(tournament.name)}/${tournament.sport_tournament_id}`}>
                                                        <span className="link">{tournament.name}</span>
                                                        <span className="notification">{tournament.total}</span>
                                                    </NavLink>
                                                </li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>}
    </Layout>
  );
}
