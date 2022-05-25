import React, {useState} from "react";
import useSWR from "swr/esm/use-swr";
import {Formik, Field} from "formik";
import * as Yup from "yup";
import {postWithdrawal} from "../../Services/apis";
import {SHOW_MODAL, UPDATE_USER_BALANCE} from "../../Redux/types";
import {useDispatch} from "react-redux";

const FormSchema = Yup.object().shape({
    amount: Yup.number().min(100, 'Missing amount')
        .required("Enter an amount"),
    account_number: Yup.string()
        .required("Account number is required"),
    bank_id: Yup.string()
        .required("Choose a bank"),
    account_type: Yup.string()
        .required("Select account type"),
});
export default function WithdrawalForm({data}) {
    const [errMsg, setErrMsg] = useState(null);
    const dispatch = useDispatch();

    const submitForm = (values, {setSubmitting, resetForm}) => {
        postWithdrawal(values).then(res => {
            setSubmitting(false);
            if (res.success) {
                dispatch({type: SHOW_MODAL, payload: {
                        show: true,
                        type: 'message',
                        title: 'Sent Successfully',
                        message: 'Your request has been received and is being processed'
                    }})
                dispatch({type: UPDATE_USER_BALANCE, payload: res.balance});

                resetForm({
                    amount: '',
                    account_number: '',
                    bank_id: '',
                    account_type: '',
                })
            } else {
                setErrMsg(res.message);
            }
        }).catch(err => {
            setSubmitting(false);
            if (err.response.status === 422){
                let errors = Object.values(err.response.data.errors);
                errors = errors.flat();
                setErrMsg(errors);
            } else {

            }
        })
    }

    return (
        <div className="page__body p15">
        <Formik
            enableReinitialize={true}
            initialValues={{
                amount: '',
                account_number: '',
                bank_id: '',
                account_type: '',
            }}
            validationSchema={FormSchema}
            children={(props) => <Form {...props} data={data} errMsg={errMsg} />}
            onSubmit={submitForm}
        />
        </div>
    )
}

