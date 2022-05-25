import React, {useEffect, useState} from 'react';
import Layout from "../Layout";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {Formik, Field} from "formik";
import {changePassword} from "../../Services/apis";
import {REMOVE_USER_DATA, SET_TOAST_PROPS} from "../../Redux/types";
import {goBack} from "../../Utils/helpers";


const AccountDetails = ({history}) => {
    const {isAuthenticated, user} = useSelector(state => state.auth);

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
            <div className="page-title"> Account Details</div>
            <div className="main-content bg-white">

                <div className="personal__details p15">
                    <div className="personal__details-top">
                        <div className="table-f">
                            <div>Account Id</div>
                            <div>{user.code}</div>
                        </div>
                        <div className="table-f mt5">
                            <div>First Name(s)</div>
                            <div>{user.details.first_name}</div>
                        </div>
                        <div className="table-f mt5">
                            <div>Surname</div>
                            <div>{user.details.last_name}</div>
                        </div>
                        <div className="table-f mt5">
                            <div>Email<span className="txt-orange"></span></div>
                            <div>{user.email}</div>
                        </div>
                        <div className="table-f mt5">
                            <div>Date of birth</div>
                            <div>{user.details.date_of_birth}</div>
                        </div>
                        <div className="table-f mt5">
                            <div>Contact Number</div>
                            <div>{user.details.phone_number}</div>
                        </div>
                        <div className="table-f mt5">
                            <div>Address</div>
                            <div>{user.details.address}</div>
                        </div>
                        <div className="table-f mt5">
                            <div>City</div>
                            <div>{user.details.city}</div>
                        </div>
                        <div className="table-f mt5">
                            <div>State</div>
                            <div>{user.details.state}</div>
                        </div>
                        <div className="table-f mt5">
                            <div>Post code</div>
                            <div>-</div>
                        </div>
                        <div className="table-f mt5">
                            <div>Country</div>
                            <div>{user.details.country}</div>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
}


export default AccountDetails;
