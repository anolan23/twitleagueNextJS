import React, {useState, useEffect} from 'react';

import banner from "../sass/components/Banner.module.scss";

function Banner(props) {
  const [error, setError] = useState(false);
  const [image, setImage] = useState(props.src);

  useEffect(() => {
    setImage(props.src);
    setError(false);
  }, [props.src])
  
  const onError = () => {
    if (!error) {
      setImage(null);
      setError(true);
    }
  }

  const renderImage = () => {
    if(error || !image){
      return null;
    }
    else{
      return (
        <img 
        onClick={props.onClick}
        className={banner["banner__image"]}  
        src={image} 
        onError={onError}
        alt="profile banner"
      />
      )
    }
  }

  return (
        <div className={banner["banner"]}>
          {renderImage()}
        </div>
  );
}

export default Banner;