import React, { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";

import useUser from "../../lib/useUser";
import { useRouter } from "next/router";
import LeftColumn from "../../components/LeftColumn";
import RightColumn from "../../components/RightColumn";
import Empty from "../../components/Empty";
import Post from "../../components/Post";
import { search } from "../../actions";
import TopBarSearch from "../../components/TopBarSearch";
import TwitTabs from "../../components/TwitTabs";
import TwitTab from "../../components/TwitTab";
import TwitSpinner from "../../components/TwitSpinner";
import InfiniteList from "../../components/InfiniteList";
import TwitItem from "../../components/TwitItem";

function Search() {
  const { user } = useUser();
  const router = useRouter();
  const { query, filter } = router.query;
  const [list, setList] = useState(null);
  const [tab, setTab] = useState(null);
  const infiniteLoaderRef = useCallback(
    (ref) => {
      if (!ref) {
        return;
      }

      setList(null);
      ref.resetLoadMoreRowsCache();
    },
    [query, filter]
  );

  useEffect(() => {
    setTab(filter);
  }, [filter]);

  function updatePosts(post) {
    let newPosts = [...list];
    let index = newPosts.findIndex((newPost) => newPost.id === post.id);
    newPosts[index] = post;
    setList(newPosts);
  }

  function onTabClick(event) {
    router.replace({ query: { query: query, filter: event.target.id } });
  }

  function renderEmpty() {
    if (!list) {
      return null;
    } else if (list.length > 0) {
      return null;
    } else {
      const main = () => {
        switch (filter) {
          case "top":
            return "Top posts";
          case "latest":
            return "Latest posts";
          case "media":
            return "Media posts";
          case "users":
            return "Users";
          case "teams":
            return "Teams";
          case "leagues":
            return "Leagues";
          default:
            return "Invalid filter";
        }
      };
      return (
        <Empty
          main={main()}
          sub={`Your search '${query}' came back with no results`}
        />
      );
    }
  }

  function getData(startIndex, stopIndex) {
    return search({
      query,
      filter,
      userId: user.id,
      startIndex,
      stopIndex,
    });
  }

  function onSearch(query) {
    console.log(router.query);
    router.replace({ query: { ...router.query, query: query } });
  }

  function renderList() {
    if (!user || !router.isReady) {
      return null;
    }
    return (
      <InfiniteList
        getData={getData}
        list={list}
        item={itemRenderer}
        updateList={(list) => setList(list)}
        infiniteLoaderRef={infiniteLoaderRef}
      />
    );
  }

  function itemRenderer(item) {
    if (!item) {
      return null;
    }
    switch (filter) {
      case "top":
      case "latest":
      case "media":
        const { id } = item;
        return (
          <Post
            post={item}
            update={updatePosts}
            user={user}
            onClick={() => router.push(`/thread/${id}`)}
          />
        );
      case "users": {
        const { name, username, avatar } = item;
        return (
          <TwitItem
            title={name}
            subtitle={`@${username}`}
            avatar={avatar}
            onClick={() => router.push(`/users/${username}`)}
          />
        );
      }
      case "teams": {
        const { team_name, abbrev, avatar } = item;
        return (
          <TwitItem
            title={team_name}
            subtitle={abbrev}
            avatar={avatar}
            onClick={() => router.push(`/teams/${abbrev.substring(1)}`)}
          />
        );
      }
      case "leagues": {
        const { league_name, sport, avatar } = item;
        return (
          <TwitItem
            title={league_name}
            subtitle={sport}
            avatar={avatar}
            onClick={() => router.push(`/leagues/${league_name}`)}
          />
        );
      }
      default:
        return null;
    }
  }

  return (
    <React.Fragment>
      <div className="twit-container">
        <header className="header">
          <LeftColumn />
        </header>
        <main className="main">
          <TopBarSearch onSearch={onSearch} initialValue={query}>
            <TwitTabs>
              <TwitTab
                onClick={onTabClick}
                active={tab === "top" ? true : false}
                title="Top"
                id="top"
              />
              <TwitTab
                onClick={onTabClick}
                active={tab === "latest" ? true : false}
                title="Latest"
                id="latest"
              />
              <TwitTab
                onClick={onTabClick}
                active={tab === "media" ? true : false}
                title="Media"
                id="media"
              />
              <TwitTab
                onClick={onTabClick}
                active={tab === "users" ? true : false}
                title="Users"
                id="users"
              />
              <TwitTab
                onClick={onTabClick}
                active={tab === "teams" ? true : false}
                title="Teams"
                id="teams"
              />
              <TwitTab
                onClick={onTabClick}
                active={tab === "leagues" ? true : false}
                title="Leagues"
                id="leagues"
              />
            </TwitTabs>
          </TopBarSearch>
          {renderEmpty()}
          {renderList()}
        </main>
        <div className="right-bar">
          <RightColumn></RightColumn>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Search;
