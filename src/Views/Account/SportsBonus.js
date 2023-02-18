import React, {useEffect, useState} from 'react';
import Layout from "../Layout";
import {getBonuses} from "../../Services/apis";
import {useDispatch, useSelector} from 'react-redux';
import {formatDate, formatNumber, goBack} from "../../Utils/helpers";
import {toast} from "react-toastify";
import {SHOW_MODAL} from "../../Redux/types";

const SportsBonus = ({history}) => {
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);
    const {isAuthenticated, user} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if(!isAuthenticated)
            history.replace('/');
    },  [isAuthenticated]);

    const [bonuses, setBonuses] = useState([]);
    const [redeemable, setRedeemable] = useState({canRedeem: false, amount: 0});

    const toggle = (e) => {
        e.currentTarget.classList.toggle('opened');
    }

    useEffect(() => {
        fetchBonuses();
    }, []);

    const fetchBonuses = () => {
        getBonuses().then(r => {
            if(r.success) {
                setBonuses(r.data.bonuses);
                setRedeemable(r.data.redeem);
            } else {
                toast.error(r.message);
            }
        }).catch(err => {
            toast.error('Internal server eror');
        })
    }


    return (
        <Layout
            headerLeft={
                <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                    <i className="icon-back" />
                    <span className="d-ib ml5">Back</span>
                </div>
            }>
            <div className="page-title"> Sports Bonus</div>
            <div className="page__body p0">
                <div className="p15 bonus-page">
                    <div className="page__head-item input-holder">
                        <form autoComplete="off" noValidate="">
                            <div className="bonus">
                                <div className="bonus__item">
                                    <div className="input-group form-input" style={{display: 'flex'}}>
                                        <input name="bonusCode" placeholder=" Enter Bonus Code" value="" />
                                        <div className="btn green" disabled="" style={{height: '38px'}}> Add Bonus</div>
                                    </div>
                                    {/*<div className="form--error"> Bonus Code Required</div>*/}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="t-menu bonus-page p15"> Available Bonus Funds <span>{user.bonus_balance + ' ' + SportsbookGlobalVariable.Currency} </span></div>
                {redeemable.canRedeem && <div className="t-menu bonus-page p15">
                    <button className="btn green" onClick={() =>
                        dispatch({
                            type: SHOW_MODAL,
                            payload: {show: true, type: 'bonus', amount: redeemable.amount}})
                    }
                    > Redeem Bonus</button>
                </div>}
                <div className="accordion ">
                    {bonuses.map(bonus =>
                        <div className={`accordion__item ${bonus.status === 1 ? 'opened' : ''}`} onClick={toggle} key={bonus.id}>
                            <div className="accordion__header collapsible">
                                <div className="accordion-toggle"></div>
                                <div className="accordion__cnt">
                                    <div className="accordion__cnt-item "><strong>{bonus.bonus.name}</strong></div>
                                    <div className="accordion__cnt-item txt-r">
                                        <strong>{bonus.status === 1 ? 'Active' : 'Finished'}</strong></div>
                                </div>
                            </div>
                            <div className="accordion__body " tabIndex="0">
                                <div className="accordion__content"><h3
                                    className="txt-darkblue"> Bonus Sport
                                    Withdrawal</h3><p> Bets must be placed on events
                                    that will be settled BEFORE the bonus expires. Once
                                    the wagering has been completed, please ensure to
                                    redeem your bonus balance before the expiry date</p>
                                    <div className="progress greeen mt20">
                                        <div className="progress__bar">
                                            <div className="progress__fill"
                                                 style={{width: '0%'}}>
                                                <div className="progress__percent">0%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <table className="default mt20"
                                           style={{tableLayout: 'unset'}}>
                                        <thead>
                                        <tr>
                                            <th> Date</th>
                                            <th> Stake</th>
                                            <th> Remaining</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {bonus.transactions.map(transaction =>
                                            <tr>
                                                <td>{formatDate(transaction.created_at, 'DD/MM/YYYY, HH:mm')}</td>
                                                <td>
                                                    {(transaction.tranx_type === 'credit')? formatNumber(transaction.amount) : '-' + formatNumber(transaction.amount)}
                                                    {SportsbookGlobalVariable.Currency}
                                                </td>
                                                <td>
                                                    <strong>
                                                        {(transaction.tranx_type === 'credit')? formatNumber(transaction.to_user_balance) : formatNumber(transaction.from_user_balance)}
                                                        {SportsbookGlobalVariable.Currency}
                                                    </strong>
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                    {/*<div className="mt20 txt-c"><a
                                                                        href="https://promo.bet9ja.com/drm-sprts-jul-2021/"
                                                                        className="txt-blue"
                                                                        target="_blank"> Terms &amp; Conditions</a>
                                                                    </div>*/}
                                </div>
                            </div>
                        </div>)}
                </div>
            </div>
        </Layout>
    );
};

export default SportsBonus;
