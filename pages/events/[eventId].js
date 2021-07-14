import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { toggleUpdateScorePopup, approveEvent } from "../../actions";
import { connect } from "react-redux";
import useSWR, { mutate } from "swr";

import MainBody from "../../components/MainBody";
import useUser from "../../lib/useUser";
import TopBar from "../../components/TopBar";
import events from "../../sass/components/Events.module.scss";
import activePost from "../../sass/components/ActivePost.module.scss";
import {
  fetchEvent,
  setEvent,
  fetchEventPosts,
  likeEvent,
  unLikeEvent,
} from "../../actions";
import TwitButton from "../../components/TwitButton";
import SmallInput from "../../components/SmallInput";
import Matchup from "../../components/Matchup";
import Empty from "../../components/Empty";
import Post from "../../components/Post";
import backend from "../../lib/backend";
import Like from "../../components/Like";
import TwitSpinner from "../../components/TwitSpinner";

function EventsPage(props) {
  const { user } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState(null);

  const fetcher = async (url) => {
    const event = await backend.get(url, {
      params: {
        userId: user.id,
      },
    });
    return event.data;
  };
  const { data: event, mutate } = useSWR(
    props.event && user ? `/api/events/${props.event.id}` : null,
    fetcher,
    { initialData: props.event, revalidateOnMount: true }
  );

  useEffect(() => {
    props.setEvent(event);
  }, [event]);

  useEffect(() => {
    getPosts();
  }, [event, user]);

  const getPosts = async () => {
    if (!event) {
      return;
    }
    if (event.id && user) {
      const posts = await fetchEventPosts(event.id, user.id);
      setPosts(posts);
    }
  };

  const onUpdateScoreClick = () => {
    props.toggleUpdateScorePopup();
  };

  const onApproveClick = () => {
    props.approveEvent(event.id);
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

  const renderEvent = () => {
    if (event === null) {
      return <TwitSpinner size={50} />;
    } else if (event.length === 0) {
      return null;
    } else {
      return (
        <div className={events["events__event"]}>
          <Matchup event={event} />
          <div className={activePost["active-post__timestamp"]}>
            {event.created_at} · twitleague Web App
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
                props.e.liked
                  ? activePost["active-post__icons__holder__active"]
                  : null
              }`}
            >
              <Like
                className={activePost["active-post__icon"]}
                liked={props.e.liked}
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
    const approvedUsers = [
      event.owner_id,
      event.team_owner_id,
      event.opponent_owner_id,
    ];
    if (approvedUsers.includes(user.id) && !event.league_approved) {
      return (
        <TwitButton onClick={onUpdateScoreClick} color="primary">
          Update score
        </TwitButton>
      );
    } else {
      return null;
    }
  };

  const renderPosts = () => {
    if (posts === null) {
      return <TwitSpinner size={50} />;
    } else if (posts.length === 0) {
      return (
        <Empty main="No posts" sub="Be the first to post about this event" />
      );
    } else {
      return posts.map((post, index) => {
        return <Post key={index} post={post} user={user} />;
      });
    }
  };

  const renderApproveAction = () => {
    if (!user) {
      return null;
    }
    const approvedUsers = [
      event.owner_id,
      event.team_owner_id,
      event.opponent_owner_id,
    ];

    if (!approvedUsers.includes(user.id)) {
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

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <MainBody>
        <TopBar main="Event">
          <div className={events["events__event__more-info__actions"]}>
            {renderUpdateScoreAction()}
            {renderApproveAction()}
          </div>
        </TopBar>
        <div className={events["events"]}>{renderEvent()}</div>
        <SmallInput />
        {renderPosts()}
      </MainBody>
    </React.Fragment>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export async function getStaticProps(context) {
  const eventId = context.params.eventId;
  const event = await fetchEvent(eventId);

  return {
    revalidate: 1,
    props: {
      event,
    }, // will be passed to the page component as props
  };
}

const mapStateToProps = (state) => {
  return {
    e: state.event,
  };
};

export default connect(mapStateToProps, {
  toggleUpdateScorePopup,
  setEvent,
  approveEvent,
})(EventsPage);
