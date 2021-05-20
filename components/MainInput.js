import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import reactStringReplace from "react-string-replace";
import Link from "next/link";
import ContentEditable from "react-contenteditable";

import mainInput from "../sass/components/MainInput.module.scss";
import useUser from "../lib/useUser";
import TwitButton from "./TwitButton";
import {
  toggleGifPopup,
  saveCurrentPostText,
  saveCurrentOutlook,
  togglePopupCompose,
  setMedia,
} from "../actions";
import TwitMedia from "./TwitMedia";
import Avatar from "./Avatar";
import TwitDropdown from "./TwitDropdown";
import TwitItem from "./TwitItem";
import backend from "../lib/backend";
import TwitBadge from "./TwitBadge";
import TwitIcon from "./TwitIcon";
import { uploadToS3 } from "../lib/aws-helpers";
import ReactPlayer from "react-player";
import TwitAlert from "./TwitAlert";

function MainInput(props) {
  const { user } = useUser();
  const contentEditable = useRef(null);
  const hiddenFileInput = useRef(null);
  const [post, setPost] = useState({
    body: null,
    outlook: null,
  });
  const [createdPost, setCreatedPost] = useState(null);
  const [html, setHtml] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [options, setOptions] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [media, setMedia] = useState(null);
  const [files, setFiles] = useState(null);
  const allowableChars = 300;
  const chars = () =>
    contentEditable.current ? contentEditable.current.innerText.length : 0;
  const expanded = props.expanded
    ? mainInput["main-input__text-area--expanded"]
    : null;

  useEffect(() => {
    contentEditable.current.addEventListener("keyup", (event) => {
      const selection = getSelection();
      if (selection.type === "Caret") {
        const id = selection.anchorNode.parentElement.id;
        const data = selection.anchorNode.data;
        if (id === "team") {
          teamSearch(data);
        } else if (id === "user") {
          userSearch(data);
        } else if (event.keyCode !== 38 && event.keyCode !== 40) {
          setShowDropdown(false);
          setCursor(0);
        }
      }
    });

    document.addEventListener("gif-click", onGifClick);

    return () => {
      document.removeEventListener("gif-click", onGifClick);
    };
  }, []);

  const onGifClick = (event) => {
    setMedia([{ location: event.detail.gif.id, type: "giphy" }]);
  };

  const teamSearch = async (search) => {
    const teams = await backend.get("/api/teams", {
      params: {
        search: search.substring(1),
      },
    });
    setOptions(teams.data);
    setShowDropdown(true);
  };

  const userSearch = async (search) => {
    const users = await backend.get("/api/users", {
      params: {
        search: search.substring(1),
      },
    });
    setOptions(users.data);
    setShowDropdown(true);
  };

  const handleChange = (event) => {
    let text = contentEditable.current.innerText;
    let newPost = { ...post, body: text };
    setPost(newPost);
    reactStringReplace(
      text,
      /(https?:\/\/\w?w?w?.?youtube\S+)/g,
      (match, i) => {
        if (ReactPlayer.canPlay(match)) {
          let media = [
            {
              location: match,
              type: "link",
            },
          ];
          setMedia(media);
        } else {
          setMedia(null);
        }
      }
    );
    text = reactStringReplace(
      text,
      /\$(\w+)/g,
      (match, i) => `<a class="twit-link" id="team">$${match}</a>`
    );
    text = reactStringReplace(
      text,
      /\@(\w+)/g,
      (match, i) => `<a class="twit-link" id="user">@${match}</a>`
    );
    text = reactStringReplace(
      text,
      /(https?:\/\/\S+)/g,
      (match, i) => `<a class="twit-link" id="link">${match}</a>`
    );
    text = text.join("");
    setHtml(text);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 38 && cursor > 0) {
      event.preventDefault();
      setCursor((cursor) => cursor - 1);
    } else if (event.keyCode === 40 && cursor < options.length - 1) {
      event.preventDefault();
      setCursor((cursor) => cursor + 1);
    } else if (event.keyCode === 13 || event.keyCode === 9) {
      event.preventDefault();
      onOptionClick(options[cursor]);
    }
  };

  const disabled = () => {
    return chars() === 0 || chars() > allowableChars;
  };

  const onUploadToS3 = async (uploadedFiles) => {
    let media = uploadedFiles.map((uploadedFile) => {
      let type = uploadedFile.Location.substring(
        uploadedFile.Location.lastIndexOf(".") + 1
      );
      return { location: uploadedFile.Location, type: type };
    });
    media = JSON.stringify(media);
    let newPost = { ...post, media: media };
    const _post = await props.onSubmit(newPost);
    setCreatedPost(_post);
    setMedia(null);
    setFiles(null);
    setHtml("");
    setShowAlert(true);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (files) {
      let promises = [];
      files.forEach((file) => {
        promises.push(uploadToS3(file, "posts"));
      });
      Promise.all(promises).then((uploadedFiles) =>
        onUploadToS3(uploadedFiles)
      );
    } else {
      const stringifyMedia = media ? JSON.stringify(media) : null;
      let newPost = { ...post, media: stringifyMedia };
      const _post = await props.onSubmit(newPost);
      setCreatedPost(_post);
      setMedia(null);
      setFiles(null);
      setHtml("");
      setShowAlert(true);
    }
  };

  const onTwitMediaClose = () => {
    setMedia(null);
    setFiles(null);
  };

  const renderMedia = () => {
    if (media === null) {
      return null;
    } else {
      return media.map((mediaItem, index) => {
        const mediaItemArray = [mediaItem];
        return (
          <TwitMedia
            key={index}
            close
            media={mediaItemArray}
            onClick={onTwitMediaClose}
          />
        );
      });
    }
  };

  const setCaret = (element) => {
    var range = document.createRange();
    range.setStart(element.lastChild, 0);
    var selection = window.getSelection();
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    element.focus();
  };

  const onOptionClick = (option) => {
    const selection = getSelection();
    const id = selection.anchorNode.parentElement.id;
    if (selection.type === "Caret") {
      if (id === "team") {
        selection.anchorNode.parentElement.innerHTML = `${option.abbrev}&nbsp;`;
        setCaret(contentEditable.current);
        const html = contentEditable.current.innerHTML;
        setHtml(html);
        setShowDropdown(false);
        setCursor(0);
      } else if (id === "user") {
        selection.anchorNode.parentElement.innerHTML = `@${option.username}&nbsp;`;
        setCaret(contentEditable.current);
        const html = contentEditable.current.innerHTML;
        setHtml(html);
        setShowDropdown(false);
        setCursor(0);
      }
    }
  };

  const onMoneyClick = () => {
    let _html = html;
    _html = _html.concat("$");
    setHtml(_html);
    contentEditable.current.focus();
  };

  const onAtClick = () => {
    let _html = html;
    _html = _html.concat("@");
    setHtml(_html);
    contentEditable.current.focus();
  };

  const onHotClick = () => {
    const { outlook } = post;
    if (outlook === null || !outlook) {
      let newPost = { ...post, outlook: true };
      setPost(newPost);
    } else {
      let newPost = { ...post, outlook: null };
      setPost(newPost);
    }
  };

  const onColdClick = () => {
    const { outlook } = post;
    if (outlook === null || outlook) {
      let newPost = { ...post, outlook: false };
      setPost(newPost);
    } else {
      let newPost = { ...post, outlook: null };
      setPost(newPost);
    }
  };

  const onUploadClick = (event) => {
    hiddenFileInput.current.click();
  };

  const promiseFileReader = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      }; // CHANGE to whatever function you want which would eventually call resolve
      reader.readAsDataURL(file);
    });
  };

  const handleUploadChange = (event) => {
    let files = event.target.files;
    files = Object.values(files);
    const videos = files.filter((file) => file.type.includes("video"));
    const images = files.filter((file) => file.type.includes("image"));
    const gifs = files.filter((file) => file.type.includes("gif"));
    const numVideos = videos.length;
    const numImages = images.length;
    const numGifs = gifs.length;
    let uploadData = [];

    if (numVideos === 1 && numImages === 0 && numGifs === 0) {
      const promise = Promise.resolve();
      files.map((file) =>
        promise
          .then(() => promiseFileReader(file))
          .then((dataUrl) => {
            uploadData.push({ location: dataUrl, type: file.type });
            setMedia(uploadData);
            setFiles(files);
          })
      );
    } else if (
      numImages > 0 &&
      numImages <= 4 &&
      numVideos === 0 &&
      numGifs === 0
    ) {
      const promise = Promise.resolve();
      files.map((file) =>
        promise
          .then(() => promiseFileReader(file))
          .then((dataUrl) => {
            uploadData.push({ location: dataUrl, type: file.type });
            setMedia(uploadData);
            setFiles(files);
          })
      );
    } else if (numGifs === 1 && (numVideos === 0) & (numImages === 1)) {
      const promise = Promise.resolve();
      files.map((file) =>
        promise
          .then(() => promiseFileReader(file))
          .then((dataUrl) => {
            uploadData.push({ location: dataUrl, type: file.type });
            setMedia(uploadData);
            setFiles(files);
          })
      );
    } else {
      alert("Please choose either 1 Gif or up to 4 photos");
      setFiles(null);
    }
  };

  const renderOptions = () => {
    if (!options) {
      return;
    }
    return options.map((option, index) => {
      if (option.team_name) {
        return (
          <TwitItem
            key={index}
            active={cursor === index ? true : false}
            onClick={() => onOptionClick(option)}
            avatar={option.avatar}
            title={`${option.team_name}`}
            subtitle={`${option.abbrev} · ${option.league_name}`}
          />
        );
      } else if (option.username) {
        return (
          <TwitItem
            key={index}
            active={cursor === index ? true : false}
            onClick={() => onOptionClick(option)}
            avatar={option.avatar}
            title={option.name}
            subtitle={`@${option.username}`}
          />
        );
      }
    });
  };

  const renderAction = () => {
    return (
      <div className={mainInput["main-input__action"]}>
        <div
          className={mainInput["main-input__action__char-count"]}
          disabled={chars() > allowableChars}
        >
          {allowableChars - chars()}
        </div>
        <TwitButton disabled={disabled()} color="primary">
          {props.buttonText}
        </TwitButton>
      </div>
    );
  };

  console.log(showAlert);

  return (
    <React.Fragment>
      <form
        id="main-input-form"
        className={
          props.compose
            ? `${mainInput["main-input"]} ${mainInput["main-input__compose"]}`
            : mainInput["main-input"]
        }
        onSubmit={onSubmit}
        onKeyDown={handleKeyDown}
      >
        <Avatar
          roundedCircle
          className={mainInput["main-input__image"]}
          src={user ? user.avatar : null}
        />
        <div className={mainInput["main-input__text-area-container"]}>
          <ContentEditable
            className={`${mainInput["main-input__text-area"]} ${expanded}`}
            innerRef={contentEditable}
            html={html}
            disabled={false}
            onChange={handleChange}
            placeholder={props.placeHolder}
          />
          <div className={mainInput["main-input__dropdown-wrapper"]}>
            <TwitDropdown
              show={showDropdown}
              className={mainInput["main-input__dropdown-wrapper__dropdown"]}
            >
              {renderOptions()}
            </TwitDropdown>
          </div>
        </div>

        <div className={mainInput["main-input__media-grid"]}>
          {renderMedia()}
        </div>
        <div className={mainInput["main-input__actions"]}>
          <div className={mainInput["main-input__media-types"]}>
            <TwitIcon
              onClick={onUploadClick}
              className={mainInput["main-input__media-types__icon"]}
              icon="/sprites.svg#icon-image"
            ></TwitIcon>
            <input
              multiple
              type="file"
              ref={hiddenFileInput}
              onChange={handleUploadChange}
              style={{ display: "none" }}
            ></input>
            <TwitIcon
              onClick={props.toggleGifPopup}
              className={mainInput["main-input__media-types__icon"]}
              icon="/sprites.svg#icon-plus-circle"
            >
              GIF
            </TwitIcon>
            <TwitIcon
              onClick={onMoneyClick}
              className={mainInput["main-input__media-types__icon"]}
              icon="/sprites.svg#icon-map-pin"
            >
              $
            </TwitIcon>
            <TwitIcon
              onClick={onAtClick}
              className={mainInput["main-input__media-types__icon"]}
              icon="/sprites.svg#icon-bookmark"
            >
              @
            </TwitIcon>
            <TwitBadge onClick={onHotClick} active={post.outlook === true}>
              Hot
            </TwitBadge>
            <TwitBadge onClick={onColdClick} active={post.outlook === false}>
              Cold
            </TwitBadge>
          </div>
          {renderAction()}
        </div>
      </form>
      <TwitAlert
        show={showAlert}
        onHide={() => setShowAlert(false)}
        duration={5000}
        href={createdPost ? `/thread/${createdPost.id}` : null}
        message="Post created."
        actionText="View post"
      />
    </React.Fragment>
  );
}

export default connect(null, {
  toggleGifPopup,
  saveCurrentPostText,
  saveCurrentOutlook,
  togglePopupCompose,
  setMedia,
})(MainInput);
