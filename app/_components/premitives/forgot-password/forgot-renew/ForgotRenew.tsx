"use client";
import React from "react";
import "./ForgotRenew.scss";
import { Form, Field } from "react-final-form";
import { Button, Input } from "@/_components";
import validate, {
  composeValidators,
  passwordMatch,
  required,
} from "@/_validations/validations";
import { HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { closeComponentModal } from "@/_redux/slices/modal.slice";

const ForgotRenew = () => {
  const dispatch = useDispatch();
  const onSubmit = (values: { [key in string]: string }) => {};
  return (
    <div className="forgot_pass">
      <div className="between">
        <div className="forgot_pass_title">CHANGE PASSWORD</div>
        {/* <div onClick={() => dispatch(closeComponentModal())}>
          <HiMiniXMark />
        </div> */}
      </div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, valid }) => (
          <form onSubmit={handleSubmit}>
            <div className="input_wrap">
              <Field
                name="password"
                component={Input}
                label={"New Password"}
                password
                validate={required("New Password")}
              />
            </div>
            <div className="input_wrap">
              <Field
                name="new_password"
                component={Input}
                label={"Confirm Password"}
                password
                validate={composeValidators(
                  required("Confirm New Password"),
                  passwordMatch
                )}
              />
            </div>
            <Button text="Submit" type="submit" disabled={!valid} />
          </form>
        )}
      />
    </div>
  );
};

export default ForgotRenew;
