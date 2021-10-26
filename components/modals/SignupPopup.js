import React from "react";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

import { createUser } from "../../actions";
import styles from "../../sass/components/SignupPopup.module.scss";
import Popup from "./Popup";
import TwitButton from "../TwitButton";
import TwitForm from "../TwitForm";
import TwitInputGroup from "../TwitInputGroup";
import TwitInput from "../TwitInput";

function SignupPopup({ show, onHide }) {
  const router = useRouter();

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
    onSubmit: async (values) => {
      let user;
      try {
        user = await createUser(values);
      } catch (error) {
        console.log(error);
      } finally {
        onHide();
        router.push(`/users/${user.username}`);
      }
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
      <div className={styles["signup-popup"]}>
        <TwitForm onSubmit={formik.handleSubmit}>
          <h1 className={styles["signup-popup__title"]}>Create your account</h1>
          <TwitInputGroup id="name" labelText="Name">
            <TwitInput
              id="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              value={formik.values.name}
              name="name"
              isError={formik.errors.name && formik.touched.name}
              errors={formik.errors.name}
            />
          </TwitInputGroup>
          <TwitInputGroup id="email" labelText="Email">
            <TwitInput
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              value={formik.values.email}
              name="email"
              isError={formik.errors.email && formik.touched.email}
              errors={formik.errors.email}
            />
          </TwitInputGroup>
          <TwitInputGroup id="username" labelText="Username">
            <TwitInput
              id="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              value={formik.values.username}
              name="username"
              isError={formik.errors.username && formik.touched.username}
              errors={formik.errors.username}
            />
          </TwitInputGroup>
          <TwitInputGroup id="password" labelText="Password">
            <TwitInput
              id="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              value={formik.values.password}
              name="password"
              isError={formik.errors.password && formik.touched.password}
              errors={formik.errors.password}
            />
          </TwitInputGroup>
          <div className={styles["signup-popup__action"]}>
            <TwitButton color="primary" size="large">
              Sign up
            </TwitButton>
          </div>
        </TwitForm>
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
