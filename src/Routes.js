import React, { Fragment } from "reactn";
/**
 * packages
 */
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ScrollToTop } from "./Views/Components";
import NotFound from "./Views/NotFound";
import Home from "./Views/Home";
import Login from "./Views/Auth/Login";
import ViewFixture from "./Views/ViewFixture";
import Sport from "./Views/Sport";
import ViewFixtures from "./Views/ViewFixtures";
import Betslip from "./Views/Betslip";
import CouponCheck from "./Views/CouponCheck";
import BookBet from "./Views/BookBet";
import CouponCheckResult from "./Views/CouponCheckResult";
import Deposit from "./Views/Account/Deposit";
import DepositCard from "./Views/Account/DepositCard";
import DepositType from "./Views/Account/DepositType";
import Register from "./Views/Auth/Register";
import DailyBundle from "./Views/DailyBundle";
import MyBets from "./Views/Account/MyBets";
import ZoomFixtures from "./Views/ZoomFixtures";
import Account from "./Views/Account/Index";
import ChangePassword from "./Views/Account/ChangePassword";
import Withdrawal from "./Views/Account/Withdrawal";
import CMSPages from "./Views/CMSPages";
import BecomeAnAgent from "./Views/BecomeAnAgent/Register";
import Live from "./Views/Live";
import ViewLiveFixture from "./Views/ViewLiveFixture";
import ForgotPassword from "./Views/Auth/ForgotPassword";
import Verify from "./Views/Auth/Verify";
import ResetPassword from "./Views/Auth/ResetPassword";
import { useEffect } from "react";
import useSWR from "swr";

import { LEcho } from "./Utils/laravel-echo";
import { useDispatch, useSelector } from "react-redux";
import {
  REMOVE_USER_DATA,
  SET_BONUS_LIST,
  SET_GLOBAL_VAR,
  UPDATE_USER_BALANCE,
  UPDATE_USER_DATA,
  UPDATE_VIRTUAL_LINK,
} from "./Redux/types";
import { useIdleTimer } from "react-idle-timer";
import { authDetails, sendLogout } from "./Services/apis";
import { generateSignature } from "./Utils/helpers";
import Virtual from "./Views/Virtual";
import Jackpot from "./Views/Jackpot";
import AddToTipster from "./Views/AddToTipster";
import TipsterBets from "./Views/TipsterBets";
import AccountDetails from "./Views/Account/AccountDetails";
import MarketingPreferences from "./Views/Account/MarketingPreferences";
import SelfExclusion from "./Views/Account/SelfExclusion";
import ResponsibleGambling from "./Views/Account/ResponsibleGambling";
import AccountLimits from "./Views/Account/AccountLimits";
import CloseAccount from "./Views/Account/CloseAccount";
import Cashier from "./Views/Account/Cashier";
import Transactions from "./Views/Account/Transactions";
import Pending from "./Views/Account/PendingWithdrawal";
import AccountSettings from "./Views/Account/AccountSettings";
import SportsBonus from "./Views/Account/SportsBonus";
import Casino from "./Views/Casino";
import WithdrawToBank from "./Views/Account/WithdrawToBank";
import SearchFixtures from "./Views/SearchFixtures";
import DepositShop from "./Views/Account/DepositShop";

