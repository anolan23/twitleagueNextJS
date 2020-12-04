import React from "react"

function TopBar(){
    return(
        <div className="top-bar">
          <div className="top-bar__box">
            <svg className="top-bar__icon">
                <use xlinkHref="/sprites.svg#icon-arrow-left"/>
            </svg>
            <div className="top-bar__text">
              <div className="top-bar__text--main heading-1">White Sox</div>
              <div className="top-bar__text--sub muted">12.1k Tweets</div>
            </div>
          </div>
        </div>
    )
}
export default TopBar;