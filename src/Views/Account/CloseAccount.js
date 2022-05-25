import React, {useEffect} from 'react';
import Layout from "../Layout";
import {formatNumber, goBack} from "../../Utils/helpers";
import {useSelector} from 'react-redux';

const CloseAccount = ({history}) => {
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);
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
          <div className="page-title"> Close Account</div>
          <div className="close-account-warning account bg-white">
              <div className="callout blue" id="info-box">
                  <strong>You have {`${SportsbookGlobalVariable.Currency} ${formatNumber(user.balance)}`} in your account.</strong>
              </div>
              <div className="p15">
                  <h4 className="txt-blue">Are you sure you wish to close your account?</h4>
                  <p>If you wish to use your account in the future you will need to contact support.</p>
                  <p className="mt20">If you decide to close your account,</p>
                  <p><strong> you will not be able to create a new one in the future.</strong>.</p>
                  <div className="btn red outline mt25 close-account-button">
                      Proceed with Closing Your Account
                  </div>
              </div>
          </div>
      </Layout>
  );
};

export default CloseAccount;
