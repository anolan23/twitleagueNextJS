import React, { useState, useEffect, useRef } from "react";
import reactStringReplace from "react-string-replace";
import ContentEditable from "react-contenteditable";

import mainInput from "../sass/components/MainInput.module.scss";
import useUser from "../lib/useUser";
import TwitButton from "./TwitButton";
import TwitMedia from "./TwitMedia";
import Avatar from "./Avatar";
import TwitDropdown from "./TwitDropdown";
import TwitItem from "./TwitItem";
import backend from "../lib/backend";
import TwitBadge from "./TwitBadge";
import TwitIcon from "./TwitIcon";
import { uploadToS3 } from "../lib/aws-helpers";
import { setCaret } from "../lib/twit-helpers";
import ReactPlayer from "react-player";
import TwitAlert from "./TwitAlert";

function MainInput({
  expanded,
  onSubmit,
  buttonText,
  compose,
  placeHolder,
  toggleGifPopup,
  initialValue,
  inputRef,
  focusOnMount,
}) {
  const { user } = useUser();
  const contentEditableRef = useRef();
  const hiddenFileInput = useRef(null);
  const dropdownRef = useRef(null);
  const [post, setPost] = useState({
    body: null,
    outlook: null,
  });
  const html = useRef(initialValue ? `${initialValue} ` : "");
  const [createdPost, setCreatedPost] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [options, setOptions] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [media, setMedia] = useState(null);
  const [files, setFiles] = useState(null);
  const allowableChars = 300;
  const chars = () =>
    contentEditableRef.current
      ? contentEditableRef.current.innerText.length
      : 0;
  const expandStyle = expanded
    ? mainInput["main-input__text-area--expanded"]
    : null;

  useEffect(() => {
    window.addEventListener("click", clickOutsideDropdown);
    window.addEventListener("gif-click", onGifClick);
    if (focusOnMount) {
      setCaret(contentEditableRef.current);
    }
    if (initialValue) {
      const { innerText } = contentEditableRef.current;
      html.current = textToHtml(innerText);
    }

    return () => {
      window.removeEventListener("click", clickOutsideDropdown);
      window.removeEventListener("gif-click", onGifClick);
    };
  }, []);

  const clickOutsideDropdown = (event) => {
    if (!dropdownRef.current) {
      return;
    }
    if (dropdownRef.current.contains(event.target)) {
      return;
    }
    setShowDropdown(false);
  };

  function onKeyDown(event) {
    smartTyping(event);
  }

  function smartTyping(event) {
    const selection = getSelection();
    if (selection.type === "Caret") {
      const parentElement = selection.anchorNode.parentElement;
      if (parentElement) {
        const id = parentElement.id;
        const { innerText } = parentElement;
        if (id === "team") {
          teamSearch(innerText);
        } else if (id === "user") {
          userSearch(innerText);
        } else if (event.keyCode !== 38 && event.keyCode !== 40) {
          setShowDropdown(false);
          setCursor(0);
        }
      } else {
        setShowDropdown(false);
        setCursor(0);
      }
    }
  }

  const refHandler = (ref) => {
    if (inputRef) {
      inputRef.current = ref;
    }
    contentEditableRef.current = ref;
  };

  const onGifClick = (event) => {
    setMedia([{ location: event.detail.gif.id, type: "giphy" }]);
  };

  const teamSearch = async (search) => {
    const searchTerm = search.substring(1);
    if (!searchTerm) {
      return;
    }
    const teams = await backend.get("/api/teams", {
      params: {
        search: searchTerm,
      },
    });
    setOptions(teams.data);
    setShowDropdown(true);
  };

  const userSearch = async (search) => {
    const searchTerm = search.substring(1);
    if (!searchTerm) {
      return;
    }
    const users = await backend.get("/api/users", {
      params: {
        search: searchTerm,
      },
    });
    setOptions(users.data);
    setShowDropdown(true);
  };

  function onChange(event) {
    const { innerText } = event.currentTarget;
    let prettyHtml = textToHtml(innerText);
    html.current = prettyHtml;
  }

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
    const _post = await onSubmit(newPost);
    setCreatedPost(_post);
    setMedia(null);
    setFiles(null);
    html.current = "";
    setShowAlert(true);
  };

  const handleSubmit = async (event) => {
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
      const _post = await onSubmit(newPost);
      setCreatedPost(_post);
      setMedia(null);
      setFiles(null);
      html.current = "";
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

  const onOptionClick = (option) => {
    const selection = getSelection();
    if (selection.type === "Caret") {
      const { parentElement } = selection.anchorNode;
      if (parentElement) {
        console.log(parentElement);
        const id = parentElement.id;
        if (id === "team") {
          parentElement.innerText = `${option.abbrev} `;
          const _html = contentEditableRef.current.innerHTML;
          html.current = _html;
          setCaret(contentEditableRef.current);

          setShowDropdown(false);
          setCursor(0);
        } else if (id === "user") {
          parentElement.innerText = `@${option.username} `;
          const _html = contentEditableRef.current.innerHTML;
          html.current = _html;
          setCaret(contentEditableRef.current);
          setShowDropdown(false);
          setCursor(0);
        } else {
          setShowDropdown(false);
          setCursor(0);
        }
      }
    }
  };

  const onMoneyClick = () => {
    let _html = html.current;
    _html = _html.concat("$");
    html.current = _html;
    contentEditableRef.current.focus();
  };

  const onAtClick = () => {
    let _html = html.current;
    _html = _html.concat("@");
    html.current = _html;
    contentEditableRef.current.focus();
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
          {buttonText}
        </TwitButton>
      </div>
    );
  };

  return (
    <React.Fragment>
      <form
        id="main-input-form"
        className={
          compose
            ? `${mainInput["main-input"]} ${mainInput["main-input__compose"]}`
            : mainInput["main-input"]
        }
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
      >
        <Avatar
          roundedCircle
          className={mainInput["main-input__image"]}
          src={user ? user.avatar : null}
        />
        <div className={mainInput["main-input__text-area-container"]}>
          <ContentEditable
            className={`${mainInput["main-input__text-area"]} ${expandStyle}`}
            onChange={onChange}
            html={html.current}
            innerRef={contentEditableRef}
            onKeyDown={onKeyDown}
            disabled={false}
            placeholder={placeHolder}
          />
          <div className={mainInput["main-input__dropdown-wrapper"]}>
            <TwitDropdown
              show={showDropdown}
              className={mainInput["main-input__dropdown-wrapper__dropdown"]}
              dropdownRef={dropdownRef}
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
              onClick={toggleGifPopup}
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

  function textToHtml(text) {
    let replacedText = text;
    let newPost = { ...post, body: replacedText };
    setPost(newPost);
    reactStringReplace(
      replacedText,
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
    replacedText = reactStringReplace(
      replacedText,
      /\$(\w+)/g,
      (match, i) => `<a class="twit-link" id="team">$${match}</a>`
    );
    replacedText = reactStringReplace(
      replacedText,
      /\@(\w+)/g,
      (match, i) => `<a class="twit-link" id="user">@${match}</a>`
    );
    replacedText = reactStringReplace(
      replacedText,
      /(https?:\/\/\S+)/g,
      (match, i) => `<a class="twit-link" id="link">${match}</a>`
    );
    replacedText = replacedText.join("");
    return replacedText;
  }
}

export default MainInput;
