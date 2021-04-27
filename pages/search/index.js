import React, {useState, useEffect} from "react";
import Head from 'next/head';
import {useRouter} from "next/router";
import {connect} from "react-redux";
import MainBody from "../../components/MainBody";
import Empty from "../../components/Empty";
import Post from "../../components/Post";
import {fetchSearchedPosts} from "../../actions";
import TopBarSearch from "../../components/TopBarSearch";
import TwitTabs from "../../components/TwitTabs";
import TwitTab from "../../components/TwitTab";

function Search(props) {
  const [posts, setPosts] = useState(null);
  const [activeTab, setActiveTab] = useState("top");

  useEffect(() => {
    start();
  }, [props.query])

  const start = async () => {
    const posts = await fetchSearchedPosts(props.query, props.userId, 10, 0);
    setPosts(posts);
  }

  const onTabClick = (event) => {
    setActiveTab(event.target.id)
  }

  const renderPosts = () => {
    if(posts === null){
      return <div>Loading posts</div>
    }
    else if(posts.length === 0){
      return <Empty main="No posts" sub={`your search '${props.query}' resulted in no posts returned`}/>
    }
    else{
      return posts.map((post, index) => {
        return (
          <Post
            key={index}
            post={post}
          />
        )
      })
    }
    
  }

    return (
      <React.Fragment>
        <MainBody>
          <TopBarSearch>
            <TwitTabs>
              <TwitTab onClick={onTabClick} active={activeTab === "top" ? true : false} title="Top" id="top"/>
              <TwitTab onClick={onTabClick} active={activeTab === "latest" ? true : false} title="Latest" id="latest"/>
              <TwitTab onClick={onTabClick} active={activeTab === "images" ? true : false} title="Images" id="images"/>
              <TwitTab onClick={onTabClick} active={activeTab === "video" ? true : false} title="Video" id="video"/>
            </TwitTabs>
          </TopBarSearch>
          <div>
              {renderPosts()}
          </div>
        </MainBody>
      </React.Fragment>
      
    )
}

export const getServerSideProps = async (context) => {
  return {
    props: context.query,
  };
};

const mapStateToProps = (state) => {
  return {userId: state.user.id}
}

export default connect(mapStateToProps)(Search);

