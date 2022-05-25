import React, {useEffect} from "react";
import Layout from "../Layout";
import {goBack} from "../../Utils/helpers";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";

export default function Index({match, history}) {
    const {isAuthenticated} = useSelector(state => state.auth);

    useEffect(() => {
        if(!isAuthenticated)
            history.replace('/');
    },  [isAuthenticated]);

    return (
        <Layout
            headerLeft={
                <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                    <i className="icon-back" />
                    <span className="d-ib ml5">Back</span>
                </div>
            }>
            <div className="access">
                <div className="access__menu" id="main-menu">
                    <div className="access__item main-menu-item">
                        <NavLink to="/account/deposit" className="access__item-title">
                            Deposit Funds
                        </NavLink>
                    </div>

                    <div className="access__item main-menu-item">
                        <NavLink to="/account/cashier" className="access__item-title">
                            Bank
                        </NavLink>
                    </div>
                    <div className="access__item main-menu-item" >
                        <NavLink to={`/account/responsible-gambling`} className="access__item-title">
                            Responsible Gambling
                        </NavLink>
                    </div>

                    <div className="access__item main-menu-item" >
                        <NavLink to={`/account/transactions`} className="access__item-title">
                            Transactions
                        </NavLink>
                    </div>

                    <div className="access__item main-menu-item">
                        <NavLink to={`/account/settings`} className="access__item-title">
                            Account Settings
                        </NavLink>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
