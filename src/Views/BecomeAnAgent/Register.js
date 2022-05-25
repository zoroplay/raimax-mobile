import React from "react";
import Layout from "../Layout";
import {goBack} from "../../Utils/helpers";
import {Formik, Field} from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import {saveNewAgent} from "../../Services/apis";
import moment from "moment";
import {toast} from "react-toastify";

const FormSchema = Yup.object().shape({
    first_name: Yup.string()
        .required("Please provide a name"),
    last_name: Yup.string()
        .required("Please provide a last name"),
    email: Yup.string()
        .required("An email is requires")
        .email('Please provide a valid email'),
    phone: Yup.string().required("A phone number is required"),
    state: Yup.string().required("Please provide your state of residence"),
    shop_address: Yup.string().required("What is your shop address"),
    personal_address: Yup.string().required("Please provide your address"),
});

export default function BecomeAnAgent({history}) {

    const submitForm = (values, {setSubmitting, resetForm}) => {
        const data = {...values}
        data.date_of_birth = moment(values.date_of_birth).format('YYYY-MM-DD');

        saveNewAgent(data).then(res => {
            setSubmitting(false);
            if (res.success) {
                resetForm({});
                toast.success('Your details has been submitted successfully. We would be in touch shortly.');
            } else {
                toast.error(res.message);
            }
        }).catch (err => {
            toast.error(err.message);
        })
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
          <div className="login-form__heading">
            Become an Agent
          </div>
            <Formik
                enableReinitialize={true}
                initialValues={{
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    state: '',
                    shop_address: '',
                    personal_address: '',
                    gender: 'Male',
                    date_of_birth: moment().subtract(18, 'years').toDate()
                }}
                validationSchema={FormSchema}
                children={(props) => <AgentForm {...props} />}
                onSubmit={submitForm}
            />

        </div>
      </div>
    </Layout>
  );
}

function AgentForm ({
                           errors,
                           touched,
                         setFieldValue,
                         handleSubmit,
                         isSubmitting,
                         isValid,
                         values,
                       }) {
    const {first_name, last_name, gender, email, phone, state, shop_address, personal_address, date_of_birth} = values;

  return (
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-input__wrap">
              <Field
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={first_name}
                  placeholder={`First Name`}
                  className={`form-input`}
              />
              {errors.first_name && touched.first_name ? (
                  <div className="txt-red pt5">{errors.first_name}</div>
              ) : null}
          </div>
        </div>
        <div className="form-row">
          <div className="form-input__wrap">
              <Field
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={last_name}
                  placeholder={`Last Name`}
                  className={`form-input`}
              />
              {errors.last_name && touched.last_name ? (
                  <div className="txt-red pt5">{errors.last_name}</div>
              ) : null}
          </div>
        </div>
          <div className="form-row">
              <div className="form-input__wrap">
                  <DatePicker
                      dateFormat="dd/MM/yyyy"
                      className="textbox"
                      name="date_of_birth"
                      selected={date_of_birth}
                      onChange={date => setFieldValue('date_of_birth', date)}
                  />

                  {errors.date_of_birth && touched.date_of_birth ? (
                      <div className="txt-red pt5">{errors.date_of_birth}</div>
                  ) : null}
              </div>
          </div>
          <div className="form-row">
              <div className="form-input__wrap">
                  <label style={{marginRight: '20px'}}>Gender</label>
                  <label style={{marginRight: '10px'}}>
                      <Field type="radio" name="gender" value="Male" style={{marginRight: '5px'}} />
                      Male
                  </label>
                  <label>
                      <Field type="radio" name="gender" value="Female" style={{marginRight: '5px'}} />
                      Female
                  </label>
              </div>
          </div>
        <div className="form-row">
          <div className="form-input__wrap">
              <Field
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  placeholder={`Email`}
                  className={`form-input`}
              />
              {errors.email && touched.email ? (
                  <div className="txt-red pt5">{errors.email}</div>
              ) : null}
          </div>
        </div>
          <div className="form-row">
              <div className="form-input__wrap">
                  <Field
                      type="text"
                      id="phone"
                      name="phone"
                      value={phone}
                      placeholder={`Phone Number`}
                      className={`form-input`}
                  />
                  {errors.phone && touched.phone ? (
                      <div className="txt-red pt5">{errors.phone}</div>
                  ) : null}
              </div>
          </div>
          <div className="form-row">
              <div className="form-input__wrap">
                  <Field
                      type="text"
                      id="state"
                      name="state"
                      value={state}
                      placeholder={`State`}
                      className={`form-input`}
                  />
                  {errors.state && touched.state ? (
                      <div className="txt-red pt5">{errors.state }</div>
                  ) : null}
              </div>
          </div>
          <div className="form-row">
              <div className="form-input__wrap">
                  <Field
                      type="text"
                      id="shop_address"
                      name="shop_address"
                      value={shop_address}
                      placeholder={`Shop Address`}
                      className={`form-input`}
                  />
                  {errors.shop_address && touched.shop_address ? (
                      <div className="txt-red pt5">{errors.shop_address}</div>
                  ) : null}
              </div>
          </div>
          <div className="form-row">
              <div className="form-input__wrap">
                  <Field
                      type="text"
                      id="personal_address"
                      name="personal_address"
                      value={personal_address}
                      placeholder={`Personal Address`}
                      className={`form-input`}
                  />
                  {errors.personal_address && touched.personal_address ? (
                      <div className="txt-red pt5">{errors.personal_address}</div>
                  ) : null}
              </div>
          </div>

        <button type="submit" className="btn w-full mt15" disabled={!isValid && isSubmitting} >
            {isSubmitting ? 'Submitting' : 'Submit' }
        </button>
      </form>
  )
}
