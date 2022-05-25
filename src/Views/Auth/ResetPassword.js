import React, {useEffect} from "react";
import Layout from "../Layout";
import { goBack} from "../../Utils/helpers";
import { useSelector} from "react-redux";
import {resetPassword} from "../../Services/apis";
import {toast} from "react-toastify";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";

const error = {
  border: '1px solid red',
  backgroundColor: 'pink'
};

const FormSchema = Yup.object().shape({
  password: Yup.string()
      .min(3, "Minimum 4 letters")
      .required("Enter a password"),
  confirm_password: Yup.string()
      .min(3, "Minimum 4 letters")
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .required("Please confirm your password"),
});

export default function ResetPassword({history}) {

  const {username} = useSelector((state) => state.auth);

  useEffect(() => {
    if (!username) {
      toast.error('Something went wrong. Please resend verification code');
      history.push('/forgot-password');
    }
  }, [username]);

  const submit = (values, {setSubmitting}) => {
    values.username = username;

    resetPassword(values).then(res => {
      setSubmitting(false);
      if (res.success) {
        history.push('/login')
      } else {
        toast.error(res.message);
      }
    }).catch(err => {
      setSubmitting(false);
    });
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
            <p>Enter a new password </p>
          </div>
          <Formik
              initialValues={{ password: '', confirm_password: '' }}
              validationSchema={FormSchema}
              onSubmit={submit}
          >
            {({ isSubmitting,  errors }) => (
                <Form className="form-holder">
                  <div className="input-group mb20">
                    <p className="label">New Password:</p>
                    <Field
                        style={errors.password ? error : null}
                        type="password"
                        id="password"
                        placeholder="*********"
                        name="password"
                    />
                  </div>
                  <div className="input-group mb15">
                    <p className="label">Confirm Password:</p>
                    <Field
                        style={errors.confirm_password ? error : null}
                        type="password"
                        id="confirm_password"
                        placeholder="*********"
                        name="confirm_password"
                    />
                  </div>
                  <br />
                  <button
                      className="aqx-loax-btn"
                      type="submit"
                      disabled={isSubmitting}
                  >Change Password {isSubmitting && <i className="fa fa-spin fa-spinner" /> }</button>

                </Form>
            )}
          </Formik>

        </div>
      </div>
    </Layout>
  );
}
