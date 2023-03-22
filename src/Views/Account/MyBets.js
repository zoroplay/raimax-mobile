import React, {useEffect, useState} from 'react';
import Layout from "../Layout";
import moment from "moment";
import {getOpenBets, getSettledBets} from "../../Services/apis";
import {SingleSlip} from "../Components/SingleSlip";
import {SingleSlipSkeleton} from "../Components/SingleSlipSkeleton";
import DatePicker from "react-datepicker";
import {goBack} from "../../Utils/helpers";
import {useSelector} from "react-redux";


const MyBets = ({history}) => {
    const n = 5;
    const [activeTab, setActiveTab] = useState('open');
    const [loading, setLoading] = useState(false);
    const [betslips, setBetslips] = useState([]);
    const [form, setForm] = useState({
        period: 7,
        from: moment().subtract(1, 'w').toDate(),
        to: moment().toDate(),
    });

    const {isAuthenticated} = useSelector(state => state.auth);

    useEffect(() => {
        if(!isAuthenticated)
            history.replace('/');
    },  [isAuthenticated]);

    const changeTabs = (tab) => {
        setActiveTab(tab);

        if (tab === 'open') {
            openBets();
        } else {
            settledBets();
        }
    }

    const openBets = () => {
        setLoading(true);
        getOpenBets().then((res) => {
            setLoading(false);
            setBetslips(res.bets);
        }).catch(err => {
            setLoading(false);
            console.log(err);
        })
    }

    const settledBets = () => {
        setLoading(true);
        getSettledBets({
            from: moment(form.from).format('YYYY-MM-DD'),
            to: moment(form.to).format('YYYY-MM-DD')
        }).then((res) => {
            setLoading(false);
            setBetslips(res.bets.data);
        }).catch(err => {
            setLoading(false);
            console.log(err);
        })
    }

    useEffect(() => {
        openBets();
    }, []);

    const toggleSettings = (e) => {
        const ele = document.getElementById('filter-settings')
        ele.classList.toggle('opened');
    }

    const handlePeriodChange = e => {
        const {value} = e.target;
        switch (value) {
            case '1':
                setForm({
                    ...form,
                    period: value,
                    from: moment().toISOString(),
                    to: moment().toISOString()
                });
                break;
            case '7':
                setForm({
                    ...form,
                    period: value,
                    from: moment().subtract(1, 'w').toISOString(),
                    to: moment().toISOString()
                });
                break;
            case '30':
                setForm({
                    ...form,
                    period: value,
                    from: moment().subtract(30, 'days').toISOString(),
                    to: moment().toISOString()
                });
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
            <nav className="bets-nav table-f">
                <a href="javascript:;" onClick={() => changeTabs('open')} title="Open Bets" className={`bets-nav__elem ${(activeTab === 'open')? 'active' : ''}`}>Open Bets</a>
                <a href="javascript:;" onClick={() => changeTabs('settled')} title="Settled" className={`bets-nav__elem ${(activeTab === 'settled') ? 'active' : ''}`}>Settled</a>
            </nav>
            {activeTab === 'settled' &&
            <div className="mybets-filter wrap" id="filter-settings">
                <div className="mybets-filter__title pt15 pb15 pl15" onClick={toggleSettings}><span>Filter Bets</span></div>
                <div className="filter__settings">
                    <div className="form p15">
                        <div className="form-row">
                            <div className="form-label"><span>Date Range</span></div>
                            <div className="form-select">
                                <select value={form.period} onChange={handlePeriodChange}>
                                    <option value="1">Last 7 Days</option>
                                    <option value="0">Last 24 Hours</option>
                                    <option value="2">Last 30 Days</option>
                                    <option value="3">Custom Date</option>
                                </select>
                                <div className="form-select--hide-arrow"/>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="divide-holder">
                                <div className="one-half">
                                    <div className="form-label">
                                        <span>Date From</span>
                                    </div>
                                    <div className="form-select">
                                        <DatePicker
                                            dateFormat="dd/MM/yyyy"
                                            selected={form.from}
                                            className="custom-datepicker hasDatepicker"
                                            onChange={date => setForm({...form, from: date})} />
                                        <div className="form-select--hide-arrow" />
                                    </div>
                                </div>
                                <div className="one-half">
                                    <div className="form-label">
                                        <span>Date To</span>
                                    </div>
                                    <div className="form-select">
                                        <DatePicker
                                            dateFormat="dd/MM/yyyy"
                                            selected={form.to}
                                            className="custom-datepicker hasDatepicker"
                                            onChange={date => setForm({...form, to: date})} />
                                        <div className="form-select--hide-arrow" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="txt-red p10 txt-c">
                            <div className="m20">Please note: the maximum data range is 30 days.</div>
                        </div>
                        <button id="mybets_settled_filter_updateresult" className="mt15 btn w-full">Update Results
                        </button>
                    </div>
                </div>
                <div className="filter--mask"/>
            </div>
            }

            {!loading && betslips.length > 0 && betslips.map(betslip => <SingleSlip type={'betslip'} betslip={betslip} key={betslip.id} history={history} /> )}
            {!loading && betslips.length === 0 && <div className="p10 txt-c">
                <div className="m20">You have no {activeTab} bets.</div>
            </div>}
            {loading && [...Array(n)].map((ele, index) => <SingleSlipSkeleton key={index} /> )}
        </Layout>
    );
};

export default MyBets;
