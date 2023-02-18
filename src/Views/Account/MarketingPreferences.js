import React, {useEffect} from 'react';
import Layout from "../Layout";
import {useSelector} from 'react-redux';
import {goBack} from "../../Utils/helpers";

const MarketingPreferences = ({history}) => {
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
          <div className="page-title"> Marketing Preferences</div>
          <div className="callout green" id="dvNotification" style={{display: 'none'}}>
              Communication preferences updated succesfully.
          </div>
          <div className="account bg-white preferences">
              <h3>Let's Keep in Touch</h3>
              <p>Help us improve your experience with {process.env.REACT_APP_NAME} through better communication.</p>
              <p className="mt0">Enable email and SMS communications and never miss out a bonus!</p>
              <p>Please adjust your communication preferences below.</p>
              <p className="preferences__text" />
              <hr />
              <div className="preferences__options">
                  <div className="checkbox">
                      {/* @ts-ignore */}
                      <input type="checkbox" id="selectEmail" name="group-1" data-role="none" checked="checked" />
                      <label htmlFor="selectEmail">
                          <span className="icon" />
                          <span className="option"><strong>Email communications</strong> - these emails may include special offers, notifications of bonus funds, limited-time events or promocodes.</span>
                      </label>
                  </div>
              </div>
              <hr />
              <div className="preferences__options">
                  <div className="checkbox">
                      {/* @ts-ignore */}
                      <input type="checkbox" id="selectSms" name="group-2" data-role="none" checked="checked" />
                      <label htmlFor="selectSms">
                          <span className="icon"></span>
                          <span className="option">
                              <strong>SMS communications</strong> - these messages may include the above as well as password reset communications. Please ensure your DND filter is OFF
                          </span>
                      </label>
                  </div>
              </div>
              <hr />
              <div className="preferences__options">
                  <div className="checkbox">
                      {/* @ts-ignore */}
                      <input type="checkbox" id="selectPopup" name="group-3" data-role="none" checked="checked" />
                      <label htmlFor="selectPopup">
                          <span className="icon"></span>
                          <span className="option">
                              <strong>Promotional pop-up&nbsp;</strong>- these messages may include promotional communication, bonus offers, special events or promocodes</span>
                      </label>
                  </div>
              </div>
              <hr />
              <div id="btnSave" className="btn my20">Update my preferences</div>
              <span id="spinner" style={{display: 'none'}}>
                  <img src="https://cnt.bet9ja.com/cdn/bet9ja/account/img/mobile/loading.gif?v=1616059196" />
              </span>
          </div>
      </Layout>
  );
};

export default MarketingPreferences;
