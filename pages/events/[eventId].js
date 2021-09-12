import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";

import MainBody from "../../components/MainBody";
import useUser from "../../lib/useUser";
import TopBar from "../../components/TopBar";
import eventsStyle from "../../sass/components/Events.module.scss";
import activePost from "../../sass/components/ActivePost.module.scss";
import {
  fetchEvent,
  fetchEventPosts,
  likeEvent,
  unLikeEvent,
  approveEvent,
  sendEventReply,
} from "../../actions";
import TwitButton from "../../components/TwitButton";
import SmallInput from "../../components/SmallInput";
import Matchup from "../../components/Matchup";
import Empty from "../../components/Empty";
import Post from "../../components/Post";
import backend from "../../lib/backend";
import Like from "../../components/Like";
import TwitSpinner from "../../components/TwitSpinner";
import UpdateScorePopup from "../../components/modals/UpdateScorePopup";
import PopupCompose from "../../components/modals/PopupCompose";
import TwitDate from "../../lib/twit-date";
import InfiniteList from "../../components/InfiniteList";

function EventsPage({ eventData }) {
  const { user } = useUser();
  const router = useRouter();
  const { query, isFallback, isReady } = router;
  const [replies, setReplies] = useState(null);
  const [showUpdateScorePopup, setShowUpdateScorePopup] = useState(false);
  const [showPopupCompose, setShowPopupCompose] = useState(false);
  const infiniteLoaderRef = useCallback(
    (ref) => {
      if (!ref) {
        return;
      }

      setReplies(null);
      ref.resetLoadMoreRowsCache();
    },
    [query]
  );

  const fetcher = async (url) => {
    const event = await backend.get(url, {
      params: {
        userId: user.id,
      },
    });
    return event.data;
  };
  const { data: event, mutate } = useSWR(
    eventData && user ? `/api/events/${eventData.id}` : null,
    fetcher,
    {
      initialData: eventData,
      revalidateOnMount: true,
      revalidateOnFocus: false,
    }
  );

  if (router.isFallback) {
    return <TwitSpinner size={50} />;
  }

  const { season, home_season_team, away_season_team } = event;
  const authorizedUsers = [
    event.owner_id,
    home_season_team.owner_id,
    away_season_team.owner_id,
  ];

  const onUpdateScoreClick = () => {
    setShowUpdateScorePopup(true);
  };

  const onApproveClick = () => {
    approveEvent(event.id);
  };

  const onLikeClick = async (e) => {
    e.stopPropagation();
    if (!user || !user.isSignedIn) {
      return;
    } else {
      if (!event.liked) {
        await likeEvent(event.id, user.id);
        mutate();
      } else {
        await unLikeEvent(event.id, user.id);
        mutate();
      }
    }
  };

  async function onReplySubmit(newPost) {
    try {
      const replyObj = { ...newPost, event_conversation_id: event.id };
      const reply = await sendEventReply(replyObj, user.id);
      setReplies((prevArray) => [reply, ...prevArray]);
      return reply;
    } catch (error) {
      console.log(error);
    }
  }

  function getData(startIndex, stopIndex) {
    return fetchEventPosts({
      eventId: event.id,
      userId: user.id,
      startIndex,
      stopIndex,
    });
  }

  function updateReplies(reply) {
    let newReplies = [...replies];
    let index = newReplies.findIndex((newReply) => newReply.id === reply.id);
    newReplies[index] = reply;
    setReplies(newReplies);
  }

  const renderEvent = () => {
    if (event === null) {
      return <TwitSpinner size={50} />;
    } else if (event.length === 0) {
      return null;
    } else {
      return (
        <div className={eventsStyle["events__event"]}>
          <Matchup event={event} />
          <div className={activePost["active-post__timestamp"]}>
            {TwitDate.dynamicPostDate(event.created_at)} · twitleague Web App
          </div>
          <div className={activePost["active-post__stats"]}>
            <div className={activePost["active-post__stat-box"]}>
              <span className={activePost["active-post__value"]}>
                {event.likes}
              </span>
              <span className={activePost["active-post__stat"]}>Likes</span>
            </div>
          </div>
          <div className={activePost["active-post__icons"]}>
            <div className={activePost["active-post__icons__holder"]}>
              <svg className={activePost["active-post__icon"]}>
                <use xlinkHref="/sprites.svg#icon-message-square" />
              </svg>
            </div>
            <div className={activePost["active-post__icons__holder"]}>
              <svg className={activePost["active-post__icon"]}>
                <use xlinkHref="/sprites.svg#icon-repeat" />
              </svg>
            </div>
            <div
              onClick={onLikeClick}
              className={`${activePost["active-post__icons__holder"]} ${
                event.liked
                  ? activePost["active-post__icons__holder__active"]
                  : null
              }`}
            >
              <Like
                className={activePost["active-post__icon"]}
                liked={event.liked}
              />
            </div>
            <div
              onClick={null}
              className={activePost["active-post__icons__holder"]}
            >
              <svg className={activePost["active-post__icon"]}>
                <use xlinkHref="/sprites.svg#icon-corner-up-right" />
              </svg>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderUpdateScoreAction = () => {
    if (!user) {
      return null;
    }

    if (authorizedUsers.includes(user.id) && !event.league_approved) {
      return (
        <TwitButton onClick={onUpdateScoreClick} color="primary">
          Update score
        </TwitButton>
      );
    } else {
      return null;
    }
  };

  function renderReplies() {
    if (!user || isFallback) {
      return null;
    }
    return (
      <InfiniteList
        getData={getData}
        list={replies}
        item={itemRenderer}
        updateList={(replies) => setReplies(replies)}
        infiniteLoaderRef={infiniteLoaderRef}
      />
    );
  }

  function itemRenderer(item) {
    return <Post post={item} update={updateReplies} user={user} fadeIn />;
  }

  const renderApproveAction = () => {
    if (!user) {
      return null;
    }

    if (!authorizedUsers.includes(user.id)) {
      return null;
    } else if (event.play_period === "Final") {
      if (!event.league_approved) {
        return (
          <TwitButton onClick={onApproveClick} color="primary">
            Approve
          </TwitButton>
        );
      } else {
        return (
          <TwitButton disabled color="primary">
            Approved
          </TwitButton>
        );
      }
    } else {
      return (
        <TwitButton disabled color="primary">
          Approve
        </TwitButton>
      );
    }
  };

  return (
    <React.Fragment>
      <MainBody>
        <TopBar
          main={`${away_season_team.team_name} at ${home_season_team.team_name}`}
          sub={"Event"}
        >
          <div className={eventsStyle["events__event__more-info__actions"]}>
            {renderUpdateScoreAction()}
            {renderApproveAction()}
          </div>
        </TopBar>
        <div className={eventsStyle["events"]}>{renderEvent()}</div>
        <SmallInput onClick={() => setShowPopupCompose(true)} />
        {renderReplies()}
      </MainBody>
      <UpdateScorePopup
        show={showUpdateScorePopup}
        onHide={() => setShowUpdateScorePopup(false)}
        event={event}
      />
      <PopupCompose
        show={showPopupCompose}
        onHide={() => setShowPopupCompose(false)}
        event={event}
        onSubmit={onReplySubmit}
        user={user}
      />
    </React.Fragment>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const eventId = context.params.eventId;
  const eventData = await fetchEvent(eventId);

  return {
    revalidate: 1,
    props: {
      eventData,
    }, // will be passed to the page component as props
  };
}

export default EventsPage;
