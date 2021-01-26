import React from "react"
import {connect} from "react-redux"

import Avatar from "../components/Avatar";
import {togglePanel} from "../actions";

function TopBar(props){

  const goBack = () => {
    if(typeof window !== "undefined"){
      window.history.back();
    }
  }

  const renderBackArrow = () => {
    if(props.main === "Home"){
      return null;
    }
    else{
      return (
        <svg className="top-bar__icon" onClick={goBack}>
          <use xlinkHref="/sprites.svg#icon-arrow-left"/>
        </svg>
      )
    }
  }

  const renderAvatar = () => {
    if(props.main !== "Home"){
      return null;
    }
    else{
      return (
          <Avatar onClick={props.togglePanel} className="top-bar__avatar" src={props.avatar}/>
      )
    }
  }

    return(
        <div className="top-bar">
          <div className="top-bar__box">
            {renderAvatar()}
            {renderBackArrow()}
            <div className="top-bar__text">
              <div className="top-bar__text--main">{props.main}</div>
              <div className="top-bar__text--sub muted">{props.sub}</div>
            </div>
          </div>
        </div>
    )
}

const mapStateToProps = (state) => {
  return {avatar: state.user.avatar}
}

export default connect(mapStateToProps, {togglePanel})(TopBar);