import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";

import AutoCompleteInput from "./modals/AutoCompleteInput";
import { search } from "../actions";
import TwitItem from "./TwitItem";
import Divide from "./Divide";
import TwitSpinner from "./TwitSpinner";

function TwitSearch({ placeHolder, initialValue, onSearch }) {
  const [options, setOptions] = useState([]);
  const [show, setShow] = useState(false);
  const ref = useRef();
  const router = useRouter();
  const dropdownRef = useRef(null);

  const formik = useFormik({
    initialValues: { query: initialValue ? initialValue : "" },
    onSubmit: (values) => {
      const { query } = values;
      onSearch(query);
      setShow(false);
    },
  });

  useEffect(() => {
    window.addEventListener("click", clickOutsideDropdown);
    return () => {
      window.removeEventListener("click", clickOutsideDropdown);
    };
  }, []);

  function clickOutsideDropdown(event) {
    if (!dropdownRef.current) {
      return;
    }
    if (!dropdownRef.current.contains(event.target)) {
      setShow(false);
    }
  }

  function onBlur(event) {
    formik.handleBlur(event);
  }

  function onChange(event) {
    formik.handleChange(event);
    const query = event.target.value;
    if (query) {
      twitSearch(query);
    } else {
      setShow(false);
    }
  }

  async function twitSearch(query) {
    const results = await search({ query });

    setOptions(results);
    setShow(true);
  }

  const renderTeams = () => {
    if (!options.teams || options.teams.length === 0) {
      return null;
    }
    return options.teams.map((option, index) => {
      return (
        <TwitItem
          onClick={() => {
            setShow(false);
            formik.resetForm();
            router.push(`/teams/${option.abbrev.substring(1)}`);
          }}
          avatar={option.avatar}
          title={option.team_name}
          subtitle={option.abbrev}
          key={index}
          small
        />
      );
    });
  };

  const renderUsers = () => {
    if (!options.users || options.users.length === 0) {
      return null;
    }
    return options.users.map((option, index) => {
      return (
        <TwitItem
          onClick={() => {
            setShow(false);
            formik.resetForm();
            router.push(`/users/${option.username}`);
          }}
          avatar={option.avatar}
          title={option.name}
          subtitle={option.username}
          key={index}
          small
        />
      );
    });
  };

  const renderLeagues = () => {
    if (!options.leagues || options.leagues.length === 0) {
      return null;
    }
    return options.leagues.map((option, index) => {
      return (
        <TwitItem
          onClick={() => {
            setShow(false);
            formik.resetForm();
            router.push(`/leagues/${option.league_name}`);
          }}
          avatar={option.avatar}
          title={option.league_name}
          subtitle={`${option.sport} league`}
          key={index}
          small
        />
      );
    });
  };

  const renderOptions = () => {
    if (!options.leagues && !options.teams && !options.users) {
      return <TwitSpinner size={30} />;
    } else {
      return (
        <React.Fragment>
          {renderLeagues()}
          <Divide />
          {renderTeams()}
          <Divide />
          {renderUsers()}
        </React.Fragment>
      );
    }
  };

  return (
    <form
      ref={ref}
      onSubmit={formik.handleSubmit}
      style={{ width: "100%", position: "relative" }}
    >
      <AutoCompleteInput
        onChange={onChange}
        onBlur={onBlur}
        value={formik.values.query}
        name="query"
        type="text"
        placeHolder={placeHolder}
        autoComplete="off"
        show={show}
        dropdownRef={dropdownRef}
      >
        {renderOptions()}
      </AutoCompleteInput>
    </form>
  );
}

export default TwitSearch;
