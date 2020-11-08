import React from 'react';
import WatchListCard from './WatchListCard';
import Figure from "react-bootstrap/Figure"

function LeftColumn() {
  return(
    <React.Fragment>
      <WatchListCard/>
      <Figure>
        <Figure.Image
                  width="100%"
                  height="auto"
                  alt="171x180"
                  src="https://via.placeholder.com/300x600"
                  className="ad"
        />
      </Figure>
      
    </React.Fragment>
    
  )
}

export default LeftColumn;
