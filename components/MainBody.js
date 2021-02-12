import React from 'react';

import LeftColumn from './LeftColumn';
import RightColumn from "./RightColumn";


function MainBody({children}) {
  return (
      <div className="twit-container">
        <header className="header">
          <LeftColumn/>
        </header>
        <main className="main">
          {children}
        </main>
        <div className="right-bar">
         <RightColumn/>
        </div>
    </div>
  );
}

export default MainBody;
