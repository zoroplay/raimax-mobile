import React from "react";
import {formatNumber, toggleMenu} from "../../Utils/helpers";
import { useHistory } from "react-router-dom";
import {useSelector} from "react-redux";

export default function BottomMenu() {
    const history = useHistory();
    const coupon = useSelector(({couponData}) => couponData.coupon);
    const {isAuthenticated} = useSelector((state) => state.auth);

    const goTo = (path) => {
        history.push(path);
    }

    return (
        <div className="m-menu">
            <div className="m-menu__item pm-trigger" id="bottommenu_pushmenu" onClick={toggleMenu}>
                <svg className="m-menu__item-img" style={{ pointerEvents: 'none'}}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-menu"/>
                </svg>
                <div className="m-menu__item-title">Menu</div>
            </div>
            <div className="m-menu__item" id="bottommenu_virtual" onClick={() => goTo('/virtual')}>
                <svg className="m-menu__item-img" style={{ pointerEvents: 'none'}}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-virtual"/>
                </svg>
                <div className="m-menu__item-title">Virtual</div>
            </div>
            <div onClick={() => goTo('/betslip')}
                 className={`m-menu__item b-slip ${(coupon?.selections.length) ? 'active' : ''}`}
                 id="bottommenu_betslip">
                <div className="m-menu__item-time">{coupon.bet_type ==='Split' ? 'Split Bet': formatNumber(coupon?.totalOdds)}</div>
                <div className="m-menu__item-selected">{coupon?.selections.length}</div>
                <div className="m-menu__item-title">Betslip</div>
            </div>
            {!isAuthenticated && <div onClick={() => goTo('/register')} className="m-menu__item register" id="bottommenu_register">
                <svg className="m-menu__item-img" style={{ pointerEvents: 'none'}}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-register"/>
                </svg>
                <div className="m-menu__item-title">Register</div>
            </div> }
            {!isAuthenticated && <div onClick={() => goTo('/login')} className="m-menu__item" id="bottommenu_login">
                <svg className="m-menu__item-img" style={{ pointerEvents: 'none'}}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-login"/>
                </svg>
                <div className="m-menu__item-title">Login</div>
            </div> }
            {isAuthenticated && <div id="bottomenu_mybets" onClick={() => goTo('/account/my-bets')} className="m-menu__item">
                {/*<div className="m-menu__item-number">1</div>*/}
                <svg className="m-menu__item-img">
                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-my-bets"/>
                </svg>
                <div className="m-menu__item-title">My Bets</div>
            </div>}
            {isAuthenticated && <div className="m-menu__item" onClick={() => goTo('/account/deposit')}>
                <svg className="m-menu__item-img" >
                    <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-deposit"/>
                </svg>
                <div className="m-menu__item-title">Deposit</div>
            </div>}
        </div>
    );
}
