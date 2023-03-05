import React, { Fragment, useEffect, useState } from "react";
import {
  formatDate,
  groupFixtures,
  isSelected,
  slugify,
} from "../../Utils/helpers";
import moment from "moment";
import { NavLink, useHistory } from "react-router-dom";
import { createID } from "../../Utils/couponHelpers";
import { addToCoupon } from "../../Redux/actions";
import { useDispatch, useSelector } from "react-redux";
import * as _ from "lodash";
import { widgetTabs } from "../../Utils/constants";

export default function Fixtures({ fixtures, predictions, showLeague }) {
  const dispatch = useDispatch();
  const today = moment().format("YYYY-MM-DD");
  const coupon = useSelector(({ couponData }) => couponData.coupon);
  const [showStat, setShowStat] = useState(null);
  const [activeWidget, setActiveWidget] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (showStat !== null) {
      setActiveWidget(widgetTabs[0]);
      const statWrapper = document.getElementById(`sr-widget-${showStat}`);

      if (statWrapper.innerHTML === "") {
        statWrapper.innerHTML = "Loading";
        statWrapper.style.color = "#000";
        statWrapper.style.backgroundColor = "#fff";

        // window.SIR("addWidget", `.sr-widget-1`, "season.liveTable", {matchId:showStat});
        window.SRLive.addWidget(`widgets.matchhead2head`, {
          matchId: showStat,
          showTitle: !1,
          container: `#sr-widget-${showStat}`,
        });
      } else {
        statWrapper.innerHTML = "";
      }
    }
  }, [showStat]);

  const toggleWidget = (widget) => {
    const statWrapper = document.getElementById(`sr-widget-${showStat}`);

    setActiveWidget(widget);
    statWrapper.innerHTML = "Loading...";
    statWrapper.style.color = "#000";
    statWrapper.style.backgroundColor = "#fff";
    // if(widget.value === 'matchhead2head') {
    window.SRLive.addWidget(`widgets.${activeWidget.value}`, {
      matchId: showStat,
      showTitle: !1,
      container: `#sr-widget-${showStat}`,
    });
    // } else {
    //     window.SIR("addWidget", `.sr-widget-1`, widget.value, {matchId:showStat});
    // }
  };

  const toggleStat = (fixture) => {
    if (showStat === null) {
      setShowStat(fixture);
    } else {
      setShowStat(null);
    }
  };

  const goTo = (tournament) => {
    history.push(`/events/${slugify(tournament.sport_name)}/${slugify(tournament.sport_tournament_name)}/${tournament.sport_tournament_id}`)
  }

  return (
    <Fragment>
      {fixtures &&
        groupFixtures(fixtures).map((fixture, i) => (
          <div key={`group-${i}`}>
            <div className="match-info table-f">
              <div className="match-info--title">
                {fixture.event_date === today
                  ? "Today"
                  : formatDate(fixture.event_date, "ddd DD MMM, YYYY")}
              </div>
              {predictions.length <= 3 && (
                <div className="match-odds">
                  {predictions && (
                    <div className="table-f">
                      {predictions.map((prediction, i) => (
                        <div className="match-odds--value" key={`odds-${i}-${prediction.odd_id}`}>
                          {prediction.odd_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {fixture.events.map((match, i) => (
              <div key={`match-${match.provider_id}-${i}`}>
                <div className={`match-content`}>
                  {showLeague && (
                    <div className="table-f" onClick={() => goTo(match)}>
                      <div className="match-content__row--league">
                        {match.sport_category_name} -{" "}
                        {match.sport_tournament_name}
                      </div>
                    </div>
                  )}
                  <div
                    className={`${
                      match.odds.length <= 3 ? "table-a" : "match-content-score"
                    }`}
                  >
                    <div
                      className="match-content__info"
                      id={`match_info_${match.provider_id}`}
                    >
                      <div className="match-content__row table-f">
                        <div
                          className="match-content__stats"
                          onClick={() => toggleStat(match.provider_id)}
                        >
                          <div
                            className={`match-content__stats-icon ${
                              showStat === match.provider_id ? "open" : ""
                            }`}
                          />
                        </div>
                        <NavLink
                          to={`/eventdetail/${slugify(
                            match.sport_name
                          )}/${slugify(match.sport_category_name)}/${slugify(
                            match.sport_tournament_name
                          )}/${slugify(match.event_name)}/${match.provider_id}`}
                        >
                          <div className="table-f">
                            <div className="match-content__row--team">
                              {match.team_a}
                            </div>
                          </div>
                          <div className="table-f">
                            <div className="match-content__row--team">
                              {match.team_b}
                            </div>
                          </div>
                        </NavLink>
                      </div>
                      <div className="match-content__row table-f">
                        <div className="match-content__row--info">
                          <span>
                            <span>{formatDate(parseInt(match.schedule), 'HH:mm')}</span> ●{" "}
                            {match.markets_count}&nbsp;Markets
                          </span>
                        </div>
                      </div>
                    </div>
                    {match.odds.length <= 3 ? (
                      <div className="bets">
                        <div className="bets__row table-f">
                          {match.odds.map((odd) => (
                            <div
                              onClick={() =>
                                dispatch(
                                  addToCoupon(
                                    match,
                                    predictions[0]?.market_id,
                                    predictions[0].market_name,
                                    odd.odds,
                                    odd.id,
                                    odd.name,
                                    createID(
                                      match.provider_id,
                                      predictions[0]?.market_id,
                                      odd.name,
                                      odd.id
                                    ),
                                    match.fixture_type
                                  )
                                )
                              }
                              className={`bets__item ${
                                isSelected(
                                  createID(
                                    match.provider_id,
                                    predictions[0]?.market_id,
                                    odd.name,
                                    odd.id
                                  ),
                                  coupon
                                )
                                  ? "active"
                                  : ""
                              } ${odd.odds <= 1.01 ? 'locked' : ''}`}
                              key={odd.id}
                            >
                              <a className="bets__item--link">
                                <span>
                                  {parseFloat(odd.odds)?.toFixed(2)}
                                </span>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="match-scores new">
                        {_.chunk(match.odds, 3).map((row, i) => (
                          <div className="match-scores__row" key={`row-${i}`}>
                            {row.map((odd) => (
                              <div
                                className="match-scores__item"
                                key={`odds-${odd.id}`}
                              >
                                <div className="table-f">
                                  <div className="elem">{odd.name}</div>
                                  <div
                                    onClick={() =>
                                      dispatch(
                                        addToCoupon(
                                          match,
                                          predictions[0]?.market_id,
                                          predictions[0].market_name,
                                          odd.odds,
                                          odd.id,
                                          odd.name,
                                          createID(
                                            match.provider_id,
                                            predictions[0]?.market_id,
                                            odd.name,
                                            odd.id
                                          ),
                                          match.fixture_type
                                        )
                                      )
                                    }
                                    className={`bets__item ${
                                      isSelected(
                                        createID(
                                          match.provider_id,
                                          predictions[0]?.market_id,
                                          odd.name,
                                          odd.id
                                        ),
                                        coupon
                                      )
                                        ? "active"
                                        : ""
                                    }`}
                                  >
                                    {odd.odds}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {showStat === match.provider_id && (
                  <>
                    <div className="event-stats open">
                      <div className="event-stats__selector table-f p10">
                        <div
                          className={`event-stats__selector-item txt-c selected`}
                          onClick={() => toggleWidget("matchhead2head")}
                        >
                          Head To Head
                        </div>
                        <div
                          className={`event-stats__selector-item txt-c`}
                          onClick={() =>
                            window.open(
                              `https://s5.sir.sportradar.com/betradar/en/match/${match.provider_id}`,
                              "stats",
                              "width=1078,height=768"
                            )
                          }
                        >
                          League Table
                        </div>
                      </div>
                      <div className="widgets">
                        <div>
                          <div
                            className="sr-widget sr-widget-1"
                            id={`sr-widget-${match.provider_id}`}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="stats-toggle"
                      onClick={() => setShowStat(null)}
                    >
                      <i className="icon arrow" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
    </Fragment>
  );
}
