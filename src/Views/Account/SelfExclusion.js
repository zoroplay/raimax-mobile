import React, {useEffect, useState} from 'react';
import Layout from "../Layout";
import {useSelector, useDispatch} from 'react-redux';
import {SET_LOADING_PROP} from "../../Redux/types";
import {updateSelfExclusion} from "../../Services/apis";
import {calculateExclusionPeriod, goBack} from "../../Utils/helpers";

const SelfExclusion = ({history}) => {
    const [period, setPeriod] = useState('0');
    const [message, setMessage] = useState({status: '', message: ''});
    const dispatch = useDispatch();

    const {isAuthenticated, user} = useSelector(state => state.auth);

    useEffect(() => {
        if(!isAuthenticated)
            history.replace('/');
    },  [isAuthenticated]);

    const submit = () => {
        if (period !== '0'){
            dispatch({type: SET_LOADING_PROP, payload: {show: true, message: ''}});
            updateSelfExclusion({period}).then((res) => {
                dispatch({type: SET_LOADING_PROP, payload: {show: false, message: ''}});

                if(res.success) {
                    setMessage({...message, status: 'success'})
                } else {
                    setMessage({...message, status: 'error', message: res.message});
                }
            })
        }
    }
    return (
        <Layout
            headerLeft={
                <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                    <i className="icon-back" />
                    <span className="d-ib ml5">Back</span>
                </div>
            }>
            <div className="page-title"> Self Exclusion</div>
            <div className="account page__body bg-white">
                {message.status === 'success' &&<div className="callout green" id="exclusion-confirmation">
                    <strong>Product Exclusion Set.</strong>
                </div>}
                {message.status === 'error' && <div className="callout red" id="exclusion-input-error">
                    <strong>Product exclusion error</strong>
                    <p>{message.message}</p>
                </div>}
                <div className="form">
                    <div className="p15">
                        <div className="form-row">
                            <h4 className="txt-blue">What is Self Exclusion?</h4>
                            <p>You can set an amount of time that you cannot place any bets on individual or all products.</p>
                        </div>
                        {user.settings?.self_exclusion_period &&<div className="bg-lightgray mt15 p10 productsExcludedSection">
                            <strong>Products Excluded from</strong>
                            <hr className="my10" />
                            <div className="table-a productExcluded">
                                <div className="name">All</div>
                                <div className="txt-r"><strong className="time">{ calculateExclusionPeriod(user.settings?.self_exclusion_period)} days</strong></div>
                            </div>
                        </div>}
                    </div>
                    <hr className="m0" />
                    <div className="p15 br-dotted" id="main-exclusion-form">
                        <div className="form-row">
                            <div className="form-label"><span>Self Exclusion Period</span></div>
                            <div className="form-select">
                                <select id="duration" value={period} onChange={(e) => setPeriod(e.target.value)}>
                                    <option value="0">Please Select</option>
                                    <option value="15">15 Days</option>
                                    <option value="30">1 Month</option>
                                    <option value="90">3 Months</option>
                                </select>
                                <div className="form-select--hide-arrow" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-label">
                                <span>Exclude from</span>
                            </div>
                            <div className="categoriesList">
                                <div className="checkbox categoriesItem" style={{display: 'block'}}>
                                    <input
                                        type="checkbox"
                                        className="categoryCheck"
                                        id="0"
                                        name="categoryCheck"
                                        value="0" disabled={true} checked={true}
                                    />
                                    <label>
                                        <span className="icon iconCategory" />
                                        <span className="option" id="category">All</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <button
                            className="btn mt15"
                            id="self-exclude-button"
                            onClick={submit}
                            disabled={user?.settings?.self_exclusion_period}
                            style={{width: '100%', borderStyle:'none'}}
                        >
                            Self Exclude
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SelfExclusion;
