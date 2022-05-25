import React, {useEffect} from 'react';
import Layout from "../Layout";
import {NavLink} from "react-router-dom";
import {goBack} from "../../Utils/helpers";
import {useSelector} from "react-redux";

const AccountSetting = ({history}) => {
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
                        <NavLink to="/account/details" className="access__item-title">
                            Account Details
                        </NavLink>
                    </div>

                    <div className="access__item main-menu-item" id="1004">
                        <NavLink to="/account/settings/change-password" className="access__item-title">
                            Change Password
                        </NavLink>
                    </div>

                    <div className="access__item main-menu-item" id="1004">
                        <NavLink to="/account/settings/marketing-preferences" className="access__item-title">
                            Marketing Preferences
                        </NavLink>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default AccountSetting;
