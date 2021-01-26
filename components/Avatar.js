import React from 'react';

import avatar from "../sass/components/Avatar.module.scss";

function Avatar(props) {
  const defaultImageUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  return (
        <img 
          onClick={props.onClick}
          style={props.style} 
          className={`${props.className} ${avatar["avatar"]}`}  
          src={props.src?props.src:defaultImageUrl} 
          alt="avatar"
        >
        </img>
  );
}

export default Avatar;