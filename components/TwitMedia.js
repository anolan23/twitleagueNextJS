import React, { useState, useEffect } from 'react';

import twitMedia from '../sass/components/TwitMedia.module.scss';
import TwitIcon from './TwitIcon';
import ReactPlayer from 'react-player';

function TwitMedia({ media, onClick, close }) {
  const renderClose = () => {
    if (close) {
      return (
        <div onClick={onClick} className={twitMedia['twit-media__close']}>
          <TwitIcon
            className={twitMedia['twit-media__icon']}
            icon="/sprites.svg#icon-x"
          />
        </div>
      );
    } else {
      return null;
    }
  };

  const renderVideo = () => {
    if (media === null) {
      return null;
    } else {
      return media.map((mediaItem, index) => {
        if (mediaItem.type.includes('mp4') || mediaItem.type.includes('link')) {
          return (
            <div key={index} className={twitMedia['twit-media__file']}>
              <ReactPlayer
                controls
                muted
                className={twitMedia['twit-media__player']}
                url={mediaItem.location}
                height="100%"
                width="100%"
              ></ReactPlayer>
            </div>
          );
        } else {
          return null;
        }
      });
    }
  };

  const renderImages = () => {
    if (media === null) {
      return null;
    } else {
      return media.map((mediaItem, index) => {
        if (
          mediaItem.type.includes('png') ||
          mediaItem.type.includes('jpeg') ||
          mediaItem.type.includes('svg')
        ) {
          return (
            <div
              key={index}
              className={twitMedia['twit-media__gallery__image-holder']}
            >
              <div
                style={{ backgroundImage: `url(${mediaItem.location})` }}
                alt="post-image"
                className={
                  twitMedia['twit-media__gallery__image-holder__image']
                }
              ></div>
            </div>
          );
        } else {
          return null;
        }
      });
    }
  };

  return (
    <div className={twitMedia['twit-media']}>
      {renderClose()}
      {renderVideo()}
      <div className={twitMedia['twit-media__gallery']}>{renderImages()}</div>
    </div>
  );
}

export default TwitMedia;
