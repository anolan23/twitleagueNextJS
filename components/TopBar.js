import React from "react"

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

    return(
        <div className="top-bar">
          <div className="top-bar__box">
            {renderBackArrow()}
            <div className="top-bar__text">
              <div className="top-bar__text--main heading-1">{props.main}</div>
              <div className="top-bar__text--sub muted">{props.sub}</div>
            </div>
          </div>
        </div>
    )
}
export default TopBar;