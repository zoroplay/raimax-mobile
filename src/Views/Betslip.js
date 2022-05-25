import React, {useLayoutEffect, useState} from "react";
import Layout from "./Layout";
import {useDispatch, useSelector} from "react-redux";
import {goBack} from "../Utils/helpers";
import BetPlaced from "./Components/BetPlaced";
import Selections from "./Components/Selections";
import {CANCEL_BET, SET_BET_PLACED, SET_TIPSTER_BETSLIPID} from "../Redux/types";

export default function Betslip({ history }) {
    const {coupon, betPlaced} = useSelector((state) => state.couponData);
    const {isAuthenticated} = useSelector((state) => state.auth);
    const [keep, setKeep] = useState(false);
    const dispatch = useDispatch();

    const closeBet = () => {
        if (!keep)
            dispatch({type: CANCEL_BET});

        dispatch({type: SET_BET_PLACED, payload: {}})
    }

    useLayoutEffect(() => {
        document.getElementsByClassName('app')[0].classList.add('hide-footer');

        return () => {
            document.getElementsByClassName('app')[0].classList.remove('hide-footer');
        }
    }, []);

    const goTo = (path) => {
        history.push(path);
    }

    const showTipster = () => {
        dispatch({type: SET_TIPSTER_BETSLIPID, payload: betPlaced?.coupon.betslip_id});
        history.push('/add-to-tipster');
    }

    return (
        <Layout
            footer={false}
            headerLeft={
                <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                    <i className="icon-back" />
                    <span className="d-ib ml5">Back</span>
                </div>
            }>
            {coupon?.selections?.length ? (
                betPlaced?.success ?
                    <BetPlaced selections={coupon.selections} coupon={betPlaced?.coupon} type={betPlaced?.type} />
                    :
                    <Selections coupon={coupon} dispatch={dispatch} />
            ): (
                <div className="p10 txt-c">
                    <div className="m20">There are no selections in your betslip.</div>
                    <button onClick={() => goTo('/')} className="pos-f btn btn-gray mt20" id="emptyPlacebetCloseButton">Close betslip</button>
                    {!isAuthenticated && <div className="table-f p20 mt20">
                        <div className="pr15">
                            <button onClick={() => goTo('/register')} className="btn w-full yellow" id="emptyPlacebetRegisterButton">Register</button>
                        </div>
                        <div className="pl15">
                            <button onClick={() => goTo('/login')} className="btn w-full" id="emptyPlacebetLoginButton">Login</button>
                        </div>
                    </div>}
                </div>
            )}
            {betPlaced?.success &&
            <div className="continue table-a">
                <div className="checkbox">
                    <input id="c-02" type="checkbox" defaultChecked={keep}
                           onChange={(e) => setKeep(!keep)} />
                    <label htmlFor="c-02" className="checkbox__content">
                        <div className="checkbox__box"/>
                        <span className="checkbox__label ml10">Keep Selections</span>
                    </label>
                </div>
                <button className="btn green pull-right" style={{width: '120px', borderRadius: '0'}} onClick={showTipster}>Add To Tipster</button>
                <button className="btn pull-right" onClick={closeBet}>Continue</button>
            </div>}
          </Layout>
      );
}
