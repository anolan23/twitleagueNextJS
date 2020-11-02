import React, {useState,useEffect} from "react";
import {connect} from "react-redux";

import TwitModal from "./TwitModal";
import {togglePostModal, createCommentOnPost} from "../../actions";
import Post from "../Post";
import TwitInput from "../TwitInput";

function TwitPostModal(props){

    const [selectedPost, setSelectedPost] = useState(props.trackedPost)
    

    useEffect(() => {
      setSelectedPost(props.trackedPost)
    }, [props.trackedPost])

    const onHide = () => {
      props.togglePostModal();
    }

    const onCommentSubmit = (event) => {
      event.preventDefault();
      props.createCommentOnPost();
    }

    const onPostClick = (post) => {
      setSelectedPost(post);
    }

    const renderComments = () => {
      if(!props.trackedPost.comments){
        return null;
      }
      const comments = Object.values(props.trackedPost.comments);
      return comments.map(comment => {
        return (
          <React.Fragment key={comment._id}>
            <Post 
              id={comment._id}
              author={comment.author} 
              content={comment.postText} 
              likes={comment.likes ? Object.keys(comment.likes).length : 0} 
              retwits={comment.retwits}
              gifId={comment.gifId}
              time={comment.dateTime}
              outlook={comment.outlook}
              onClick={() => onPostClick(comment)}
              selected={comment._id === selectedPost._id}
            />
            <TwitInput 
              hide={comment._id !== selectedPost._id} 
              expanded 
              onSubmit={onCommentSubmit} 
              initialValue={"@"+selectedPost.author}
            />
          </React.Fragment>
       
        )
      })
      
      
    }

    const renderTitle = () => {
      return "Message";
    }

    const renderBody = () => {
      return (
        <React.Fragment>
          <Post 
            id={props.trackedPost._id}
            author={props.trackedPost.author} 
            content={props.trackedPost.postText} 
            likes={props.trackedPost.likes ? Object.keys(props.trackedPost.likes).length : 0} 
            retwits={props.trackedPost.retwits}
            comments={props.trackedPost.comments ? Object.keys(props.trackedPost.comments).length : 0}
            gifId={props.trackedPost.gifId}
            time={props.trackedPost.dateTime}
            outlook={props.trackedPost.outlook}
            onClick={() => onPostClick(props.trackedPost)}
            selected={props.trackedPost._id === selectedPost._id}
            />
            <TwitInput 
              hide={props.trackedPost._id !== selectedPost._id} 
              expanded 
              onSubmit={onCommentSubmit} 
              initialValue={"@"+selectedPost.author}
            />
            {renderComments()}
        </React.Fragment>
      );
    }

    const renderFooter = () => {
      return null;
    }

    return (
        <TwitModal 
        show={props.showPostModal}
        onHide={onHide} 
        title={renderTitle()} 
        body={renderBody()} 
        footer={renderFooter()}
        />
    );
}

const mapStateToProps = (state) => {
  return {
    showPostModal: state.modals.showPostModal,
    trackedPost: state.trackedPost
  }
}

export default connect(mapStateToProps, {togglePostModal, createCommentOnPost})(TwitPostModal);