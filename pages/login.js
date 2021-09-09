import React, { useEffect } from "react";
import Head from "next/head";
import { useFormik } from "formik";

import useUser from "../lib/useUser";
import { loginUser } from "../actions";
import login from "../sass/pages/Login.module.scss";
import twitForm from "../sass/components/TwitForm.module.scss";
import TwitButton from "../components/TwitButton";
import TwitInputGroup from "../components/TwitInputGroup";
import TwitInput from "../components/TwitInput";
import TwitForm from "../components/TwitForm";

function LoginPage() {
  const { user, mutateUser } = useUser({
    redirectIfFound: true,
    redirectTo: "/home",
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      await loginUser(values);
      mutateUser();
    },
  });

  return (
    <div className={login["login"]}>
      <div className={login["login__logo"]}></div>
      <h1 className="heading-1">Log in to twitleague</h1>
      <TwitForm onSubmit={formik.handleSubmit}>
        <TwitInputGroup id="username" labelText="Username">
          <TwitInput
            id="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            value={formik.values.username}
            name="username"
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
          />
        </TwitInputGroup>
        <TwitButton color="primary" size="large" expanded>
          Log in
        </TwitButton>
      </TwitForm>
      <div className={login["login__secondary-actions"]}>
        <div className={login["login__secondary-action"]}>Forgot password?</div>
        <div className={login["login__secondary-action"]}>
          Sign up for twitleague
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
