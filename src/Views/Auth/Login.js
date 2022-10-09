import React, { useState } from "react";
import Layout from "../Layout";
import { goBack } from "../../Utils/helpers";
import { login } from "../../Services/apis";
import { useDispatch } from "react-redux";
import { SET_USER_DATA } from "../../Redux/types";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login({ history }) {
  const [phone, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const dispatch = useDispatch();
  // const [pre] = useState("+234");
  const [pre] = useState("+234");

  const submitForm = (e) => {
    if (phone === "" || password === "") {
      setError(true);
      return;
    }
    setError(false);
    const btn = e.target;
    btn.disabled = true;
    login({ username: phone, password })
      .then((res) => {
        btn.disabled = false;
        if (!res.success) {
          toast.error(res.message, { position: "top-right" });
          return;
        }
        dispatch({
          type: SET_USER_DATA,
          payload: {
            user: res.user,
            access_token: res.token,
            isAuthenticated: true,
          },
        });
        history.push("/");
      })
      .catch((err) => {
        btn.disabled = false;
        if (err.response.status === 401) {
          toast.error(err.response.data.error, { position: "top-right" });
          // setErrMsg(true);
        }
      });
  };

  return (
    <Layout
      bottom={false}
      headerLeft={
        <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
          <i className="icon-back" />
          <span className="d-ib ml5">Back</span>
        </div>
      }
      headerRight="&nbsp;">
      <div className="login-form">
        {errMsg && <div className="info">Your details weren't recognised</div>}
        <div className="login-form__wrap">
          <div className="login-form__heading">
            <div>
              <a href="javascript:;" className="login-form__heading--lg" style={{ pointerEvents: "none" }}>
                Login
              </a>
            </div>
            <div>
              <NavLink to="/register" className="login-form__heading--rg">
                Register
              </NavLink>
            </div>
          </div>
          <div className="dnxreg-box">
            <div className="dnxreg-box-b">
              <div className="nxmob">
                <select name="pre" id="" className="nxmob-select">
                  <option value="+234">+234</option>
                </select>
                <input
                  className="form-input"
                  type="text"
                  autoComplete="phone"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(false);
                    setErrMsg(false);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-input__wrap">
              <input
                className="form-input"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && <div className="txt-red pull-left mt10">Please enter a valid username and password</div>}

          <button className="btn w-full mt15" onClick={(e) => submitForm(e)}>
            Login
          </button>

          <div className="mt20 txt-c">
            <NavLink to="/forgot-password" className="login-form--link" title="Forgotten Details?">
              Forgot your password?
            </NavLink>
          </div>
        </div>
      </div>
    </Layout>
  );
}
