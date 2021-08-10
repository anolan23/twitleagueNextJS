import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/router";

import AutoCompleteInput from "./modals/AutoCompleteInput";
import TwitItem from "./TwitItem";
import backend from "../lib/backend";
import Divide from "./Divide";

function TwitSearch({ placeHolder }) {
  const [options, setOptions] = useState([]);
  const [show, setShow] = useState(false);
  const ref = useRef();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { query: "" },
    onSubmit: (values) => {
      router.push({
        pathname: "/search",
        query: { query: values.query },
      });
      setShow(false);
    },
  });

  useEffect(() => {
    document.body.addEventListener("click", clickOutsideInput);
    return () => {
      document.body.removeEventListener("click", clickOutsideInput);
    };
  }, []);

  const clickOutsideInput = (event) => {
    if (!ref.current) {
      return;
    }
    if (ref.current.contains(event.target)) {
      return;
    } else {
      setShow(false);
    }
  };

  const onChange = (event) => {
    const query = event.target.value;
    formik.handleChange(event);
    if (query) {
      search(query);
    } else {
      setShow(false);
    }
  };

  const search = async (query) => {
    const results = await backend.get("api/search", {
      params: { query },
    });

    setOptions(results.data);
    setShow(true);
  };

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
      return <div>Spinner</div>;
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
        value={formik.values.query}
        name="query"
        type="text"
        placeHolder={placeHolder}
        autoComplete="off"
        show={show}
      >
        {renderOptions()}
      </AutoCompleteInput>
    </form>
  );
}

export default TwitSearch;
