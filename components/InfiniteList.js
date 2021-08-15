import React, { useState, useEffect, useRef } from "react";
import InfiniteLoader from "react-virtualized/dist/commonjs/InfiniteLoader";
import List from "react-virtualized/dist/commonjs/List";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import {
  CellMeasurer,
  CellMeasurerCache,
  WindowScroller,
} from "react-virtualized";
import "react-virtualized/styles.css";
import TwitSpinner from "./TwitSpinner";

function InfiniteList({
  getData,
  infiniteLoaderRef,
  list,
  item,
  updateList,
  id,
}) {
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  let listRef = useRef(null);
  let hasNextPage = true;

  const cache = new CellMeasurerCache({
    defaultHeight: 200,
    fixedWidth: true,
  });

  useEffect(() => {
    window.addEventListener("resize", updateRowHeight);

    return () => window.removeEventListener("resize", updateRowHeight);
  });

  function updateRowHeight() {
    if (!listRef) {
      return;
    }
    cache.clearAll();
    listRef.current.recomputeRowHeights();
  }

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
    const rows = await getData(startIndex, stopIndex);
    if (!list) {
      updateList(rows);
    } else {
      const newList = list.concat(rows);
      updateList(newList);
    }
    setIsNextPageLoading(false);
  }

  const rowCount = () => (!list ? 1 : list.length + 1);

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
          <div style={style}>{item(list[index])}</div>
        </CellMeasurer>
      );
    }
  }

  return (
    <InfiniteLoader
      key={id}
      isRowLoaded={isRowLoaded}
      loadMoreRows={loadMoreRows}
      rowCount={10000}
      minimumBatchSize={100}
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
                  ref={(reference) => {
                    registerChild(reference);
                    listRef.current = reference;
                  }}
                  rowCount={rowCount()}
                  rowHeight={cache.rowHeight}
                  rowRenderer={rowRenderer}
                  scrollTop={scrollTop}
                  width={width}
                  overscanRowCount={5}
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
