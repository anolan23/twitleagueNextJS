import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import InfiniteLoader from "react-virtualized/dist/commonjs/InfiniteLoader";
import List from "react-virtualized/dist/commonjs/List";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import {
  CellMeasurer,
  CellMeasurerCache,
  WindowScroller,
} from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once
import TwitSpinner from "./TwitSpinner";

function InfiniteList({
  getDataFromServer,
  children,
  infiniteLoaderRef,
  list,
  updateList,
  empty,
  id,
}) {
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  // let listRef = useRef(null);
  let hasNextPage = true;

  const cache = new CellMeasurerCache({
    defaultHeight: 100,
    fixedWidth: true,
  });

  // useLayoutEffect(() => {
  //   window.addEventListener("resize", updateRowHeight);
  //   return () => window.removeEventListener("resize", updateRowHeight);
  // }, []);

  // const updateRowHeight = () => {
  //   console.log("resize");
  //   if (listRef) {
  //     console.log("recompute");
  //     console.log(listRef);
  //     listRef.recomputeRowHeights();
  //   }
  // };

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  // // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({ index }) => {
    if (!list) {
      return false;
    } else {
      return !hasNextPage || index < list.length;
    }
  };

  async function loadNextPage({ startIndex, stopIndex }) {
    setIsNextPageLoading(true);
    const rows = await getDataFromServer(startIndex, stopIndex);
    if (!list) {
      updateList(rows);
    } else {
      const newList = list.concat(rows);
      cache.clearAll();
      updateList(newList);
    }
    setIsNextPageLoading(false);
  }

  const rowCount = () => (!list ? 1 : list.length);

  function rowRenderer({ key, index, style, parent }) {
    if (!list) {
      return <TwitSpinner key={key} style={style} size={50} />;
    } else {
      return (
        <CellMeasurer
          cache={cache}
          columnIndex={0}
          key={key}
          parent={parent}
          rowIndex={index}
        >
          <div style={style}>
            {React.cloneElement(children, {
              listItem: list[index],
            })}
          </div>
        </CellMeasurer>
      );
    }
  }

  function noRowsRenderer() {
    return <React.Fragment>{empty}</React.Fragment>;
  }

  return (
    <InfiniteLoader
      key={id}
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={10000}
      minimumBatchSize={50}
      ref={infiniteLoaderRef}
    >
      {({ onRowsRendered, registerChild }) => (
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <AutoSizer disableHeight>
              {({ width }) => (
                <List
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  deferredMeasurementCache={cache}
                  onRowsRendered={onRowsRendered}
                  ref={(ref) => {
                    registerChild(ref);
                  }}
                  rowCount={rowCount()}
                  rowHeight={cache.rowHeight}
                  rowRenderer={rowRenderer}
                  scrollTop={scrollTop}
                  width={width}
                  overscanRowCount={5}
                  noRowsRenderer={noRowsRenderer}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      )}
    </InfiniteLoader>
  );
}

export default InfiniteList;
