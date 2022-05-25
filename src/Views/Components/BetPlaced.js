import React, {Fragment} from "react";
import {formatDate, formatNumber} from "../../Utils/helpers";

export default function BetPlaced({selections, coupon, type}){

    return (
        <Fragment>
            {type === 'booking' && <div className="pl15 pr15 pb15">
                <div className="info-box txt-success">Your bet has been booked.</div>
                <p className="txt-gray mt15">Please take your booking number to any betting shop to place the bet. You
                    can also Login or Register to place the bet online.</p>
                <button className="pos-f btn btn-gray w-full mt20">Booking Number: {coupon.code}</button>
            </div> }
            {type === 'bet' && <div className="info-box green">Your bet has been placed</div>}
            <div className="selections">
                <div className="betslip-holder pb5">
                    <div className="betslip placed">
                        <div className="betslip__heading wrap">
                            <div className="pull-left icon placed-bet mr8"/>
                            <div className="pull-left placed--text">{coupon.bet_type}</div>
                            <div className="pull-right placed--text-time"><span>{coupon.created_at}</span></div>
                        </div>
                        {type === 'bet' && <div className="betslip__id txt-gray">Bet ID: {coupon.betslip_id}</div>}
                        {selections.map(selection =>
                            <>
                            <div className="betslip__content">
                                <div className="betslip__selection-details">
                                    <div className="mb5 ellipsis">
                                        <span className="txt-white">{selection.oddname}</span>
                                        {type === 'bet' && <span className="pull-right txt-primary">{selection.odds}</span>}
                                    </div>
                                    <div className="txt-gray mb5">{selection.market_name}</div>

                                    <div className="table-f txt-gray mb5">
                                        <div><span className="ellipsis">{selection.event_name}</span></div>
                                        <div className="txt-r"><span className="ellipsis"><span>{formatDate(selection.start_date, 'DD MMM HH:mm')}</span></span>
                                        </div>
                                    </div>
                                    <div className="txt-gray">{selection.tournament}</div>
                                </div>
                            </div>
                            <hr className="gray" />
                            </>
                        )}

                        <div className="basket-total p10">
                            <div className="basket-total__row">
                                <div className="dib">Total stake:</div>
                                <div className="pull-right dib txt-bold">{formatNumber(coupon.stake)}</div>
                            </div>
                            <div className="basket-total__row">
                                <div className="dib txt-bold">Potential Win:</div>
                                <div className="pull-right dib txt-bold">{formatNumber(coupon.pot_winnings)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
