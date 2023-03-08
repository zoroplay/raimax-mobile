import React, { useEffect, useState } from "react";
import { addToCoupon } from "../../Redux/actions";
import { createID } from "../../Utils/couponHelpers";
import { useDispatch } from "react-redux";
import { formatOdd, getSpread, isSelected } from "../../Utils/helpers";

export const LiveOdd = ({
  newOdds,
  selection,
  market,
  fixture,
  tournament,
  sport,
  coupon,
  globalVars,
  bonusList,
}) => {
  const [oddsData, setOddsData] = useState(newOdds);
  const dispatch = useDispatch();

  useEffect(() => {
    setOddsData(newOdds);
    // check if current selection has event in it and update
    if (coupon.selections.length) {
      // checkOddsChange(coupon, fixture, newOdds, dispatch, globalVars, bonusList);
    }
  }, [newOdds]);

  const selectOdds = () => {
    if (oddsData !== 0) {
      dispatch(
        addToCoupon(
          fixture,
          oddsData.market_id,
          market.name +
            " " +
            (getSpread(fixture.live_data?.markets, market) !== undefined ? getSpread(fixture.live_data?.markets, market) : ''),
          oddsData.odds,
          selection.id,
          oddsData.type,
          createID(
            fixture.provider_id,
            oddsData.market_id,
            oddsData.type,
            selection.id
          ),
          "live"
        )
      );
    }
  };
  return (
    <div
      onClick={selectOdds}
      className={`bets__item ${
        oddsData === 0 || oddsData.Odds === 0 ? "locked" : ""
      }
            ${
              isSelected(
                createID(
                  fixture.provider_id,
                  oddsData.market_id,
                  oddsData.type,
                  selection.id
                ),
                coupon
              )
                ? "active"
                : ""
            }
            `}
      key={selection.Id}
    >
      <a className="bets__item--link">
        {oddsData !== 0 && oddsData.odds !== 0 && <span>{oddsData.odds}</span>}
      </a>
    </div>
  );
};
