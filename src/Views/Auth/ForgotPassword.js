import React, {useRef, useState} from "react";
import Layout from "../Layout";
import {formattedPhoneNumber, goBack} from "../../Utils/helpers";
import {useDispatch} from "react-redux";
import {confirmVerification, sendVerification} from "../../Services/apis";
import {toast} from "react-toastify";
import {UPDATE_USERNAME} from "../../Redux/types";


export default function ForgotPassword({history}) {
  const [sending, setSending] = useState(false);
  const [otpStatus, setOtpStatus] = useState({loading: false, status: ''});
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const dispatch = useDispatch();

  const [otpRef, setOtpRef] = useState({
    otp1: useRef(),
    otp2: useRef(),
    otp3: useRef(),
    otp4: useRef(),
    otp5: useRef(),
    otp6: useRef()
  });

  const sendSMS = async (username) => {
    if (username !== '') {
      setSending(true);
      await sendVerification({username}).then(res => {
        setSending(false);
        setUsername(username);
        toast.success('Please check your phone for your verification code')
      }).catch(err => {
        setSending(false);

        toast.error('Unable to send SMS. Please try again');
      });
    }
  }

  const confirmOtp = async (otp) => {
    setOtpStatus({...otpStatus, loading: true});
    await confirmVerification({otp, username}).then(res => {
      setOtpStatus({...otpStatus, loading: false});
      if (res.success) {
        dispatch({type: UPDATE_USERNAME, payload: username});
        setOtpStatus({...otpStatus, status: 'true'});
        setTimeout(() => {
          history.push('/reset-password');
        }, 2000);
      } else {
        setOtpStatus({...otpStatus, status: 'false'});
        toast.error(res.message);
      }
    }).catch(err => {
      setOtpStatus({...otpStatus, loading: false});
      toast.error('Invalid verification code.');
    });
  }

  const otpController = (e, next, prev, index) => {

    if (e.target.value.length < 1 && prev) {
      const code = otp.slice(0, -1);
      if (index === 1) {
        setOtp(code);
      } else {
        setOtp('');
      }
      prev.current.focus();
    } else if (next && e.target.value.length > 0) {
      const code = otp + e.target.value;
      // add value to code
      setOtp(code);
      next.current.focus();
    } else {
      const code = otp + e.target.value;
      // add value to code
      setOtp(code);
      if (index === 5) {
        confirmOtp(parseInt(code));
      }
      return 0;
    }
  }

  return (
    <Layout
        bottom={false}
        headerLeft={
          <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
            <i className="icon-back" />
            <span className="d-ib ml5">Back</span>
          </div>
        }
        headerRight="&nbsp;"
    >
      <div className="login-form">
        <div className="login-form__wrap">
          <div className="login-form__heading" style={{marginBottom: '50px'}}>
            <p>Enter your registered phone number to reset your password </p>
          </div>
          <div className="dnxreg-box">
            <div className="dnxreg-box-a">
              <label htmlFor="" className="nxlabel">Mobile Number*</label>
            </div>
            <div className="dnxreg-box-b">
              <div className="nxmob">
                <select name="" id="" className="nxmob-select">
                  <option value="+254">+234</option>
                </select>
                <input className="form-input" type="text" autoComplete="username"
                       placeholder="Username" value={username} onChange={(e) => {setUsername(e.target.value)} } />
              </div>
            </div>
          </div>
          <div className="aqx-loax-b" style={{marginBottom: '30px'}}>
            <button
                type="button"
                className="aqx-loax-btn"
                onClick={() => sendSMS(formattedPhoneNumber(username))}
                disabled={sending}
            >Send code {sending && <i className="fa fa-spin fa-spinner" /> }</button>
          </div>
          <div className="aqx-loax-c">

            <div className="dnxreg-box">
              <div className="dnxreg-box-a">
                <label htmlFor="" className="nxlabel">Code from SMS*</label>
              </div>
              <div className="dnxreg-box-b smsx-code">
                <input type="text" ref={otpRef.otp1} className="nxfield" onChange={(e) => otpController(e, otpRef.otp2, '', 0)} placeholder="-" maxLength={1} />
                <input type="text" ref={otpRef.otp2} className="nxfield" onChange={(e) => otpController(e, otpRef.otp3, otpRef.otp1, 1)} placeholder="-" maxLength={1} />
                <input type="text" ref={otpRef.otp3} className="nxfield" onChange={(e) => otpController(e, otpRef.otp4, otpRef.otp2, 2)} placeholder="-" maxLength={1} />
                <input type="text" ref={otpRef.otp4} className="nxfield" onChange={(e) => otpController(e, otpRef.otp5, otpRef.otp3, 3)} placeholder="-" maxLength={1} />
                <input type="text" ref={otpRef.otp5} className="nxfield" onChange={(e) => otpController(e, otpRef.otp6, otpRef.otp4, 4)} placeholder="-" maxLength={1} />
                <input type="text" ref={otpRef.otp6} className="nxfield" onChange={(e) => otpController(e, '', otpRef.otp5, 5)} placeholder="-" maxLength={1} />
                <div style={{margin: 'auto'}}>
                  {otpStatus.loading ?
                      <i className="fa fa-spin fa-spinner" style={{color: 'white'}} />
                      :
                      {
                        'true': <i className="fa fa-check" style={{color: 'green'}} />,
                        'false': <i className="fa fa-times" style={{color: 'red'}} />
                      }[otpStatus.status]
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
