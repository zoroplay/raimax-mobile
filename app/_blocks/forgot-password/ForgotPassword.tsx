"use client";
import React, { useState, useEffect } from "react";
import "./ForgotPassword.scss";
import { Form, Field } from "react-final-form";
import { Button, Input, ForgotRenew } from "@/_components";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/_services/notification.service";
import { openModal } from "@/_redux/slices/modal.slice";
import { formatErrorResponse, rtkMutation } from "@/_utils";
import { useAppDispatch } from "@/_hooks";
import OtpInput from "react-otp-input";
import validate, { required } from "@/_validations/validations";
import { useRouter, useParams } from "next/navigation";

const ForgotPassword = () => {
  const [otp, setOtp] = useState("");

  const [sendOtpMutation, { isLoading, isSuccess, isError, data, error }] =
    useSendOtpMutation();

  const [
    verifyOtpMutation,
    {
      isLoading: isLoadingVerify,
      isSuccess: isSuccessVerify,
      isError: isErrorVerify,
    },
  ] = useVerifyOtpMutation();

  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug[0];

  const onSubmit = (values: { [key in string]: string | number }) => {
    rtkMutation(sendOtpMutation, {
      username: { username: values.username },
      type: "forgot-password",
    });
  };

  useEffect(() => {
    isSuccess &&
      dispatch(
        openModal({
          title: "OTP sent succesfuly",
          message: "Input sms code to continue",
          success: true,
        })
      );
    isError &&
      dispatch(
        openModal({
          title: "Error!",
          message: `${formatErrorResponse(error) || "An error occured"}`,
          success: false,
        })
      );
  }, [isSuccess, isError, error, dispatch]);

  useEffect(() => {
    if (otp.length === 6) {
      rtkMutation(verifyOtpMutation, otp);
      isSuccessVerify && router.push("/forgot-password/change");
    }
  }, [otp]);

  //   console.log(slug);

  return (
    <>
      {slug === "otp" ? (
        <div className="forgot center">
          <div className="forgot_wrap">
            <div className="between forgot_title_wrap">
              <div className="forgot_title">
                Enter registered number to reset password
              </div>
              {/* <div
            className="forgot_cancel"
            onClick={() => dispatch(closeComponentModal())}
          >
            <ImCancelCircle />
          </div> */}
            </div>
            <Form
              onSubmit={onSubmit}
              validate={validate}
              render={({ handleSubmit }) => (
                <form className="forgot_form" onSubmit={handleSubmit}>
                  <div className="forgot_form_item">
                    <Field
                      name="username"
                      component={Input}
                      number
                      label={"Phone Number"}
                      validate={required("Phone Number")}
                    />
                  </div>
                  <div className="border" />
                  <Button
                    text="Send Code"
                    type="submit"
                    className="forgot_btn"
                    loading={isLoading}
                  />
                </form>
              )}
            />
            <div className="forgot_otp_inp_wrap center col">
              <div className="forgot_otp_inp_title">Code from SMS*</div>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={<span></span>}
                renderInput={(props) => (
                  <input {...props} className="forgot_otp_inp" />
                )}
              />
            </div>
          </div>
        </div>
      ) : (
        <ForgotRenew />
      )}
    </>
  );
};

export default ForgotPassword;
