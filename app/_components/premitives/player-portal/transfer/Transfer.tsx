"use client";
import React from "react";
import "./Transfer.scss";
import { RiRefreshLine } from "react-icons/ri";

const Transfer = () => {
  return (
    <div className="transfer">
      <div className="transfer_title">TRANSFER</div>

      <div className="input-box">
        <input type="text" placeholder="ueyiuerhfdjsh" />
        <button className="find">
          <RiRefreshLine fontSize={20} />
        </button>
      </div>
      {/* <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, valid, form }) => {
          return (
            <form onSubmit={handleSubmit} className="withdrawal_form_wrap">
              <div className="withdrawal_input_wrap">
                <Field
                  name="amount"
                  component={Input}
                  label="WITHDRAWABLE AMOUNT"
                  type="number"
                  placeholder="0"
                  validate={required("Amount")}
                />
              </div>
              <div className="withdrawal_input_wrap">
                <Field
                  name="payment_account"
                  component={Input}
                  label="PAYMENT ACCOUNT"
                  type="number"
                  select
                  options={{
                    New: "New",
                    ...allAccountsData?.data?.reduce(
                      (acc: { [key in string]: string }, val: any) => {
                        const accountNumber = val?.accountNumber;
                        return { ...acc, [accountNumber]: val?.bankCode };
                      },
                      {}
                    ),
                  }}
                  validate={required("Payment Account")}
                />
              </div>
              {isNew && (
                <>
                  <div className="withdrawal_input_wrap">
                    <Field
                      name="bank"
                      component={Input}
                      label="BANKS"
                      type="number"
                      select
                      options={banks}
                      validate={required("Bank")}
                      initialValue={formValue?.bank || ""}
                    />
                  </div>
                  <div className="withdrawal_input_wrap">
                    <Field
                      name="accountNumber"
                      component={Input}
                      label="ACCOUNT NUMBER"
                      type="number"
                      placeholder="Account Number"
                      validate={required("Account Number")}
                      initialValue={formValue?.accountNumber || ""}
                    />
                  </div>
                  {verifyData && verifyData.success && (
                    <div className="withdrawal_input_wrap">
                      <Field
                        name="accountName"
                        component={Input}
                        label="ACCOUNT NAME"
                        initialValue={formValue?.accountName}
                        placeholder="Account Name"
                        disabled={true}
                      />
                    </div>
                  )}
                </>
              )}
              {isVerified && (
                <div className="info_text_wrap">
                  <div className="info_text">
                    Name: {formValue?.accountName}
                  </div>
                  <div className="info_text">
                    Account Number: {formValue?.accountNumber}
                  </div>
                  <div className="info_text">Bank: {formValue?.bank}</div>
                </div>
              )}
              <Button
                text={isNew && isVerify ? "VERIFY" : "WITHDRAWAL"}
                className="withdrawal_btn_wrap"
                type="submit"
                loading={isLoading || isLoadingVerify}
                disabled={!valid}
              />
              <FormSpy
                subscription={{ values: true }}
                onChange={(props) => {
                  // if (shouldReset) {
                  //   form.reset({});
                  //   setShouldReset(false);
                  // }
                  if (props.values?.payment_account === "New") {
                    setIsNew(true);
                    setIsVerify(true);
                    setIsVerified(false);
                    setFormValue((prev) => ({
                      ...prev,
                      accountNumber: "",
                      bank: "",
                      // accountName: "",
                      bankCode: "",
                    }));
                    if (props.values?.bank && !isVerified) {
                      const selectedBank = allBanksData?.find(
                        (item: any) => item?.name === props.values?.bank
                      );
                      props.values.bankId = selectedBank?.bank_id;
                      props.values.bankCode = selectedBank?.code;
                      props.values.bankName = selectedBank?.name;

                      setFormValue((prev) => ({
                        ...prev,
                        accountNumber: props.values?.accountNumber || "",
                        accountName: verifyData?.message || "",
                      }));
                    }
                  } else {
                    setIsNew(false);
                    setIsVerify(false);
                    setIsVerified(true);
                    setFormValue((prev) => ({
                      ...prev,
                      accountNumber: "",
                      bank: "",
                      accountName: "",
                      bankCode: "",
                    }));

                    if (props.values.payment_account) {
                      // all user account object
                      const accounts = getAccounts();
                      const details = accounts[props.values.payment_account];
                      // console.log(accounts[props.values.payment_account], "cj");
                      // setFormValue((prev) => ({
                      //   ...prev,
                      //   accountNumber: details?.accountNumber || "",
                      //   bank: details?.bankName || "",
                      //   accountName: details?.accountName || "",
                      //   bankCode: details?.bankCode || "",
                      // }));
                      const selectedBank = allBanksData?.find(
                        (item: any) => item?.code === details?.bankCode
                      );
                      setFormValue((prev) => ({
                        ...prev,
                        accountNumber: details?.accountNumber || "",
                        bank: selectedBank?.name || "",
                        accountName: details?.accountName || "",
                        bankCode: details?.bankCode || "",
                      }));
                      props.values.bankId = selectedBank?.bank_id;
                      props.values.bankCode = selectedBank?.code;
                      props.values.bankName = selectedBank?.name;
                      props.values.accountNumber = selectedBank?.code;
                    }
                  }

                  if (!props.values?.payment_account) {
                    setIsVerified(false);
                  }
                }}
              />
            </form>
          );
        }}
      /> */}
    </div>
  );
};

export default Transfer;
