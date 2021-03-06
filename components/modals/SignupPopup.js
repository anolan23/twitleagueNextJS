import React from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

import { createUser } from "../../actions";
import twitForm from "../../sass/components/TwitForm.module.scss";
import signupPopup from "../../sass/components/SignupPopup.module.scss";
import Popup from "./Popup";
import TwitButton from "../TwitButton";

function SignupPopup({ show, onHide }) {
  const router = useRouter();

  const signUp = async (values) => {
    await createUser(values);
    onHide();
    router.push("/home");
  };

  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    username: Yup.string()
      .min(4, "Username must be at least four characters")
      .max(20, "Username must be 20 characters or less")
      .required("Required"),
    password: Yup.string()
      .required("You must provide a password")
      .min(8, "Password must be at least eight characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      signUp(values);
    },
    validationSchema: SignupSchema,
  });

  const renderHeading = () => {
    return (
      // <div className={signupPopup["signup-popup__heading"]}>
      //     <TwitButton color="primary">Next</TwitButton>
      // </div>
      null
    );
  };

  const renderBody = () => {
    return (
      <div className={signupPopup["signup-popup"]}>
        <form onSubmit={formik.handleSubmit} className={twitForm["twit-form"]}>
          <h1 className={signupPopup["signup-popup__title"]}>
            Create your account
          </h1>
          <div className={twitForm["twit-form__group"]}>
            <label htmlFor="name" className={twitForm["twit-form__label"]}>
              Name
            </label>
            <input
              id="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              name="name"
              type="text"
              autoComplete="off"
              className={
                formik.errors.name && formik.touched.name
                  ? twitForm["twit-form__input--errors"]
                  : twitForm["twit-form__input"]
              }
            />
            {formik.errors.name && formik.touched.name ? (
              <div className={twitForm["twit-form__errors"]}>
                {formik.errors.name}
              </div>
            ) : null}
          </div>
          <div className={twitForm["twit-form__group"]}>
            <label htmlFor="email" className={twitForm["twit-form__label"]}>
              Email
            </label>
            <input
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.teamAbbrev}
              name="email"
              type="text"
              autoComplete="off"
              className={
                formik.errors.email && formik.touched.email
                  ? twitForm["twit-form__input--errors"]
                  : twitForm["twit-form__input"]
              }
            />
            {formik.errors.email && formik.touched.email ? (
              <div className={twitForm["twit-form__errors"]}>
                {formik.errors.email}
              </div>
            ) : null}
          </div>
          <div className={twitForm["twit-form__group"]}>
            <label htmlFor="username" className={twitForm["twit-form__label"]}>
              Username
            </label>
            <input
              id="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              name="username"
              type="text"
              autoComplete="off"
              className={
                formik.errors.username && formik.touched.username
                  ? twitForm["twit-form__input--errors"]
                  : twitForm["twit-form__input"]
              }
            />
            {formik.errors.username && formik.touched.username ? (
              <div className={twitForm["twit-form__errors"]}>
                {formik.errors.username}
              </div>
            ) : null}
          </div>
          <div className={twitForm["twit-form__group"]}>
            <label htmlFor="password" className={twitForm["twit-form__label"]}>
              Password
            </label>
            <input
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              name="password"
              type="password"
              autoComplete="off"
              className={
                formik.errors.password && formik.touched.password
                  ? twitForm["twit-form__input--errors"]
                  : twitForm["twit-form__input"]
              }
            />
            {formik.errors.password && formik.touched.password ? (
              <div className={twitForm["twit-form__errors"]}>
                {formik.errors.password}
              </div>
            ) : null}
          </div>
          <div className={signupPopup["signup-popup__action"]}>
            <TwitButton color="primary" size="large">
              Sign up
            </TwitButton>
          </div>
        </form>
      </div>
    );
  };

  return (
    <Popup
      show={show}
      onHide={onHide}
      heading={renderHeading()}
      body={renderBody()}
    />
  );
}

export default SignupPopup;
