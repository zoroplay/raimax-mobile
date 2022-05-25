import React, {useEffect, useState} from "react";
import {addToCoupon} from "../../Redux/actions";
import {checkOddsChange, createID} from "../../Utils/couponHelpers";
import {useDispatch} from "react-redux";
import {formatOdd, isSelected} from "../../Utils/helpers";


export const LiveOddAlt = ({newOdds, selection, market, fixture, tournament, sport, coupon, globalVars, bonusList}) => {
    const [oddsData, setOddsData] = useState(newOdds);

    const dispatch = useDispatch();

    useEffect(() => {
        setOddsData(newOdds);
        // check if current selection has event in it and update
        if (coupon.selections.length) {
            checkOddsChange(coupon, fixture, newOdds, dispatch, globalVars, bonusList);
        }
    }, [newOdds]);

    const selectOdds = () => {
        if (oddsData !== 0) {
            fixture.TournamentName = tournament;
            fixture.SportName = sport;
            dispatch(addToCoupon(fixture, market.TypeId, market.Name, oddsData.Odds[0].Value, oddsData.Id, selection.Name,
                createID(fixture.ProviderId, market.TypeId, selection.Name, oddsData.Id),'live'))
        }
    }
    return (
        <div className={`match-scores__item`} key={`odds-${selection.Id}`}>
            <div className="table-f">
                <div className="elem">{selection.Name}</div>
                <div
                    onClick={selectOdds}
                    className={`odd ${(oddsData === 0 || (oddsData.Odds && oddsData.Odds[0].Value === 0)) ? 'locked' : ''}
                    ${(isSelected(createID(fixture.ProviderId, market.TypeId, selection.Name, oddsData.Id), coupon)) ? 'active' : ''}
                    `}
                >
                    {oddsData !== 0 && oddsData.Odds[0].Value !== 0 && <span>{formatOdd(oddsData.Odds[0].Value)}</span>}
                </div>
            </div>
        </div>
    )
}
