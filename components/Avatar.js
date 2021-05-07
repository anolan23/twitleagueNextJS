import React, { useState, useEffect } from "react";

import avatar from "../sass/components/Avatar.module.scss";

function Avatar(props) {
  const defaultImg = props.defaultImg
    ? props.defaultImg
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  const [error, setError] = useState(false);
  const [image, setImage] = useState(props.src);

  useEffect(() => {
    setImage(props.src);
    setError(false);
  }, [props.src]);

  const onError = () => {
    if (!error) {
      setImage(defaultImg);
      setError(true);
    }
  };

  return (
    <img
      onClick={props.onClick}
      style={props.style}
      className={`${props.className} ${avatar["avatar"]}`}
      src={image ? image : defaultImg}
      onError={onError}
      alt="avatar"
    ></img>
  );
}

export default Avatar;
