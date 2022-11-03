import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { useSelector } from "react-redux";
import { updateProfile } from "../../Services/apis";
import { goBack } from "../../Utils/helpers";
import { toast } from "react-toastify";

const AccountDetails = ({ history }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [errMsg, setErrmsg] = useState("");
  const [err, setErr] = useState(false);
  const [inputObj, setInputObj] = useState({
    accountId: "",
    first_name: "",
    last_name: "",
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
      first_name: user?.details?.first_name,
      last_name: user?.details?.last_name,
      DOB: user?.details?.date_of_birth,
      phone: user?.details?.phone_number,
      address: user?.details?.address,
      country: user.details.country,
      state: user.details.state,
      email: user.email,
      username: user.username,
      date_of_birth: "",
      city: "",
      country_id: 160,
      state_id: 3,
      address: "",
      gender: "",
    });
  }, [user]);

  const handleChange = (e) => {
    e.preventDefault();

    setInputObj({
      ...inputObj,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      email: inputObj.email,
      details: {
        first_name: inputObj.first_name,
        last_name: inputObj.last_name,
      },
    };
    if (
      inputObj.email === null ||
      inputObj.first_name === null ||
      inputObj.last_name === null
    ) {
      setErrmsg("All fields are required");
      setErr(true);
    } else {
      setErr(false);
      updateProfile(payload)
        .then((res) => {
          setSubmitting(false);
          goBack("/account");
          console.log(res.data);
        })
        .catch((err) => {
          setSubmitting(false);
          console.log(err.response.data);
          // if (err.response.status === 422) {
          //   let errors = Object.values(err.response.data.errors);
          //   errors = errors.flat();
          //   toast.error(errors);
          // }
          toast.error(err?.response?.data?.message);
        });
    }
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
                autoComplete={false}
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
                autoComplete={false}
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
            <div className="table-f mt5">
              <div>First Name</div>
              <input
                name="first_name"
                required
                value={inputObj.first_name}
                autoComplete={false}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="table-f mt5">
              <div>Last Name</div>
              <input
                required
                name="last_name"
                value={inputObj.last_name}
                autoComplete={false}
                onChange={(e) => handleChange(e)}
              />
            </div>
            {/*

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
            {err && (
              <p
                style={{
                  color: "red",
                  fontSize: "1.5rem",
                  textAlign: "center",
                }}
              >
                {errMsg}
              </p>
            )}
            <div className="table-f mt20" style={{ width: "100%" }}>
              <button type="submit" className="but" onClick={submit}>
                UPDATE
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountDetails;
