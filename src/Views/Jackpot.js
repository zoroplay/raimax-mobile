import React, {useCallback, useEffect, useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import Layout from './Layout';

import {checkBetType, createID, groupSelections} from "../Utils/couponHelpers";
import {getJackpots, getSplitProps} from "../Services/apis";
import {calculateExclusionPeriod, formatDate, goBack, isSelected, slugify} from "../Utils/helpers";
import FixturesSkeleton from "./Components/FixturesSkeleton";
import {NavLink} from "react-router-dom";
import {toast} from "react-toastify";
import {Http} from "../Utils";
import {UPDATE_USER_BALANCE} from "../Redux/types";


export default function Jackpot({match, history}) {
    const {user} = useSelector(state => state.auth);

    const [jackpots, setJackpots] = useState(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [coupon, setCoupon] = useState({
        selections: [],
        totalOdds: 1,
        maxBonus: 0,
        minBonus: 0,
        maxWin: 0,
        minWin: 0,
        stake: 0,
        totalStake: 0,
        minOdds: 1,
        maxOdds: 1,
        event_type: 'jackpot',
        channel: 'mobile',
        autopick: 0,
        jackpot_id: null
    });
    const [activeJackpot, setActiveJackpot] = useState(null);

    const init = useCallback( () => {
        setLoading(true);
        getJackpots().then((res) => {
            setLoading(false);
            // console.log(res)
            if (res.length > 0) {
                setJackpots(res);
                setActiveJackpot(res[0]);
                setCoupon({
                    ...coupon,
                    stake: res[0].stake,
                    totalStake: res[0].stake,
                    maxWin: res[0].amount,
                    jackpot_id: res[0].id
                })
            }
        })
    }, []);

    useEffect(() => {
        init();
        return () => {resetCoupon()}
    }, [init]);

    useEffect(() => {
        if (coupon.autopick > 0) {
            // loop through fixtures to make random selection
            activeJackpot.fixtures.forEach(fixture => {
                const num = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
                fixture.market.selections.forEach(selection => {
                    if (selection.id === num) {
                        addToJackpot(fixture, selection, createID(fixture.provider_id, fixture.market.market_id, selection.name, selection.id))
                    }
                })
            });
        }
    }, [coupon.autopick]);

    const proceed = () => {
        if (coupon.selections.length && groupSelections(coupon.selections).length === activeJackpot.fixtures.length) {
            if (user.settings?.self_exclusion_period) {
                toast.error(`You have been temporary locked out for the next ${calculateExclusionPeriod(user.settings?.self_exclusion_period)} days due to your responsible gaming self exclusion settings.`)
                return;
            }
            const data = {...coupon};
            data.bet_type = 'Jackpot';

            setSubmitting(true);
            Http.post('sports/place-bet?channel=mobile', data).then(res => {
                setSubmitting(false);
                if (res.success) {
                    // update user balance
                    dispatch({type: UPDATE_USER_BALANCE, payload: res.balance});
                    toast.success('Your jackpot bet has been placed successfully');
                    // return dispatch({type: SET_BET_PLACED, payload: res});
                    resetCoupon();
                } else if (res.message === 'auth_fail') {
                    history.push('/login')
                } else if (res.message === 'odds_change') {

                    toast.error('Attention! some odds have been changed');
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000)

                } else {
                    toast.error(res.message);
                }
            }).catch(err => {
                setSubmitting(false);

                if(err.response.status === 401){
                    toast.error('Please login to place bets');
                    history.push('/login')
                }
            });
        } else {
            toast.error('You must make at least one selection from each game');
        }
    }

    const addToJackpot = async (fixture, selection, ele_id) => {
        const data = {
            provider_id: fixture.provider_id,
            event_id: fixture.event_id,
            event_name: fixture.event_name,
            market_id: fixture.market.market_id,
            market_name: fixture.market.market_name,
            oddname: selection.name,
            odd_id: selection.id,
            odds: selection.odds,
            element_id: ele_id,
            start_date: fixture.schedule,
            tournament: fixture.sport_tournament_name,
            category: fixture.sport_category_name,
            sport: fixture.sport_name,
            type: 'jackpot'
        };

        let couponData = {...coupon};
        //

        for (let i = 0; i < couponData.selections.length; i++) {
            //check if it's same event selected and remove it
            if (couponData.selections[i].element_id === data.element_id) {
                //remove item
                couponData.selections.splice(i, 1);
                //check if couponData still has selections
                if (couponData.selections.length > 0) {
                    //group selections by match
                    couponData.grouped = groupSelections(couponData.selections, 'provider_id');
                    //check bet type
                    couponData.bet_type = checkBetType(couponData.grouped);


                    // @ts-ignore
                    if (couponData.bet_type === 'Split') {
                        couponData = await getSplitProps(couponData);
                    }else { // else remove selection from total odds
                        couponData.totalOdds = (parseFloat(couponData.totalOdds) / parseFloat(data.odds)).toFixed(2);
                        couponData.noOfCombos = 1;
                    }
                    // @ts-ignore
                    couponData.stake = parseFloat(activeJackpot.stake) * parseFloat(couponData.noOfCombos);

                    return setCoupon(couponData);
                } else {
                    resetCoupon();
                    return;
                }
            }
        }
        for (let i = 0; i < couponData.selections.length; i++) {
            if(couponData.selections[i].provider_id === data.provider_id){
                //remove item
                couponData.selections.splice(i, 1);
                /*if (!couponData.noOfCombos || couponData.noOfCombos < 4) {

                    couponData.selections.push(data);
                    // @ts-ignore
                    couponData.bet_type = 'Split';
                    // remove item
                    // couponData.selections.splice(i, 1);
                    couponData = await getSplitProps(couponData);
                    // @ts-ignore
                    couponData.stake = parseFloat(activeJackpot.stake) * parseFloat(couponData.noOfCombos);

                    return setCoupon(couponData);
                } else {
                    return;
                }*/
            }
        }

        // @ts-ignore
        couponData.totalOdds = (parseFloat(couponData.totalOdds) * parseFloat(data.odds)).toFixed(2);
        //add selection to selections list
        couponData.selections.push(data);
        // @ts-ignore
        if (couponData.bet_type === 'Split') {
            couponData = await getSplitProps(couponData);
        }
        return setCoupon(couponData);
    }

    const jackpotAutoPickup = () => {
        // reset selections
        setCoupon({
            selections: [],
            totalOdds: 1,
            maxBonus: 0,
            minBonus: 0,
            maxWin: activeJackpot?.amount,
            minWin: 0,
            stake: activeJackpot?.stake,
            totalStake: activeJackpot?.stake,
            minOdds: 1,
            maxOdds: 1,
            event_type: 'jackpot',
            channel: 'mobile',
            autopick: coupon.autopick + 1,
            jackpot_id: activeJackpot?.id
        })

    }

    const resetCoupon = () => {
        setCoupon({
            selections: [],
            totalOdds: 1,
            maxBonus: 0,
            minBonus: 0,
            maxWin: activeJackpot?.amount || 0,
            minWin: 0,
            stake: activeJackpot?.stake || 0,
            totalStake: activeJackpot?.stake,
            minOdds: 1,
            maxOdds: 1,
            event_type: 'jackpot',
            channel: 'mobile',
            autopick: 0,
            jackpot_id: null
        })
    }

    const changeJackpot = (jackpot) => {
        setActiveJackpot(jackpot);
        resetCoupon();
    }


  return (
      <Layout
          headerLeft={
              <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                  <i className="icon-back" />
                  <span className="d-ib ml5">Back</span>
              </div>
          }
          headerCenter={<div className="txt-c">JACKPOT</div>}
      >
          <div className="filter">
              {jackpots && jackpots.map(jackpot =>
                  <div
                      key={jackpot.id}
                      className={`filter--btn ${activeJackpot?.id === jackpot?.id ? 'active' : ''}`}
                      onClick={() => changeJackpot(jackpot) }
                  >
                      <p>{jackpot.title}</p>
                  </div>
              )}
          </div>
          {loading ? <FixturesSkeleton/>
              :
              <>
                  <div className="match-info table-f">
                      <div className="match-info--title">Games</div>
                      <div className="match-odds">
                          <div className="table-f">
                              <div className="match-odds--value">1</div>
                              <div className="match-odds--value">2</div>
                              <div className="match-odds--value">3</div>
                          </div>
                      </div>
                  </div>
                  {activeJackpot && activeJackpot.fixtures.length > 0 &&
                  activeJackpot.fixtures.map(match =>
                      <div className={`match-content`} key={match.provider_id}>
                          <div className="table-f">
                              <div className="match-content__row--league">
                                  {match.sport_category_name} - {match.sport_tournament_name}
                              </div>
                          </div>
                          <div className={`table-a`}>
                              <div className="match-content__info" id={`match_info_${match.provider_id}`}>
                                  <div className="match-content__row table-f">
                                      <div className="match-content__stats">
                                          <div className="match-content__stats-icon" />
                                      </div>
                                      <NavLink to={`/eventdetail/${slugify(match.sport_name)}/${slugify(match.sport_category_name)}/${slugify(match.sport_tournament_name)}/${slugify(match.event_name)}/${match.provider_id}`}>
                                          <div className="table-f">
                                              <div className="match-content__row--team">{match.team_a}</div>
                                          </div>
                                          <div className="table-f">
                                              <div className="match-content__row--team">{match.team_b}</div>
                                          </div>
                                      </NavLink>
                                  </div>
                                  <div className="match-content__row table-f">
                                      <div className="match-content__row--info"><span><span>{formatDate(match.event_date, 'DD/MM')}</span> {match.event_time}</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="bets">
                                  <div className="bets__row table-f">
                                      {match.market && match.market.selections.length > 0 && match.market.selections.map(selection =>
                                          <div
                                              onClick={() => addToJackpot(match, selection, createID(match.provider_id, match.market.market_id, selection.name, selection.id))}
                                              className={`bets__item ${(isSelected(createID(match.provider_id, match.market.market_id, selection.name, selection.id), coupon)) ? 'active' : ''}`}
                                              key={selection.id}>
                                              <a className="bets__item--link">
                                                  <span>{selection.odds}</span>
                                              </a>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
                  <div className="jkpt-cta">
                      <div className="jkpt-cta-inner">
                          <div className="jkpt-cta-a">
                              <div className="cxbtn" onClick={jackpotAutoPickup}>
                                  <div className="cxbtn-ico">
                                      <i className="fa fa-random cxbtn-ico-src" />
                                  </div>
                                  <input type="hidden" name="roundId" id="roundId" value="0" />
                                  <div className="cxbtn-txt">auto pickup</div>
                              </div>
                          </div>
                          <div className="jkpt-cta-b">
                              <span className="totstk">Stake:</span>
                              <div className="totstk-box">
                                  <div className="totstk-cur">KES</div>
                                  <div className="totstk-amt" id="price">{activeJackpot?.stake}</div>
                              </div>
                          </div>
                          <div className="jkpt-cta-b">
                              <span className="totstk">Comb:</span>
                              <div className="totstk-box">
                                  {/*@ts-ignore*/}
                                  <div className="totstk-amt" id="combo">{coupon?.noOfCombos || 1}</div>
                              </div>
                          </div>
                          <div className="jkpt-cta-b">
                              <span className="totstk">total stake:</span>
                              <div className="totstk-box">
                                  <div className="totstk-cur">KES</div>
                                  <div className="totstk-amt" id="total">{coupon?.stake}</div>
                              </div>
                          </div>

                          <div className="jkpt-cta-c">

                              <div className="kkxbtn kkxbtn-stop" onClick={resetCoupon}>
                                  <div className="kkxbtn-ico">
                                      <i className="fa fa-times kkxbtn-ico-src" />
                                  </div>
                                  <div className="kkxbtn-txt">Cancel</div>
                              </div>

                              <div className="kkxbtn kkxbtn-go" onClick={proceed}>
                                  <div className="kkxbtn-ico">
                                      <i className="fa fa-check-square-o kkxbtn-ico-src" />
                                  </div>
                                  <div className="kkxbtn-txt">
                                      {!isSubmitting ? 'Proceed' : 'Submitting...' }
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </>
          }
      </Layout>
  );
};