function Form({
                  errors,
                  touched,
                  setFieldValue,
                  handleSubmit,
                  isSubmitting,
                  isValid,
                  values,
    data,
    errMsg
              }) {

    const updateAmount = (value) => {
        let currentAmount = amount;
        if (currentAmount === ''){
            currentAmount = 0;
        }
        setFieldValue('amount', currentAmount + value);
    }

    const {data: banks} = useSWR('utilities/list-banks');
    const {amount, account_number, account_type, bank_id} = values;

    const setAccountDetails = e => {
        const value = e.target.value;
        console.log(value);
        const account = data.accounts.find(account => account.id === parseInt(value));
        if (account) {
            setFieldValue('account_number', account.account_number);
            setFieldValue('account_type', account.account_type);
            setFieldValue('bank_id', account.bank_id);
        } else {
            setFieldValue('account_number', '');
            setFieldValue('account_type', '');
            setFieldValue('bank_id', '');
        }
    }
    return (
        <form className="form" onSubmit={handleSubmit}>
            {/*<div className="info-box green">{paymentSuccess}</div>*/}
            {errMsg && <div className="callout red mb15">{errMsg}</div>}
            <div className="clear-both"/>
            <div className="">

                <div className="form-row">
                    <div className="form-label"><strong> Withdrawal Amount (₦)</strong></div>
                    <div className={`form-input ${errors.amount ? 'error' : ''}`}>
                        <Field name="amount"
                               className="big" type="number"
                               step="100" maxLength="5" min="100" max="10000"
                               value={amount} onChange={(e) => setFieldValue('amount', e.target.value)}
                        />
                        <div className="form-input--stake"> Min 100</div>
                    </div>
                    {errors.amount && touched.amount ? (
                        <div className="form--error">{errors.amount}</div>
                    ) : null}
                    <div className="quickstake mt10">
                        <div className="quickstake__item" onClick={() => updateAmount(0)}> Clear</div>
                        <div className="quickstake__item" onClick={() => updateAmount(100)}> +100</div>
                        <div className="quickstake__item" onClick={() => updateAmount(200)}> +200</div>
                        <div className="quickstake__item" onClick={() => updateAmount(500)}> +500</div>
                        <div className="quickstake__item" onClick={() => updateAmount(1000)}> +1000</div>
                    </div>

                    <div className="steps bg-lightgray mt15">
                        <div className="steps__row">
                            <div className="steps__item reset-fw" style={{width: 'auto'}}> Account Holder:&nbsp;</div>
                            <div className="steps__item"><strong>{data?.details?.first_name + ' ' + data?.details?.last_name}</strong></div>
                        </div>
                        <div className="steps__row">
                            <div className="steps__item reset-fw" style={{width: 'auto'}}> Mobile Number:&nbsp;</div>
                            <div className="steps__item"><strong>{data?.details?.phone_number}</strong></div>
                        </div>
                        <div className="steps__row">
                            <div className="steps__item reset-fw" style={{width: 'auto'}}> Email:&nbsp;</div>
                            <div className="steps__item"><strong>{data?.email}</strong></div>
                        </div>
                        <div className="steps__row">
                            <div className="steps__item reset-fw" style={{width: 'auto'}}> Please <a
                                href="#">contact us</a> if the above information is incorrect.
                            </div>
                        </div>
                    </div>
                    <div className="form-row mt25">
                        <div className="form-label"><span> Select Bank Account</span></div>
                        <div className="form-select">
                            <select name="bankAccountId" onChange={setAccountDetails}>
                                <option value=""> Add New Account</option>
                                {data?.accounts.map(account =>
                                    <option value={account.id} key={account.id}> {account.account_number}</option>
                                )}
                            </select>
                            <div className="form-select--hide-arrow"></div>
                        </div>
                        <div className="form--alert txt-deepgray"><strong> Please Note</strong><p
                            className="m0"> You can only add a maximum of 2 accounts</p></div>
                    </div>
                    <div className="form-row mt25">
                        <div className="form-label"> Bank Account Number</div>
                        <div className={`form-input ${errors.account_number ? 'error' : ''}`}>
                            <Field className="" type="number" name="account_number"
                                   placeholder="" value={account_number} />
                        </div>
                        {errors.account_number && touched.account_number ? (
                            <div className="form--error">{errors.account_number}</div>
                        ) : null}
                    </div>
                    <div className="form-row mt25">
                        <div className="form-label"><span> Account Type</span></div>
                        <div className={`form-select ${errors.account_type ? 'error' : ''}`}>
                            <select name="accountTypeCode" value={account_type} onChange={(e) => setFieldValue('account_type', e.target.value)}>
                                <option value=""> Choose an Account Type</option>
                                <option value="Savings"> Savings Account</option>
                                <option value="Current"> Current Account</option>
                            </select>
                            <div className="form-select--hide-arrow"></div>
                        </div>
                        {errors.account_type && touched.account_type ? (
                            <div className="form--error">{errors.account_type}</div>
                        ) : null}
                    </div>
                    <div className="form-row mt25">
                        <div className="form-label"><span> Bank</span></div>
                        <div className={`form-select ${errors.bank_id ? 'error' : ''}`}>
                            <Field
                                as="select"
                                name="bankId" value={bank_id}
                                onChange={(e) => setFieldValue('bank_id', e.target.value)}
                            >
                                <option value=""> Choose a Bank</option>
                                {banks && banks.map(bank => <option key={bank.id} value={bank.id}>{bank.name}</option>)}
                            </Field>
                            <div className="form-select--hide-arrow"></div>
                        </div>
                        {errors.bank_id && touched.bank_id ? (
                            <div className="form--error">{errors.bank_id}</div>
                        ) : null}
                    </div>

                </div>
                <div className="form-row txt-deepgray disclaimer"><p> Disclaimer</p> Rababet accepts no
                    responsibility should you make a deposit into any account other than that of the
                    Company, or enter your own account details incorrectly when requesting a withdrawal. It
                    is your responsibility to ensure that you add your correct customer data as indicated on
                    our site instructions and the correct Rababet account or payment details. In the event
                    that an error occurs Rababet accepts no responsibility for recovering these funds and
                    your account will NOT be credited.
                </div>
                {errMsg && <div className="callout red mb15">{errMsg}</div>}

                <button type="submit" className="btn green mt20 mb20" disabled={!isValid && isSubmitting}>Make Withdrawal</button>
            </div>
        </form>
    );
}
