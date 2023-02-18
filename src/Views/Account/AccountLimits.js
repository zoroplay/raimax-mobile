import React, {useEffect, useState} from 'react';
import Layout from "../Layout";
import {useSelector, useDispatch} from 'react-redux';
import {SET_LOADING_PROP} from "../../Redux/types";
import {updateDepositLimit} from "../../Services/apis";
import {formatNumber, goBack} from "../../Utils/helpers";

const AccountLimits = ({history}) => {
    const {isAuthenticated, user} = useSelector(state => state.auth);
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);

    const [form, setForm] = useState({period: '', amount: ''})
    const [minimum,] = useState(5000);
    const [message, setMessage] = useState({status: '', message: ''});
    const dispatch = useDispatch();

    useEffect(() => {
        if(!isAuthenticated)
            history.replace('/');
    },  [isAuthenticated]);


    const submit = () => {
        if (form.period !== '' && form.amount !== ''){
            validate();
            dispatch({type: SET_LOADING_PROP, payload: {show: true, message: ''}});
            updateDepositLimit(form).then((res) => {
                dispatch({type: SET_LOADING_PROP, payload: {show: false, message: ''}});

                if(res.success) {
                    setMessage({...message, status: 'success', message: `${form.period} Limit successfully updated to ${SportsbookGlobalVariable.Currency} ${formatNumber(form.amount)}`});
                    setForm({...form, amount: '', period: ''});
                } else {
                    setMessage({...message, status: 'error', message: res.message});
                }
            })
        } else {
            setMessage({
                ...message,
                status: 'error',
                message: 'Please fill out the form correctly'
            })
        }
    }

    const validate = () => {
        const dailyLimit = user.settings?.daily_deposit_limit;
        const weeklyLimit = user.settings?.weekly_deposit_limit;
        const monthlyLimit = user.settings?.monthl_deposit_limit;

        switch (form.period) {
            case 'daily':
                if (dailyLimit && (parseFloat(dailyLimit) > parseFloat(form.amount))) {
                    setMessage({...message, status: 'error', message: `Daily limit must be higher than ${dailyLimit}` })
                    return;
                }
                if (parseFloat(form.amount) < minimum) {
                    setMessage({...message, status: 'error', message: `Daily limit must be higher than ${minimum}` });
                    return;
                }
                break;

            case 'weekly':
                if (dailyLimit && (parseFloat(dailyLimit) > parseFloat(form.amount))) {
                    setMessage({...message, status: 'error', message: `Daily limit must be higher than ${dailyLimit}` })
                    return;
                }
                if (weeklyLimit && (parseFloat(weeklyLimit) > parseFloat(form.amount))) {
                    setMessage({...message, status: 'error', message: `Weekly limit must be higher than ${weeklyLimit}` })
                    return;
                }
                if (parseFloat(form.amount) < minimum) {
                    setMessage({...message, status: 'error', message: `Weekly limit must be higher than ${minimum}` });
                    return;
                }
                break;
            case 'monthly':
                if (dailyLimit && (parseFloat(dailyLimit) > parseFloat(form.amount))) {
                    setMessage({...message, status: 'error', message: `Daily limit must be higher than ${dailyLimit}` })
                    return;
                }
                if (weeklyLimit && (parseFloat(weeklyLimit) > parseFloat(form.amount))) {
                    setMessage({...message, status: 'error', message: `Weekly limit must be higher than ${weeklyLimit}` })
                    return;
                }
                if (monthlyLimit && (parseFloat(monthlyLimit) > parseFloat(form.amount))) {
                    setMessage({...message, status: 'error', message: `Monthly limit must be higher than ${monthlyLimit}` })
                    return;
                }
                if (parseFloat(form.amount) < minimum) {
                    setMessage({...message, status: 'error', message: `Weekly limit must be higher than ${minimum}`});
                    return;
                }
                break;
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
          <div className="page-title"> Account Limits</div>
          <div className="account page__body bg-white">
              <div className="form bg-white">
                  <div className="p15 currentLimitsForm" id="currentLimitsForm">
                      {message.status === 'success' &&
                        <div id="dvNot" className="callout green">
                            <strong>{message.message}</strong>
                        </div>
                      }
                      <div className="form-row">
                          <h4 className="txt-blue">What are Deposit Limits?</h4>
                          <p>You can set the maximum amount you wish to deposit in a selected period of time.</p>
                      </div>
                      <div className="currentLimitsForm">
                          <div className="bg-lightgray mt15 p10 activeLimitsContainer">
                              <strong>Active Deposit Limit</strong>
                              <hr className="my10" />
                              <div className="activeLimitsList">
                                  <div className="table-a">
                                      <div>Daily Limit:</div>
                                      <div className="txt-r">
                                          <strong>
                                              {user.settings?.daily_deposit_limit && parseFloat(user.settings?.daily_deposit_limit) > 0 ?
                                                  SportsbookGlobalVariable.Currency + ' ' +user.settings?.daily_deposit_limit
                                                  :
                                                  'No Limits'
                                              }
                                          </strong>
                                      </div>
                                  </div>
                                  <div className="table-a">
                                      <div>Weekly Limit:</div>
                                      <div className="txt-r">
                                          <strong>
                                              {user.settings?.weekly_deposit_limit && parseFloat(user.settings?.weekly_deposit_limit) > 0 ?
                                                  SportsbookGlobalVariable.Currency + ' ' +user.settings?.weekly_deposit_limit
                                                  :
                                                  'No Limits'
                                              }
                                          </strong>
                                      </div>
                                  </div>
                                  <div className="table-a">
                                      <div>Monthly Limit:</div>
                                      <div className="txt-r">
                                          <strong>
                                              {user.settings?.monthly_deposit_limit && parseFloat(user.settings?.monthly_deposit_limit) > 0 ?
                                                  SportsbookGlobalVariable.Currency + ' ' +user.settings?.monthly_deposit_limit
                                                  :
                                                  'No Limits'
                                              }
                                          </strong>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <hr className="m0" />
                  <div className="p15">
                      <form id="deposit-limit-form-mobile" role="form" action="#">
                          <div className="form-row mt15">
                              <div className="form-label">
                                  <span>Time Period</span>
                              </div>
                              <div className="form-select">
                                  <select id="limitPeriod" onChange={(e) => {
                                      setForm({...form, period: e.target.value})
                                      setMessage({...message, status: ''})
                                  }}
                                     value={form.period}
                                  >
                                      <option value="">Please Select</option>
                                      <option value="daily">Daily Limit</option>
                                      <option value="weekly">Weekly Limit</option>
                                      <option value="monthly">Monthly Limit</option>
                                  </select>
                                  <div className="form-select--hide-arrow" />
                              </div>
                          </div>
                          <div className="form-row">
                              <div className="form-label">
                                  <strong>Deposit Amount</strong>
                              </div>
                              <div className="form-input hasCurrency">
                                  <div className="form-input--currency">{SportsbookGlobalVariable.Currency}</div>
                                  {/* @ts-ignore */}
                                  <input
                                      className="big"
                                      onChange={(e) => setForm({...form, amount: e.target.value})}
                                      value={form.amount}
                                      id="limitAmount" name="limitAmount" autoComplete="off"
                                  />
                                  <div className="form-input--stake">Min: {formatNumber(minimum)}</div>
                              </div>
                              {message.status === 'error' && <div className="form--error errorMessage">{message.message}</div>}
                          </div>
                          <button
                              className="btn mt15"
                              id="updtDepositLimits"
                              disabled={message.status === 'error'}
                              type="submit"
                              onClick={submit}
                              style={{width: '100%', borderStyle:'none'}}
                          >
                              Update Deposit Limits
                          </button>
                      </form>
                  </div>

              </div>
          </div>
      </Layout>
  );
};

export default AccountLimits;
