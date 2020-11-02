import React from 'react';
import Image from 'react-bootstrap/Image';

function Avatar(props) {
  const defaultImageUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  return (
        <Image 
          onClick={props.onClick}
          style={props.style} 
          className={props.className} 
          roundedCircle={props.roundedCircle} 
          rounded={props.rounded} 
          src={props.src?props.src:defaultImageUrl} 
          alt="user avatar image"
        >
        </Image>
  );
}

export default Avatar;