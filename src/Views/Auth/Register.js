import React, { useRef, useState } from "react";
import Layout from "../Layout";
import { formattedPhoneNumber, goBack } from "../../Utils/helpers";
import {
  confirmVerification,
  login,
  register,
  sendVerification,
} from "../../Services/apis";
import { useDispatch } from "react-redux";
import { SET_USER_DATA } from "../../Redux/types";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const error = {
  border: "1px solid red",
  backgroundColor: "pink",
};

const RegisterSchema = Yup.object().shape({
  phone: Yup.string().required("Enter a username"),
  password: Yup.string()
    .min(3, "Minimum 3 letters")
    .required("Enter a password"),
  term: Yup.boolean().required("You have not accepted"),
  confirm_password: Yup.string()
    .min(3, "Minimum 4 letters")
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function Register({ history }) {
  const [errMsgs] = useState([]);
  const dispatch = useDispatch();
  const [pre] = useState("+234");

  const submitForm = (values, { setSubmitting }) => {
    const payload = {
      username: values.phone,
      phone: values.phone,
      password: values.password,
      confirm_password: values.confirm_password,
      referral_code: values?.referral_code,
    };
    register(payload)
      .then((res) => {
        setSubmitting(false);
        if (res.success) {
          const { username, password } = res.credentials;
          login({ username, password })
            .then((res) => {
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
              console.log(err?.response);
              if (err?.response?.status === 401) {
                toast.error(err?.message);
              }
            });
        }
      })
      .catch((err) => {
        setSubmitting(false);
        if (err?.response?.status === 422) {
          let errors = Object.values(err?.response?.data?.errors);
          errors = errors?.flat();
          toast.error(errors);
        }
        toast.error(err?.response?.data?.message);
      });
  };

  return (
    <Layout
      bottom={false}
      headerLeft={
        <div
          className="h-s__wrap-trigger px15 py10"
          onClick={() => goBack(history)}
        >
          <i className="icon-back" />
          <span className="d-ib ml5">Back</span>
        </div>
      }
      headerRight="&nbsp;"
    >
      <div className="login-form">
        {errMsgs.map((message, i) => (
          <div key={i} className="info">
            {message}
          </div>
        ))}
        <div className="login-form__wrap">
          <div className="login-form__heading">
            <div>
              <a
                href="javascript:;"
                className="login-form__heading--lg"
                style={{ pointerEvents: "none" }}
              >
                Register
              </a>
            </div>
            <div>
              <NavLink to="/login" className="login-form__heading--rg">
                Login
              </NavLink>
            </div>
          </div>
          <Formik
            enableReinitialize={true}
            initialValues={{
              phone: "",
              password: "",
              confirm_password: "",
              referral_code: "",
            }}
            validationSchema={RegisterSchema}
            children={(props) => <RegisterForm {...props} />}
            onSubmit={submitForm}
          />
        </div>
      </div>
    </Layout>
  );
}

function RegisterForm({ errors, handleSubmit, isSubmitting }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="aqx-b-content-inner">
        <div className="aqx-loax-a">
          <div className="dnxreg-box">
            <div className="dnxreg-box-a">
              <label htmlFor="" className="nxlabel">
                Enter Mobile Number*
              </label>
            </div>
            <div className="dnxreg-box-b">
              <div className="nxmob">
                <select name="pre" id="" className="nxmob-select">
                  <option value="+234">+234</option>
                </select>
                <Field
                  style={errors.phone ? error : null}
                  type="text"
                  className="nxmob-num"
                  placeholder="704345634"
                  name="phone"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="aqx-loax-c">
          <div className="dnxreg-box">
            <div className="dnxreg-box-a">
              <label htmlFor="" className="nxlabel">
                Password*
              </label>
            </div>
            <div className="dnxreg-box-b">
              <Field
                style={errors.password ? error : null}
                type="password"
                id="dnxreg-pass1"
                className="nxfield nx-field-pass"
                placeholder="Password"
                name="password"
              />
              <span className="showpass" id="showpass1" />
            </div>
          </div>

          <div className="dnxreg-box">
            <div className="dnxreg-box-a">
              <label htmlFor="" className="nxlabel">
                Confirm Password*
              </label>
            </div>
            <div className="dnxreg-box-b">
              <Field
                style={errors.confirm_password ? error : null}
                type="password"
                id="dnxreg-pass2"
                className="nxfield nx-field-pass"
                placeholder="Confirm Password"
                name="confirm_password"
              />
            </div>
          </div>
        </div>
        <div className="dnxreg-box">
          <div className="dnxreg-box-a">
            <label htmlFor="" className="nxlabel">
              Referral code(if you have)
            </label>
          </div>
          <div className="dnxreg-box-b">
            <Field
              style={errors.first_name ? error : null}
              type="text"
              className="nxfield"
              placeholder=""
              name="referral_code"
            />
          </div>
        </div>
        <div className="dnxreg-age">
          <div className="check">
            <Field
              className="check-term"
              style={errors.term ? error : null}
              id="check-term"
              type="checkbox"
              name="term"
            />
            <span className="checkmark" />
          </div>
          <label htmlFor="check-term" className="dnxreg-age-txt">
            I accept the
            <a href="#">Terms of use.</a>
          </label>
        </div>

        <div className="dnxreg-age">
          <div className="check">
            <Field
              className="check-age"
              style={errors.age ? error : null}
              id="check-age"
              type="checkbox"
              name="age"
            />
            <span className="checkmark" />
          </div>
          <label htmlFor="check-age" className="dnxreg-age-txt error">
            I am over 18 years old.
          </label>
        </div>

        {/*<div className="aqx-loax-c-box">
                  <button className="aqx-loax-btn aqx-loax-btn-go" type="submit" disabled={isSubmitting}>
                      Register {isSubmitting ? <i className="fa fa-spin fa-spinner" /> : '' }
                  </button>
              </div>*/}
      </div>

      <button type="submit" className="btn w-full mt15" disabled={isSubmitting}>
        Create My Account{" "}
        {isSubmitting ? <i className="fa fa-spin fa-spinner" /> : ""}
      </button>
    </form>
  );
}
