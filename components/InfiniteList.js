import React, { useState, useEffect } from "react";
import InfiniteLoader from "react-virtualized/dist/commonjs/InfiniteLoader";
import List from "react-virtualized/dist/commonjs/List";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";
import {
  CellMeasurer,
  CellMeasurerCache,
  WindowScroller,
} from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once
import Empty from "./Empty";

function InfiniteList({
  getDataFromServer,
  children,
  infiniteLoaderRef,
  list,
  updateList,
  emptyMain,
  emptySub,
  emptyActionText,
  emptyActionHref,
}) {
  let isNextPageLoading;
  let hasNextPage = true;
  const [listIsEmpty, setListIsEmpty] = useState(null);

  const cache = new CellMeasurerCache({
    defaultHeight: 100,
    fixedWidth: true,
  });

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreRows = isNextPageLoading ? () => {} : loadNextPage;

  // // Every row is loaded except for our loading indicator row.
  const isRowLoaded = ({ index }) => {
    return !hasNextPage || index < list.length;
  };

  async function loadNextPage({ startIndex, stopIndex }) {
    isNextPageLoading = true;
    const rows = await getDataFromServer(startIndex, stopIndex);
    const newList = list.concat(rows);
    cache.clearAll();
    updateList(newList);
    newList.length === 0 ? setListIsEmpty(true) : setListIsEmpty(false);
    isNextPageLoading = false;
  }

  function rowRenderer({ key, index, style, parent }) {
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div style={style}>
          {React.cloneElement(children, { listItem: list[index] })}
        </div>
      </CellMeasurer>
    );
  }

  if (!list) {
    return <div>loading list...</div>;
  } else if (listIsEmpty) {
    return (
      <Empty
        main={emptyMain}
        sub={emptySub}
        actionText={emptyActionText}
        actionHref={emptyActionHref}
      />
    );
  } else {
    return (
      <InfiniteLoader
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
                    ref={registerChild}
                    rowCount={list.length + 1}
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
}

export default InfiniteList;
