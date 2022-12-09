import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {formatNumber, toggleAccountMenu} from "../../Utils/helpers";
import {REMOVE_USER_DATA, UPDATE_USER_BALANCE} from "../../Redux/types";
import {NavLink, useHistory} from 'react-router-dom';
import {authDetails, sendLogout} from "../../Services/apis";

export default function AccountMenu({showDownload}) {
    const {user} = useSelector((state) => state.auth);
    const [refreshing, setRefresh] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    const logout = () => {
        // toggleAccountMenu();
        history.push('/');
        sendLogout().then(res => {
            dispatch({type: REMOVE_USER_DATA});
        }).catch (err => {
            dispatch({type: REMOVE_USER_DATA});
        });
    }

    const refreshBalance = () => {
        setRefresh(true);
        authDetails().then(resp => {
            setRefresh(false);
            if(resp.user) {
                const user = resp.user;
                dispatch({
                    type: UPDATE_USER_BALANCE,
                    payload: user.available_balance
                });
            }
        }).catch(err => {
            setRefresh(false);

        });
    }
    return (
        <div className={`myacc-s__wrap ${showDownload ? 'myacc-s__wrap-pt' : ''}`}>
            <div className="myacc-ddmenu-s">
                <div className="myacc-ddmenu-s__balance table">
                    <div className="myacc-ddmenu-s__balance-td table-cell pl10">
                        <div className="table">
                            <div id="myaccountmenu_refresh" className="myacc-ddmenu-s__balance-refresh table-cell" onClick={refreshBalance}/>
                            <div className="myacc-ddmenu-s__balance-hold table-cell txt-l pl10 mt5">
                                <div className="myacc-ddmenu-s__balance-head">Withdrawable</div>
                                <div className="myacc-ddmenu-s__balance-amount">{formatNumber(user.balance)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="myacc-ddmenu-s__balance-td bonus table-cell pr10">
                        <div className="table">
                            <NavLink to="/account/deposit" onClick={toggleAccountMenu} id="myaccountmenu_deposit" style={{color: 'white'}}
                                 className="myacc-ddmenu-s__balance-deposit table-cell txt-c">Deposit
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className="myacc-ddmenu-s__bonus">
                    <div>
                        <span className="myacc-ddmenu-s__bonus-label">Sports Bonus</span>&nbsp;
                        <span className="myacc-ddmenu-s__bonus-amount">{user.bonus_balance}</span>
                    </div>
                </div>
                <table className="myacc-ddmenu-s-table txt-c" onClick={toggleAccountMenu}>
                    <tbody>
                    <tr>
                        <td id="myaccountmenu_myaccount" className="myacc-ddmenu-s-table__td pt15 pb15">
                            <NavLink to="/account" className="myacc-ddmenu-s-table__td-txt">My Account</NavLink>
                        </td>
                        <td className="myacc-ddmenu-s-table__td pt15 pb15">
                            <NavLink to="/account/my-bets" id="myaccountmenu_mybetsbutton" className="myacc-ddmenu-s-table__td-txt">My Bets</NavLink>
                        </td>
                    </tr>
                    <tr>
                        <td id="myaccountmenu_bank" className="myacc-ddmenu-s-table__td pt15 pb15">
                            <NavLink to="/account/cashier" className="myacc-ddmenu-s-table__td-txt">Cashier</NavLink>
                        </td>
                        <td id="myaccountmenu_messages" className="myacc-ddmenu-s-table__td pt15 pb15">Messages</td>
                    </tr>
                   {/* <tr>
                        <td id="myaccountmenu_sportBonus" className="myacc-ddmenu-s-table__td pt15 pb15">Sports Bonus
                        </td>
                        <td id="myaccountmenu_casinoBonus" className="myacc-ddmenu-s-table__td pt15 pb15">Casino Bonus
                        </td>
                    </tr>*/}
                    <tr>
                        <td id="myaccountmenu_sportBonus" className="myacc-ddmenu-s-table__td pt15 pb15">
                            <NavLink to="/account/bonuses" className="myacc-ddmenu-s-table__td-txt">Sports Bonus</NavLink>
                        </td>
                        <td
                            onClick={logout}
                            id="myaccountmenu_logout"
                            className="myacc-ddmenu-s-table__td pt15 pb15">Logout</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="myacc-ddmenu-s-user">
                <div className="myacc-ddmenu-s-user__wrap">
                    <div>
                        <div className="myacc-ddmenu-s-user__head">Account ID:</div>
                        <div className="myacc-ddmenu-s-user__val mb15">{user.code}</div>
                        <div className="myacc-ddmenu-s-user__head">Username:</div>
                        <div className="myacc-ddmenu-s-user__val">{user.username}</div>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    );
}
