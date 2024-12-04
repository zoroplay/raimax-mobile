"use client";
import React, { Dispatch, SetStateAction } from "react";
import "./ForgotPassword.scss";
import { Form, Field } from "react-final-form";
import { Button, Input } from "@/_components";
import { ImCancelCircle } from "react-icons/im";
import { AiFillLock } from "react-icons/ai";

interface LoginModalProp {
  setIsLoginModal: Dispatch<SetStateAction<boolean>>;
}

const ForgotPassword = ({ setIsLoginModal }: LoginModalProp) => {
  const onSubmit = (values: { [key in string]: string | number }) => {
    // console.log(values);
  };
  return (
    <div className="login_modal center">
      <div className="login_modal_wrap">
        <div className="between login_modal_title_wrap">
          <div className="login_modal_title">Forgot Password</div>
          <div
            className="login_modal_cancel"
            onClick={() => setIsLoginModal(false)}
          >
            <ImCancelCircle />
          </div>
        </div>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form className="login_modal_form" onSubmit={handleSubmit}>
              <div className="login_modal_form_item">
                <Field name="phone" component={Input} number label={"Phone"} />
              </div>
              {/* <div>
                <Field
                  name="password"
                  component={Input}
                  password
                  label={"Password"}
                />
              </div> */}
              {/* <div className="border" /> */}
              <Button text="SEND VERIFICATION CODE" className="login_modal_btn" />
            </form>
          )}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
