import React from 'react';
import Link from 'next/link';

import twitButton from '../sass/components/TwitButton.module.scss';
import TwitIcon from './TwitIcon';

function TwitButton({
  color,
  size,
  outline,
  collapse,
  expanded,
  type,
  onClick,
  disabled,
  form,
  children,
  href,
  icon,
  className,
  buttonRef,
  hide,
}) {
  if (hide) {
    return null;
  }

  const determineType = () => {
    if (type === 'square') {
      return twitButton['twit-button--square'];
    } else {
      return twitButton['twit-button'];
    }
  };

  const onButtonClick = (event) => {
    if (onClick) {
      event.stopPropagation();
      onClick(event);
    }
  };

  const determineColor = () => {
    if (color === 'primary') {
      return twitButton['twit-button--primary'];
    } else if (color === 'white') {
      return twitButton['twit-button--white'];
    } else if (color === 'red') {
      return twitButton['twit-button--red'];
    }
  };

  const determineSize = () => {
    if (size === 'small') {
      return twitButton['twit-button--small'];
    } else if (size === 'large') {
      return twitButton['twit-button--large'];
    } else {
      return null;
    }
  };

  const determineOutline = () => {
    if (outline === 'primary') {
      return twitButton['twit-button--primary--outline'];
    } else if (outline === 'white') {
      return twitButton['twit-button--white--outline'];
    } else {
      return null;
    }
  };

  const determineCollapse = () => {
    if (collapse) {
      return twitButton['twit-button--collapse'];
    } else {
      return null;
    }
  };

  const determineExpanded = () => {
    if (expanded) {
      return twitButton['twit-button--expanded'];
    } else {
      return null;
    }
  };

  const renderIcon = () => {
    if (icon) {
      return (
        <TwitIcon className={twitButton['twit-button__icon']} icon={icon} />
      );
    } else return null;
  };

  if (href) {
    return (
      <Link
        href={href}
        className={`${determineType()} ${determineColor()} ${determineSize()} ${determineOutline()} ${determineCollapse()} ${determineExpanded()} ${className}`}
        onClick={onButtonClick}
        disabled={disabled}
      >
        {renderIcon()}
        {children}
      </Link>
    );
  } else {
    return (
      <button
        type="submit"
        className={`${determineType()} ${determineColor()} ${determineSize()} ${determineOutline()} ${determineCollapse()} ${determineExpanded()} ${className}`}
        onClick={onButtonClick}
        disabled={disabled}
        form={form}
        ref={buttonRef}
      >
        {renderIcon()}
        {children}
      </button>
    );
  }
}

export default TwitButton;