export default function Routes() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const { data: sportsGlobalVar } = useSWR("/utilities/globalvariables");
  const { data: bonusList } = useSWR("/utilities/bonuslist?section=onliners");
  const dispatch = useDispatch();

  useEffect(() => {
    if (sportsGlobalVar) {
      dispatch({ type: SET_GLOBAL_VAR, payload: sportsGlobalVar });
    }

    if (bonusList) dispatch({ type: SET_BONUS_LIST, payload: bonusList });
  }, [sportsGlobalVar, bonusList]);

  useEffect(() => {
    if (isAuthenticated) {
      LEcho.channel(`deposits.${user.username}`).listen("DepositEvent", (e) => {
        dispatch({ type: UPDATE_USER_BALANCE, payload: e.user.available_balance });
        // show alert
      });
    }
  }, [isAuthenticated]);

  const handleOnIdle = (event) => {
    if (isAuthenticated) {
      sendLogout()
        .then((res) => {
          dispatch({ type: REMOVE_USER_DATA });
        })
        .catch((err) => {
          dispatch({ type: REMOVE_USER_DATA });
        });
    }
  };

  const handleOnActive = (event) => {
    // console.log('user is active', event)
    // console.log('time remaining', getRemainingTime())
  };

  const handleOnAction = (e) => {
    // console.log('user did something', e)
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 30,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
  });

  useEffect(() => {
    if (isAuthenticated) {
      authDetails().then((resp) => {
        if (resp.user) {
          const user = resp.user;
          dispatch({
            type: UPDATE_USER_DATA,
            payload: user,
          });
          dispatch({
            type: UPDATE_VIRTUAL_LINK,
            payload: `${
              process.env.REACT_APP_GLOBALBET_PROD
            }/engine/web/autologin/account?login=${user.username}-${
              process.env.REACT_APP_GLOBALBET_ID
            }&code=${
              user.auth_code
            }&webRedirectTo=%2Fresponsive%2Fext%2Fskinbs%2Fvspro.jsp%3FhomeUrl%3D${
              process.env.REACT_APP_SITE_URL
            }%26signature%3D${generateSignature()}%26agent=${
              process.env.REACT_APP_GLOBALBET_ID
            }_WEB`,
          });
        }
      });
    }
  }, [isAuthenticated]);

  return (
    <Fragment>
      <Router>
        <ScrollToTop />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/reset-password" component={ResetPassword} />
          <Route exact path="/verify" component={Verify} />
          <Route exact path="/virtual" component={Virtual} />
          <Route exact path="/jackpot" component={Jackpot} />
          <Route exact path="/casino" component={Casino} />
          <Route exact path="/betslip" component={Betslip} />
          <Route path="/add-to-tipster" component={AddToTipster} exact={true} />
          <Route
            path="/tipster/bets/:id"
            component={TipsterBets}
            exact={true}
          />
          <Route exact path="/coupon-check" component={CouponCheck} />
          <Route exact path="/book-a-bet" component={BookBet} />

          <Route exact path="/account/cashier" component={Cashier} />
          <Route exact path="/account/details" component={AccountDetails} />
          {/* <Route exact path="/account/deposit" component={Deposit} /> */}
          <Route exact path="/account/deposit" component={DepositType} />
          <Route exact path="/account/deposit/card" component={DepositCard} />
          <Route exact path="/account/deposit/shop" component={DepositShop} />
          <Route exact path="/account/bonuses" component={SportsBonus} />
          <Route exact path="/account/withdraw" component={Withdrawal} />
          <Route
            exact
            path="/account/withdraw-to-bank"
            component={WithdrawToBank}
          />
          <Route exact path="/account/my-bets" component={MyBets} />
          <Route exact path="/account/transactions" component={Transactions} />
          <Route exact path="/account/pending" component={Pending} />
          <Route
            exact
            path="/account/self-exclusion"
            component={SelfExclusion}
          />
          <Route
            exact
            path="/account/responsible-gambling"
            component={ResponsibleGambling}
          />
          <Route
            exact
            path="/account/account-limits"
            component={AccountLimits}
          />
          <Route exact path="/account/close-account" component={CloseAccount} />
          <Route
            exact
            path="/account/settings/change-password"
            component={ChangePassword}
          />
          <Route
            exact
            path="/account/settings/marketing-preferences"
            component={MarketingPreferences}
          />
          <Route exact path="/account/settings" component={AccountSettings} />
          <Route exact path="/account" component={Account} />

          <Route
            exact
            path="/BecomeAnAgent/Register"
            component={BecomeAnAgent}
          />
          <Route exact path="/dailybundle/soccer" component={DailyBundle} />
          <Route exact path="/soccer/search" component={SearchFixtures} />
          <Route exact path="/pages/:slug" component={CMSPages} />
          <Route
            exact
            path="/couponCheckResult/:betslip"
            component={CouponCheckResult}
          />
          <Route exact path="/sport/zoomsoccer" component={ZoomFixtures} />
          <Route exact path="/sport/livebetting" component={Live} />
          <Route
            exact
            path="/liveEventDetail/:sport/:tournament/:event/:eventId"
            component={ViewLiveFixture}
          />

          <Route exact path="/sport/:sport/:sid" component={Sport} />
          <Route
            exact
            path="/events/:sport/:tournament/:tid"
            component={ViewFixtures}
          />
          <Route
            exact
            path="/eventdetail/:sport/:country/:tournament/:event/:eventId"
            component={ViewFixture}
          />
          <Route path={["/404", "*"]} component={NotFound} />
        </Switch>
      </Router>
    </Fragment>
  );
}
