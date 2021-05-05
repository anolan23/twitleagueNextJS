import React, {useState, useEffect, useRef} from "react";
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import List from 'react-virtualized/dist/commonjs/List';
import { CellMeasurer, CellMeasurerCache, WindowScroller } from 'react-virtualized';
import 'react-virtualized/styles.css'; // only needs to be imported once

import Post from "./Post";
import {fetchHomeTimeline} from "../actions";

function InfinitePosts({getDataFromServer}) {

  const [posts, setPosts] = useState([])
  let isNextPageLoading;
  let hasNextPage = true;

  const cache = new CellMeasurerCache({
      defaultHeight: 100,
      fixedWidth: true
    });

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const rowCount = hasNextPage ? posts.length + 1 : posts.length;

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  // // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({index}) => {
    console.log("isRowLoaded",!hasNextPage || index < posts.length, "index", index, "posts.length", posts.length)
    return !hasNextPage || index < posts.length;
  }

  async function loadNextPage ({startIndex, stopIndex}) {
    isNextPageLoading = true;
    const results = await fetchHomeTimeline(11, startIndex, stopIndex);
    console.log("loadNextPage", `startIndex: ${startIndex}, stopIndex: ${stopIndex}`)
    const newPosts = posts.concat(results);
    cache.clearAll();
    setPosts(newPosts);
    console.log(posts);
    isNextPageLoading = false;

  }

  function rowRenderer ({ key, index, style, parent}) {
    return (
      <CellMeasurer
          cache={cache}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}          
      >
          <div style={style}>
              <Post post={posts[index]}/>
          </div>
      </CellMeasurer>
      
    )
  }
      
  return (
          <InfiniteLoader
              isRowLoaded={isRowLoaded}
              loadMoreRows={loadMoreRows}
              rowCount={10000}
              minimumBatchSize={50}
              >
              {({ onRowsRendered, registerChild }) => (
                  <WindowScroller>
                      {({ height, isScrolling, onChildScroll, scrollTop }) => (
                          <List
                              autoHeight
                              height={height}
                              isScrolling={isScrolling}
                              onScroll={onChildScroll}
                              deferredMeasurementCache={cache}
                              onRowsRendered={onRowsRendered}
                              ref={registerChild}
                              rowCount={posts.length + 1}
                              rowHeight={cache.rowHeight}
                              rowRenderer={rowRenderer}
                              scrollTop={scrollTop}
                              width={600}
                              overscanRowCount={5}
                              />
                      )}
                  </WindowScroller>
              )}
          </InfiniteLoader>
      );
  }

  export default InfinitePosts;