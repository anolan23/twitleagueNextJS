import React from 'react';

import LeftColumn from './LeftColumn';
import RightColumn from "./RightColumn";

function MainBody(props) {
  return (
      <div className="twit-container">
        <header className="header">
          <LeftColumn/>
        </header>
        <main className="main">
          {props.children}
        </main>
        <div className="right-bar">
         <RightColumn>
            {props.right}
         </RightColumn>
        </div>
    </div>
  );
}

export default MainBody;
