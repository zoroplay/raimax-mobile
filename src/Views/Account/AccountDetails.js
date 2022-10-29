import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field } from "formik";
import { updateProfile } from "../../Services/apis";
import { REMOVE_USER_DATA, SET_TOAST_PROPS } from "../../Redux/types";
import { goBack } from "../../Utils/helpers";
import { toast } from "react-toastify";

const AccountDetails = ({ history }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [inputObj, setInputObj] = useState({
    accountId: "",
    firstName: "",
    Surname: "",
    DOB: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    email: "",
    username: "",
  });

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) history.replace("/");
  }, [isAuthenticated]);

  useEffect(() => {
    setInputObj({
      code: user?.code,
      firstName: user?.details?.first_name,
      Surname: user?.details?.last_name,
      DOB: user?.details?.date_of_birth,
      phone: user?.details?.phone_number,
      address: user?.details?.address,
      country: user.details.country,
      state: user.details.state,
      email: user.email,
      username: user.username,
    });
  }, []);

  const handleChange = (e) => {
    e.preventDefault();

    setInputObj({
      ...inputObj,
      [e.target.name]: e.target.value,
    });
  };

  const submit = () => {
    const payload = {
      email: inputObj.email,
    };
    updateProfile(payload)
      .then((res) => {
        setSubmitting(false);
      })
      .catch((err) => {
        setSubmitting(false);
        if (err.response.status === 422) {
          let errors = Object.values(err.response.data.errors);
          errors = errors.flat();
          toast.error(errors);
        }
        toast.error(err?.response?.data?.message);
      });
  };

  return (
    <Layout
      headerLeft={
        <div
          className="h-s__wrap-trigger px15 py10"
          onClick={() => goBack(history)}
        >
          <i className="icon-back" />
          <span className="d-ib ml5">Back</span>
        </div>
      }
    >
      <div className="page-title pt5">
        <h3>UPDATE ACCOUNT DETAILS</h3>{" "}
      </div>
      <div className="main-content bg-white">
        <div className="personal__details p15">
          <div className="personal__details-top">
            <div className="table-f">
              <div>Account Id</div>
              <input
                name="code"
                value={inputObj.code}
                onChange={(e) => handleChange(e)}
                disabled={true}
              />
            </div>
            <div className="table-f mt5">
              <div>Userame</div>
              <input
                name="username"
                value={inputObj.username}
                onChange={(e) => handleChange(e)}
                disabled={true}
              />
            </div>
            <div className="table-f mt5">
              <div>
                Email<span className="txt-orange"></span>
              </div>
              <input
                type="email"
                name="email"
                value={inputObj.email}
                required
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="table-f mt5">
              <div>Contact Number</div>
              <input
                name="phone"
                required
                disabled={true}
                value={inputObj.phone}
                onChange={(e) => handleChange(e)}
              />
            </div>
            {/* <div className="table-f mt5">
              <div>First Name</div>
              <input
                name="firstName"
                value={inputObj.firstName}
                onChange={(e) => handleChange(e)}
              />
            </div> */}
            {/* <div className="table-f mt5">
              <div>Surname</div>
              <input
                name="surname"
                value={inputObj.surname}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="table-f mt5">
              <div>Date of birth</div>
              <input
                name="DOB"
                type="date"
                required
                value={inputObj.DOB}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="table-f mt5">
              <div>Address</div>
              <input
                name="accountId"
                value={inputObj.address}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="table-f mt5">
              <div>City</div>
              <input
                name="city"
                value={inputObj.city}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="table-f mt5">
              <div>State</div>
              <input
                name="state"
                value={inputObj.state}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="table-f mt5">
              <div>Post code</div>

              <input name="poostCode" value="-" />
            </div>
            <div className="table-f mt5">
              <div>Country</div>
              <input
                name="country"
                value={inputObj.country}
                onChange={(e) => handleChange(e)}
              />
            </div> */}
            <div className="table-f mt20">
              <input type="button" value="UPDATE" onClick={submit} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountDetails;
