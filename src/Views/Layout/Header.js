import React from "reactn";
import {NavLink} from "react-router-dom";
import { useHistory } from "react-router-dom";
import {useDispatch} from "react-redux";
import {formatNumber, toggleAccountMenu} from "../../Utils/helpers";
import {SET_SHOW_DOWNLOAD} from "../../Redux/types";

export default function Header({right, left, center, showDownload, auth}) {
    const dispatch = useDispatch();

    const history = useHistory();
    const goHome = () => {
        history.push('/')
    }

    return (
        <header>
            {showDownload &&
            <div className="app-dl">
                <div className="app-dl__item app-dl__item-close" >
                    <a href="javascript:;" onClick={() => dispatch({type: SET_SHOW_DOWNLOAD})} >
                        <img src="/img/close-icon--rounded.png" />
                    </a>
                </div>
                <div className="app-dl__item app-dl__item-logo" />
                <div className="app-dl__item app-dl__item-text">
                    <strong>Get the Ourbet Mobile App</strong><p>Enhance your experience</p>
                </div>
                <div className="app-dl__item app-dl__item-btn">
                    <a className="btn red" href="#" id="pushmenu_downloadbar_button">download</a>
                </div>
            </div>}
            <div className="h-s">
                <div className="h-s__wrap">

                    {left ? left
                     : (
                         <div className="h-s__wrap-item txt-l">
                             {!auth.isAuthenticated &&
                            <NavLink to="/register" id="header_link_register" className="h-s__wrap-trigger pl15 py10">
                                <i className="icon-register" />
                                <span className="txt-primary d-ib ml5">Register</span>
                            </NavLink>}
                        </div>
                        )}

                    <div className={`h-s__wrap-item ${center ? 'status' : 'logo'}`} onClick={goHome}>
                        <i className="logo-s" id="header_link_home_logo" />
                        {center && center}
                    </div>

                    {right ? right :
                        (
                            <div className="h-s__wrap-item txt-r">
                                {auth.isAuthenticated ? (
                                    <div className="account pr5" onClick={toggleAccountMenu}>
                                        <div id="header_togglemenu" className="account__info"><small
                                            className="account__info-item txt-secondary">My Account</small>
                                            <div className="account__info-item">{formatNumber(auth.user.balance)}</div>
                                        </div>
                                        <div className="account__logo">
                                            <div className="account__logo-img"><i className="icon-account" id="account-icon"/></div>
                                        </div>
                                    </div>
                                ):(
                                  <NavLink to="/login" id="header_link_login" className="h-s__wrap-trigger pr15 py10"><span
                                      className="d-ib mr5">Login</span>
                                    <i className="icon-login" />
                                  </NavLink>
                                )}
                            </div>
                        )}
                </div>
            </div>
        </header>
    );
}
