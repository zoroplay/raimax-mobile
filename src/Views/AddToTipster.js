import React, {useState} from 'react';
import Layout from "./Layout";
import {useSelector} from 'react-redux';
import {saveTipsterBet} from "../Services/apis";
import {toast} from "react-toastify";


const percentages = [
    { text: '10%', value: 10 },
    { text: '15%', value: 15 },
    { text: '20%', value: 20 },
    { text: '25%', value: 25 },
    { text: '30%', value: 30 },
];
const AddToTipster = ({history}) => {
    // @ts-ignore
    const {tipsterBetslip: betslip_id} = useSelector(state => state.couponData);
    const [tipsterForm, setTipsterForm] = useState({
        percentage: 10,
        minimum_stake: 20,
        betslip_id,
    });
    const [errMsg, setErrMsg] = useState(false);
    const [loading, setLoading] = useState(false);


    const submitForm = (e) => {
        e.preventDefault();
        if (tipsterForm.minimum_stake < 20) {
            toast.error('Minimum allowed stake amount is 20')
            return;
        }
        setLoading(true);

        saveTipsterBet(tipsterForm).then((res) => {
            setLoading(false);
            if (res.success) {
                history.replace('/')
                toast.success('Betslip has been added to your tipster account')
            }
        }).catch(err => {
            setLoading(false);
            toast.error( 'Something went wrong ' + err.message)
        })

    }

    return (
        <Layout>
            <div className="callout-sb">
                <div>Add Betslip to Tipster</div>
            </div>
            <div className="credentials" style={{display: 'block' }}>
                <p className="txt-gray">Becoming a Tipster allows you earn extra cash from others that play your tickets.
                    You earn by making any of your betslip public, set the percentage on return you want from each person that plays your pick.
                    You only earn if you betslip is a winning betslip.</p>
                <div className="mt15">
                    <label className="txt-gray">
                        Set the percentage you want from winnings
                        <select
                            value={tipsterForm.percentage}
                            onChange={(e) => setTipsterForm({...tipsterForm, percentage: parseInt(e.detail.value)})}
                        >
                            {percentages.map(row => <option value={row.value}>{row.text}</option>)}
                        </select>
                    </label>
                </div>
                <div className="mt15">
                    <label className="txt-gray">
                        Set the minimum stake allowed for this pick
                        <input
                            type="number"
                            name="coupon-code"
                            className="credentials__input mt10"
                            min={20}
                            autoComplete="off"
                            value={tipsterForm.minimum_stake}
                            // @ts-ignore
                            onChange={(e) => setTipsterForm({...tipsterForm, minimum_stake: e.target.value})}
                        />
                    </label>
                </div>
                <button className="btn w-full mt15" onClick={submitForm}>Submit</button>
            </div>
        </Layout>
    );
};

export default AddToTipster;
