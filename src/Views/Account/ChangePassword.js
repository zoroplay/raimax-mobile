import React, {useEffect, useState} from "react";
import Layout from "../Layout";
import {goBack} from "../../Utils/helpers";
import {Formik, Field} from "formik";
import {changePassword} from "../../Services/apis";
import {REMOVE_USER_DATA, SHOW_MODAL} from "../../Redux/types";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";

const ChangePasswordSchema = Yup.object().shape({
    old_password: Yup.string()
        .min(3, "Minimum 4 letters")
        .required("Enter your old password"),
    new_password: Yup.string()
        .min(3, "Minimum 4 letters")
        .required("Enter a new password"),
    conf_password: Yup.string()
        .min(3, "Minimum 4 letters")
        .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
        .required("Confirm your new password"),
});

export default function ChangePassword({match, history}) {
    const [errMsgs, setErrMsgs] = useState([]);
    const dispatch = useDispatch();

    const {isAuthenticated} = useSelector(state => state.auth);

    useEffect(() => {
        if(!isAuthenticated)
            history.replace('/');
    },  [isAuthenticated]);

    const submitForm = (values, {setSubmitting}) => {
        changePassword(values).then(res => {
            setSubmitting(false);
            if(res.success) {
                dispatch({type: SHOW_MODAL, payload: {show: true, type: 'message', title: 'Password Change Successful', message: 'Your password has been changed successfully. Login to continue'}})
                setTimeout(() => {
                    dispatch({type: REMOVE_USER_DATA});
                    history.push('/login');
                }, 2000);
            } else {
                setErrMsgs([...errMsgs, res.message]);
            }
        }).catch(err=> {
            setSubmitting(false);
            if (err.response.status === 422){
                let errors = Object.values(err.response.data.errors);
                errors = errors.flat();
                setErrMsgs(errors);
            }
        })
    }

    return (
        <Layout
            headerLeft={
                <div className="h-s__wrap-trigger px15 py10" onClick={() => goBack(history)}>
                    <i className="icon-back" />
                    <span className="d-ib ml5">Back</span>
                </div>
            }>
            <div className="p15">
                <p className="txt-blue mt0">
                    <strong>Password Requirements</strong>
                </p>
                <ul>
                    <li className="mt5">Minimum 6 characters.</li>
                    <li className="mt5">Must contain letters and numbers (no spaces).</li>
                </ul>
            </div>
            <hr className="m0" />
            {errMsgs.map((message, i) => <div key={i} className="info txt-c txt-red p10">{message}</div> )}
            <Formik
                enableReinitialize={true}
                initialValues={{
                    old_password: '',
                    new_password: '',
                    conf_password: '',
                }}
                validationSchema={ChangePasswordSchema}
                children={(props) => <ChangePasswordForm {...props} />}
                onSubmit={submitForm}
            />
        </Layout>
    );
}

export function ChangePasswordForm({
                                       errors,
                                       touched,
                                       handleSubmit,
                                       isSubmitting,
                                       values,
                                   }) {
    const {password, old_password, conf_password} = values;

    return (
        <form className="account form p15" id="change-password" onSubmit={handleSubmit} noValidate="novalidate">
            <span className="required-text">All fields are required</span>
            <div className="form-row">
                <div className="form-label">
                    <strong>Old password</strong>
                </div>
                <div className="form-input">
                    <Field id="old_password" name="old_password" value={old_password} type="password" />
                </div>
                {errors.old_password && touched.old_password ? (
                    <div className="form--error">{errors.old_password}</div>
                ) : null}
            </div>
            <div className="form-row">
                <div className="form-label">
                    <strong>New password</strong>
                </div>
                <div className="form-input">
                    <Field id="new_password" name="new_password" value={password} type="password" />
                </div>
                {errors.password && touched.password ? (
                    <div className="form--error">{errors.password}</div>
                ) : null}
            </div>
            <div className="form-row">
                <div className="form-label">
                    <strong>Confirm New Password</strong>
                </div>
                <div className="form-input">
                    <Field id="conf_password" name="conf_password" value={conf_password} type="password" />
                </div>
                {errors.conf_password && touched.conf_password ? (
                    <div className="form--error">{errors.conf_password}</div>
                ) : null}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn green w-half mt30" id="updatePassword">Change Password</button>
            {isSubmitting && <div id="spinner"><img src="/img/loading.gif?v=1594109404" /></div> }
        </form>
    )
}
